import { gql, useQuery } from "@apollo/client";
import { Anchor, Badge, Button, Paper, Table, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import {
  MatchOperator,
  ProductReturn,
  ProductReturnsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { formatTableColumnDate } from "@/commons/utils/dateFormat";

const INVOICE_RETURNS_QUERY = gql`
  query InvoiceReturns($where: CommonPaginationDto) {
    inventory__productReturns(where: $where) {
      meta {
        totalCount
      }
      nodes {
        _id
        returnUID
        status
        reason
        returnType
        totalReturnAmount
        netRefundAmount
        processedRefundAmount
        returnDate
      }
    }
  }
`;

const statusColor = (status?: string | null) => {
  switch (status) {
    case "PENDING":
      return "yellow";
    case "APPROVED":
      return "blue";
    case "COMPLETED":
      return "green";
    case "REJECTED":
    case "CANCELLED":
      return "red";
    default:
      return "gray";
  }
};

const ProductInvoiceReturnsTable: React.FC<{ invoiceId: string; tenant?: string }>= ({ invoiceId, tenant }) => {
  const params = useParams<{ tenant: string }>();
  const effectiveTenant = tenant || params.tenant || "";

  const { data, loading } = useQuery<{
    inventory__productReturns: ProductReturnsWithPagination;
  }>(INVOICE_RETURNS_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: -1,
        filters: [
          { key: "invoice", operator: MatchOperator.Eq, value: invoiceId },
        ],
      },
    },
    skip: !invoiceId,
    fetchPolicy: "cache-and-network",
  });

  const rows = (data?.inventory__productReturns?.nodes || []).map(
    (row: ProductReturn) => (
      <tr key={row._id}>
        <td>
          <Anchor
            component={Link}
            to={`/${effectiveTenant}/inventory-management/returns/${row._id}`}
          >
            {row.returnUID}
          </Anchor>
        </td>
        <td>{formatTableColumnDate(row.returnDate as any)}</td>
        <td>
          <Badge color={statusColor(String(row.status))} variant="light">
            {String(row.status).replace("_", " ")}
          </Badge>
        </td>
        <td>{String(row.reason).replace("_", " ")}</td>
        <td className="text-right">
          {currencyNumberWithSymbolFormat(Number(row.totalReturnAmount) || 0)}
        </td>
        <td className="text-right">
          {currencyNumberWithSymbolFormat(Number(row.netRefundAmount) || 0)}
        </td>
      </tr>
    )
  );

  return (
    <Paper p={"sm"} withBorder>
      <div className="flex items-center justify-between mb-2">
        <Title order={4}>Returns</Title>
        <Button
          size="xs"
          leftIcon={<IconPlus size={14} />}
          component={Link}
          to={`/${effectiveTenant}/inventory-management/returns/create/${invoiceId}`}
        >
          Create Return
        </Button>
      </div>
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Return ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Reason</th>
            <th className="text-right">Return Amount</th>
            <th className="text-right">Net Refund</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>Loading...</td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6}>No returns for this invoice yet.</td>
            </tr>
          ) : (
            rows
          )}
        </tbody>
      </Table>
    </Paper>
  );
};

export default ProductInvoiceReturnsTable;

