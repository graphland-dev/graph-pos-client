import {
  ProductDiscountMode,
  ProductInvoice,
} from "@/commons/graphql-models/graphql";
import currencyNumberFormat from "@/commons/utils/commaNumber";
import dateFormat from "@/commons/utils/dateFormat";
import {
  Anchor,
  Divider,
  Paper,
  Skeleton,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import ProductInvoiceDetailsTable from "./ProductInvoiceDetailsTable";

const ProductInvoiceDetails: React.FC<{
  details: ProductInvoice;
  loading: boolean;
}> = ({ details, loading }) => {
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
        <th>{currencyNumberFormat(details.netSellPrice || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Total vat amount
        </th>
        <th>{currencyNumberFormat(details.netTaxAmount || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Total Item wise discount
        </th>
        <th>{currencyNumberFormat(details.netSubtotalDiscount || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Extra discount{" "}
          {details.invoiceDiscountMode == ProductDiscountMode.Percentage
            ? `(${details.invoiceDiscountPercentage}%)`
            : ""}
        </th>
        <th>{currencyNumberFormat(details.invoiceDiscountAmount || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Total applied discount
        </th>
        <th>{currencyNumberFormat(details.netDiscountAmount || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Net Profit (Purchase price - Sell price)
        </th>
        <th>{currencyNumberFormat(details.netProfit || 0)}</th>
      </tr>

      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Net payable bill (bill - discount + vat)
        </th>
        <th>{currencyNumberFormat(details.netTotal || 0)}</th>
      </tr>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th className="!text-right" colSpan={7}>
          Paid amount
        </th>
        <th>{currencyNumberFormat(details.paidAmount || 0)}</th>
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
            details.netTotal - (details.paidAmount || 0) || 0
          )}
        </th>
      </tr>
    </>
  );

  const trSkeleton = Array.from({ length: 10 })
    .fill(null)
    .map(() => (
      <tr>
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

  const rows = details.products?.map((element) => (
    <tr key={element.referenceId}>
      <td>
        <Anchor
          component={Link}
          to={`/${details?.client?.tenant}/inventory-management/products/${element.referenceId}`}
        >
          {element.name}
        </Anchor>
        {}
      </td>
      <td>{element.code} </td>
      <td>{element.unitPurchasePrice} </td>
      <td>{element.unitPrice} </td>
      <td>{element.unitSellPrice} </td>
      <td>{element.quantity} </td>
      <td>{element.taxRate * 100} % </td>
      <td>{element.taxAmount} </td>
      <td>{element.netSellPrice} </td>
      <td>{element.netProfit} </td>
      <td>{element.netAmount} </td>
    </tr>
  ));

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full gap-4">
          <Paper
            key={details._id}
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
              {details.invoiceUID}
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold">Date:</span>{" "}
              {dateFormat(details.date)}
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
                to={`/${details?.client?.tenant}/people/client?clientId=${details?.client?._id}`}
              >
                {details?.client?.name}
              </Anchor>
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold text-neutral-primary">
                {" "}
                Email:{" "}
              </span>

              {details?.client?.email}
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold text-neutral-primary">
                Contact Number:{" "}
              </span>
              {details?.client?.contactNumber}
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold text-neutral-primary">
                Address:
              </span>
              {details?.client?.address}
            </Text>
            <Text className="flex justify-between">
              <span className="font-semibold text-neutral-primary">
                create Date:
              </span>
              {dateFormat(details.client?.createdAt)}
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

        <ProductInvoiceDetailsTable id={details.invoiceUID || ""} />

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
