import { dateTimeFormatter, formatTableColumnDate } from "@/commons/utils/dateFormat";
import { ACCOUNT_INVENTORY_INVOICE_PAYMENTS_QUERY } from "../utils/query.invoices";
import {
  InventoryInvoicePaymentsWithPagination,
  MatchOperator,
} from "@/commons/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import {
  Anchor,
  Button,
  Drawer,
  Paper,
  Skeleton,
  Table,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useSetState } from "@mantine/hooks";
import InvoicePaymentEntry from "./InvoicePaymentEntry";

interface IProps {
  invoiceId: string;
  clientId: string;
  dueAmount: number;
  onDone?: () => void;
}

const ProductInvoiceDetailsPaymentsTable: React.FC<IProps> = ({
  invoiceId,
  clientId,
  onDone,
  dueAmount,
}) => {
  const [state, setState] = useSetState<{
    openPaymentEntry: boolean;
    paymentEntryInvoiceId: string;
  }>({
    openPaymentEntry: false,
    paymentEntryInvoiceId: "",
  });

  const { data, loading, refetch } = useQuery<{
    accounting__inventoryInvoicePayments: InventoryInvoicePaymentsWithPagination;
  }>(ACCOUNT_INVENTORY_INVOICE_PAYMENTS_QUERY, {
    variables: {
      where: {
        filters: [
          {
            key: "invoice",
            operator: MatchOperator.Eq,
            value: invoiceId,
          },
        ],
      },
    },
  });

  const paymentsThs = (
    <tr>
      <th>Payments UID</th>
      <th>Date</th>
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

  const rows = data?.accounting__inventoryInvoicePayments?.nodes?.map(
    (element) => (
      <tr key={element.inventoryInvoicePaymentUID}>
        <td>
          <Anchor
            component={Link}
            to={`/${element.tenant}/inventory-management/payments/invoice-payments/?invoiceId=${element._id}`}
          >
            {element.inventoryInvoicePaymentUID}
          </Anchor>
        </td>
        <td>{element?.date ? formatTableColumnDate(element.date) : ""}</td>
        <td>{element.netAmount} </td>
      </tr>
    )
  );

  return (
    <div>
      <Paper mb={"lg"} p={"sm"}>
        <div className="flex items-center justify-between">
          <Title order={4}>Payments</Title>
          <Button onClick={() => setState({ openPaymentEntry: true })}>
            Add Payment
          </Button>
        </div>
        <Table mt={"sm"} withColumnBorders withBorder captionSide="bottom">
          <thead className="bg-card-header">{paymentsThs}</thead>
          <tbody>{loading ? trSkeleton : rows}</tbody>
        </Table>
      </Paper>
      <Drawer
        opened={state.openPaymentEntry}
        onClose={() => setState({ openPaymentEntry: false })}
        title="Add Payment"
      >
        <InvoicePaymentEntry
          onDone={function (): void {
            onDone?.();
            refetch();
            setState({ openPaymentEntry: false });
          }}
          invoiceId={invoiceId}
          clientId={clientId}
          payableAmount={dueAmount}
        />
      </Drawer>
    </div>
  );
};

export default ProductInvoiceDetailsPaymentsTable;
