import dateFormat from "@/_app/common/utils/dateFormat";
import {
  InventoryInvoicePayment,
  MatchOperator,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Divider, Paper, Skeleton, Table, Text, Title } from "@mantine/core";
import { INVENTORY_INVOICE_SINGLE_PAYMENT_QUERY } from "../utils/query.invoice-payments";

const InventoryInvoicePaymentDetails: React.FC<{
  id: string;
}> = ({ id }) => {
  const { data, loading } = useQuery<{
    accounting__InventoryInvoicePayment: InventoryInvoicePayment;
  }>(INVENTORY_INVOICE_SINGLE_PAYMENT_QUERY, {
    variables: {
      where: {
        key: "_id",
        operator: MatchOperator.Eq,
        value: id,
      },
    },
  });

  const ths = (
    <tr>
      <th>Payment Type</th>
      <th>Account</th>
      <th>Amount</th>
    </tr>
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

  const rows = data?.accounting__InventoryInvoicePayment?.payments?.map(
    (element) => (
      <tr key={element?.account?._id}>
        <td>
          {/* <Anchor
            component={Link}
            to={`/${details?.client?.tenant}/inventory-management/products/${element.referenceId}`}
          >
            {element?.type}
          </Anchor> */}
          {element?.type}
        </td>
        <td>{element?.account?.name} </td>
        <td>{element.amount} </td>
      </tr>
    )
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between w-full gap-4">
        <Paper
          p={10}
          radius={5}
          shadow="sm"
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Title order={4}>Basic Info</Title>
          <Divider />
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Payment UID:</span>{" "}
            {
              data?.accounting__InventoryInvoicePayment
                .inventoryInvoicePaymentUID
            }
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Po Reference:</span>

            {data?.accounting__InventoryInvoicePayment.poReference}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Recept No:</span>
            {data?.accounting__InventoryInvoicePayment.receptNo}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Reference:</span>
            {data?.accounting__InventoryInvoicePayment.reference}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Date:</span>
            {dateFormat(data?.accounting__InventoryInvoicePayment.date)}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800"> Net Amount:</span>
            {data?.accounting__InventoryInvoicePayment.netAmount}
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
            {/* <span className="font-semibold text-gray-800"> Name:</span> */}

            {/* <Anchor
              component={Link}
              to={`/${details?.client?.tenant}/people/client?clientId=${details?.client?._id}`}
            >
              {details?.client?.name}
            </Anchor> */}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800"> Name: </span>

            {data?.accounting__InventoryInvoicePayment.client?.name}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Email: </span>
            {data?.accounting__InventoryInvoicePayment.client?.email}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Address:</span>
            {data?.accounting__InventoryInvoicePayment.client?.name}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Contact Number:</span>
            {data?.accounting__InventoryInvoicePayment?.client?.name}
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={5}
          shadow="sm"
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Title order={4}>Paying Invoice</Title>
          <Divider />
          <Text className="flex justify-between">
            {/* <span className="font-semibold text-gray-800"> Name:</span> */}

            {/* <Anchor
              component={Link}
              to={`/${details?.client?.tenant}/people/client?clientId=${details?.client?._id}`}
            >
              {details?.client?.name}
            </Anchor> */}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800"> Name: </span>
            {data?.accounting__InventoryInvoicePayment.invoice?.invoiceUID}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Email: </span>
            {data?.accounting__InventoryInvoicePayment.invoice?.paidAmount}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Address:</span>
            {data?.accounting__InventoryInvoicePayment.invoice?.netTotal}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Contact Number:</span>
            {dateFormat(
              data?.accounting__InventoryInvoicePayment.invoice?.date
            )}
          </Text>
        </Paper>
      </div>

      <Table mt={"md"} withColumnBorders withBorder captionSide="bottom">
        <thead className="bg-card-header">{ths}</thead>
        <tbody>{loading ? trSkeleton : rows}</tbody>
      </Table>

      {/* <Attachments
        attachments={details.attachments ?? []}
        onUploadDone={() => {}}
        enableUploader={false}
        folder={FOLDER__NAME.PURCHASE_PAYMENTS_ATTACHMENTS}
      /> */}
    </div>
  );
};

export default InventoryInvoicePaymentDetails;
