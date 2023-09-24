import DataTable from "@/_app/common/data-table/DataTable";
import {
  Transaction,
  TransactionsWithPagination,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Badge } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { ACCOUNTING_STATEMENTS_QUERY_LIST } from "./ulits/query";
import dayjs from "dayjs";

interface IState {
  modalOpened: boolean;
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
  operationType: "create" | "update";
}

const StatementPage = () => {
  const [state, setState] = useSetState<IState>({
    operationId: null,
    modalOpened: false,
    operationType: "create",
    operationPayload: {},
    refetching: false,
  });

  const { data, loading, refetch } = useQuery<{
    accounting__transactions: TransactionsWithPagination;
  }>(ACCOUNTING_STATEMENTS_QUERY_LIST);

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch();
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorFn: (row: Transaction) =>
          dayjs(row?.createdAt).format("MMMM D, YYYY h:mm A"),
        accessorKey: "createdAt",
        header: "Date",
      },
      {
        accessorKey: "note",
        header: "Note",
      },
      {
        accessorFn: (row: Transaction) =>
          `${row?.account?.name}${
            row?.account?.referenceNumber
              ? ` [${row?.account?.referenceNumber}]`
              : ""
          }`,
        header: "Account",
      },
      {
        accessorFn: (row: Transaction) => row?.amount,
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorFn: (row: Transaction) =>
          row?.type === "DEBIT" ? (
            <Badge color="red">Debit</Badge>
          ) : (
            <Badge color="green">Credit</Badge>
          ),
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "source",
        header: "Source",
      },
    ],
    []
  );
  return (
    <>
      <DataTable
        columns={columns}
        data={data?.accounting__transactions?.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.accounting__transactions?.meta?.totalCount ?? 10}
        loading={loading || state.refetching}
      />
    </>
  );
};

export default StatementPage;
