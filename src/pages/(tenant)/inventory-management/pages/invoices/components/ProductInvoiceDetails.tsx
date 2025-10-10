import {
  MatchOperator,
  ProductDiscountMode,
  ProductInvoice,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { dateTimeFormatter } from "@/commons/utils/dateFormat";
import { gql, useQuery } from "@apollo/client";
import {
  Anchor,
  Divider,
  Paper,
  Skeleton,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductInvoiceDetailsPaymentsTable from "./ProductInvoiceDetailsPaymentsTable";
import ProductInvoiceReturnsTable from "./ProductInvoiceReturnsTable";

const ProductInvoiceDetails: React.FC<{
  invoiceId: string;
}> = ({ invoiceId }) => {
  const query = useQuery<{
    inventory__productInvoice: ProductInvoice;
  }>(INVOICE_DETAILS_QUERY, {
    variables: {
      where: {
        key: "_id",
        operator: MatchOperator.Eq,
        value: invoiceId,
      },
    },
    skip: !invoiceId,
  });

  const invoice = useMemo(() => query.data?.inventory__productInvoice, [query]);

  const ths = (
    <Table.Tr>
      <Table.Th>Product Name</Table.Th>
      <Table.Th>Code</Table.Th>
      <Table.Th>Unit purchase price</Table.Th>
      <Table.Th>Unit label price</Table.Th>
      <Table.Th>Unit sell price</Table.Th>
      <Table.Th>Quantity</Table.Th>
      <Table.Th>Tax rate</Table.Th>
      <Table.Th>Tax amount</Table.Th>
      <Table.Th>Net sell price</Table.Th>
      <Table.Th>Net Profit</Table.Th>
      <Table.Th>Net Bill</Table.Th>
    </Table.Tr>
  );

  const tfs = (
    <>
      <Table.Tr>
        <Table.Td />
        <Table.Td />
        <Table.Td />
        <Table.Td className="text-right!" colSpan={7}>
          Total sell Price
        </Table.Td>
        <Table.Td>{currencyNumberWithSymbolFormat(invoice?.netSellPrice || 0)}</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Td />
        <Table.Td />
        <Table.Td />
        <Table.Td className="text-right!" colSpan={7}>
          Total vat amount
        </Table.Td>
        <Table.Td>{currencyNumberWithSymbolFormat(invoice?.netTaxAmount || 0)}</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Td />
        <Table.Td />
        <Table.Td />
        <Table.Td className="text-right!" colSpan={7}>
          Total Item wise discount
        </Table.Td>
        <Table.Td>{currencyNumberWithSymbolFormat(invoice?.netSubtotalDiscount || 0)}</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Td />
        <Table.Td />
        <Table.Td />
        <Table.Td className="text-right!" colSpan={7}>
          Extra discount{" "}
          {invoice?.invoiceDiscountMode == ProductDiscountMode.Percentage
            ? `(${invoice?.invoiceDiscountPercentage}%)`
            : ""}
        </Table.Td>
        <Table.Td>{currencyNumberWithSymbolFormat(invoice?.invoiceDiscountAmount || 0)}</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Td />
        <Table.Td />
        <Table.Td />
        <Table.Td className="text-right!" colSpan={7}>
          Total applied discount
        </Table.Td>
        <Table.Td>{currencyNumberWithSymbolFormat(invoice?.netDiscountAmount || 0)}</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Td />
        <Table.Td />
        <Table.Td />
        <Table.Td className="text-right!" colSpan={7}>
          Net Profit (Purchase price - Sell price)
        </Table.Td>
        <Table.Td>{currencyNumberWithSymbolFormat(invoice?.netProfit || 0)}</Table.Td>
      </Table.Tr>

      <Table.Tr>
        <Table.Td />
        <Table.Td />
        <Table.Td />
        <Table.Td className="text-right!" colSpan={7}>
          Net payable bill (bill - discount + vat)
        </Table.Td>
        <Table.Td>{currencyNumberWithSymbolFormat(invoice?.netTotal || 0)}</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Td />
        <Table.Td />
        <Table.Td />
        <Table.Td className="text-right!" colSpan={7}>
          Paid amount
        </Table.Td>
        <Table.Td>{currencyNumberWithSymbolFormat(invoice?.paidAmount || 0)}</Table.Td>
      </Table.Tr>
      <Table.Tr>
        <Table.Td />
        <Table.Td />
        <Table.Td />
        <Table.Td className="text-right!" colSpan={7}>
          Due
        </Table.Td>
        <Table.Td>
          {currencyNumberWithSymbolFormat(
            (invoice?.netTotal || 0) - (invoice?.paidAmount || 0) || 0
          )}
        </Table.Td>
      </Table.Tr>
    </>
  );

  const trSkeleton = Array.from({ length: 10 })
    .fill(null)
    .map((_, index) => (
      <Table.Tr key={index}>
        <Table.Td>
          <Skeleton h={35} />
        </Table.Td>
        <Table.Td>
          <Skeleton h={35} />
        </Table.Td>
        <Table.Td>
          <Skeleton h={35} />
        </Table.Td>
        <Table.Td>
          <Skeleton h={35} />
        </Table.Td>
      </Table.Tr>
    ));

  const rows = invoice?.products?.map((element) => (
    <Table.Tr key={element?.referenceId}>
      <Table.Td>
        <Anchor
          component={Link}
          to={`/${invoice?.client?.tenant}/inventory-management/products/${element.referenceId}`}
        >
          {element?.name}
        </Anchor>
        {}
      </Table.Td>
      <Table.Td>{element?.code} </Table.Td>
      <Table.Td>{element?.unitPurchasePrice} </Table.Td>
      <Table.Td>{element?.unitPrice} </Table.Td>
      <Table.Td>{element?.unitSellPrice} </Table.Td>
      <Table.Td>{element?.quantity} </Table.Td>
      <Table.Td>{element.taxRate * 100} % </Table.Td>
      <Table.Td>{element.taxAmount} </Table.Td>
      <Table.Td>{element.netSellPrice} </Table.Td>
      <Table.Td>{element.netProfit} </Table.Td>
      <Table.Td>{element.netAmount} </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      {/* <pre>{JSON.stringify({ invoiceId, invoice }, null, 2)}</pre> */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full gap-4">
          <Paper
            key={invoice?._id}
            p={10}
            radius={5}
            shadow="sm"
            withBorder
            className="flex flex-col w-full gap-1"
          >
            <Title order={4}>Basic Info</Title>
            <Divider />
            <Text className="flex justify-between">
              <span className="font-semibold">Invoice UID:</span>{" "}
              {invoice?.invoiceUID}
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold">Date:</span>{" "}
              {dateTimeFormatter.displayDate(invoice?.date)}
            </Text>
          </Paper>

          <Paper
            p={10}
            radius={5}
            shadow="sm"
            withBorder
            className="flex flex-col w-full gap-1"
          >
            <Title order={4}>Client</Title>
            <Divider />
            <Text className="flex justify-between">
              <span className="font-semibold text-neutral-primary"> Name:</span>

              <Anchor
                component={Link}
                to={`/${invoice?.client?.tenant}/people/client?clientId=${invoice?.client?._id}`}
              >
                {invoice?.client?.name}
              </Anchor>
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold text-neutral-primary">
                {" "}
                Email:{" "}
              </span>
              {invoice?.client?.email}
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold text-neutral-primary">
                Contact Number:{" "}
              </span>
              {invoice?.client?.contactNumber}
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold text-neutral-primary">
                Address:
              </span>
              {invoice?.client?.address}
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold text-neutral-primary">
                create Date:
              </span>
              {dateTimeFormatter.displayDate(invoice?.client?.createdAt)}
            </Text>
          </Paper>
        </div>
        <Paper p={"sm"}>
          <Title order={4}>Items</Title>
          <Table mt={"sm"} withColumnBorders withTableBorder captionSide="bottom">
            <Table.Thead className="bg-card-header">{ths}</Table.Thead>
            <Table.Tbody>{query.loading ? trSkeleton : rows}</Table.Tbody>
            <Table.Tfoot>{tfs}</Table.Tfoot>
          </Table>
        </Paper>
        {invoice?.client?._id && (
          <ProductInvoiceDetailsPaymentsTable
            clientId={invoice?.client?._id || ""}
            invoiceId={invoice?._id || ""}
            dueAmount={(invoice?.netTotal || 0) - (invoice?.paidAmount || 0)}
            onDone={function (): void {
              query.refetch();
            }}
          />
        )}

        {invoice?._id && (
          <ProductInvoiceReturnsTable
            invoiceId={invoice?._id || ""}
            tenant={invoice?.tenant || undefined}
          />
        )}

        {/* <Attachments
        attachments={details.attachments ?? []}
        onUploadDone={() => {}}
        enableUploader={false}
        folder={FOLDER__NAME.PURCHASE_PAYMENTS_ATTACHMENTS}
      /> */}
      </div>
    </>
  );
};

export default ProductInvoiceDetails;

const INVOICE_DETAILS_QUERY = gql`
  query Inventory__productInvoiceDetails($where: CommonFindDocumentDto!) {
    inventory__productInvoice(where: $where) {
      _id
      tenant
      invoiceUID
      paymentStatus
      lifecycleStatus
      client {
        address
        contactNumber
        email
        name
        tenant
        attachments {
          meta
          path
          provider
        }
      }
      date
      netTaxAmount
      netSellPrice
      netSubtotalDiscount
      invoiceDiscountAmount
      invoiceDiscountMode
      invoiceDiscountPercentage
      netDiscountAmount
      subTotal
      costAmount
      netTotal
      paidAmount
      note
      source
      createdAt
      updatedAt
      committedBy {
        email
        name
        referenceId
      }
      products {
        referenceId
        name
        code
        unitPrice
        unitSellPrice
        taxRate
        taxAmount
        quantity
        unitPurchasePrice
        netSellPrice
        netPurchaseAmount
        netProfit
        discountAmount
        netSubtotal
        netAmount
      }
      client {
        _id
        name
        email
        createdAt
        tenant
      }
    }
  }
`;
