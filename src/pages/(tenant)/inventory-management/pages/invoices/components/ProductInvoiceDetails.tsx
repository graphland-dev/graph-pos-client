import {
  MatchOperator,
  ProductDiscountMode,
  ProductInvoice,
} from "@/commons/graphql-models/graphql";
import currencyNumberFormat from "@/commons/utils/commaNumber";
import dateFormat from "@/commons/utils/dateFormat";
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

const ProductInvoiceDetails: React.FC<{
  invoiceId: string;
  loading: boolean;
}> = ({ invoiceId, loading }) => {
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
  });

  const invoice = useMemo(() => query.data?.inventory__productInvoice, [query]);

  const ths = (
    <tr>
      <th>Product Name</th>
      <th>Code</th>
      <th>Unit purchase price</th>
      <th>Unit label price</th>
      <th>Unit sell price</th>
      <th>Quantity</th>
      <th>Tax rate</th>
      <th>Tax amount</th>
      <th>Net sell price</th>
      <th>Net Profit</th>
      <th>Net Bill</th>
    </tr>
  );

  const tfs = (
    <>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Total sell Price
        </th>
        <th>{currencyNumberFormat(invoice?.netSellPrice || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Total vat amount
        </th>
        <th>{currencyNumberFormat(invoice?.netTaxAmount || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Total Item wise discount
        </th>
        <th>{currencyNumberFormat(invoice?.netSubtotalDiscount || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Extra discount{" "}
          {invoice?.invoiceDiscountMode == ProductDiscountMode.Percentage
            ? `(${invoice?.invoiceDiscountPercentage}%)`
            : ""}
        </th>
        <th>{currencyNumberFormat(invoice?.invoiceDiscountAmount || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Total applied discount
        </th>
        <th>{currencyNumberFormat(invoice?.netDiscountAmount || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Net Profit (Purchase price - Sell price)
        </th>
        <th>{currencyNumberFormat(invoice?.netProfit || 0)}</th>
      </tr>

      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Net payable bill (bill - discount + vat)
        </th>
        <th>{currencyNumberFormat(invoice?.netTotal || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Paid amount
        </th>
        <th>{currencyNumberFormat(invoice?.paidAmount || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Due
        </th>
        <th>
          {currencyNumberFormat(
            (invoice?.netTotal || 0) - (invoice?.paidAmount || 0) || 0
          )}
        </th>
      </tr>
    </>
  );

  const trSkeleton = Array.from({ length: 10 })
    .fill(null)
    .map((_, index) => (
      <tr key={index}>
        <td>
          <Skeleton h={35} />
        </td>
        <td>
          <Skeleton h={35} />
        </td>
        <td>
          <Skeleton h={35} />
        </td>
        <td>
          <Skeleton h={35} />
        </td>
      </tr>
    ));

  const rows = invoice?.products?.map((element) => (
    <tr key={element?.referenceId}>
      <td>
        <Anchor
          component={Link}
          to={`/${invoice?.client?.tenant}/inventory-management/products/${element.referenceId}`}
        >
          {element?.name}
        </Anchor>
        {}
      </td>
      <td>{element?.code} </td>
      <td>{element?.unitPurchasePrice} </td>
      <td>{element?.unitPrice} </td>
      <td>{element?.unitSellPrice} </td>
      <td>{element?.quantity} </td>
      <td>{element.taxRate * 100} % </td>
      <td>{element.taxAmount} </td>
      <td>{element.netSellPrice} </td>
      <td>{element.netProfit} </td>
      <td>{element.netAmount} </td>
    </tr>
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
              {dateFormat(invoice?.date)}
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
              {dateFormat(invoice?.client?.createdAt)}
            </Text>
          </Paper>
        </div>
        <Paper p={"sm"}>
          <Title order={4}>Items</Title>
          <Table mt={"sm"} withColumnBorders withBorder captionSide="bottom">
            <thead className="bg-card-header">{ths}</thead>
            <tbody>{loading ? trSkeleton : rows}</tbody>
            <tfoot>{tfs}</tfoot>
          </Table>
        </Paper>
        {invoice?.netTotal} - {invoice?.paidAmount}
        <ProductInvoiceDetailsPaymentsTable
          clientId={invoice?.client?._id || ""}
          invoiceId={invoice?._id || ""}
          dueAmount={(invoice?.netTotal || 0) - (invoice?.paidAmount || 0)}
          onDone={function (): void {
            query.refetch();
          }}
        />
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
  query Inventory__productInvoice($where: CommonFindDocumentDto!) {
    inventory__productInvoice(where: $where) {
      _id
      tenant
      invoiceUID
      status
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
