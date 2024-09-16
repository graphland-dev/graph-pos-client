import PageTitle from '@/commons/components/PageTitle';
import DataTable from '@/commons/components/DataTable.tsx';
import {
  Transaction,
  TransactionsWithPagination,
} from '@/commons/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { Badge, Tooltip } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import dayjs from 'dayjs';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import { ACCOUNTING_STATEMENTS_QUERY_LIST } from './ulits/query';

interface IState {
  modalOpened: boolean;
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
  operationType: 'create' | 'update';
}

const StatementPage = () => {
  const [state, setState] = useSetState<IState>({
    operationId: null,
    modalOpened: false,
    operationType: 'create',
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
          dayjs(row?.createdAt).format('MMMM D, YYYY h:mm A'),
        accessorKey: 'createdAt',
        header: 'Date',
      },
      {
        accessorFn: (row: Transaction) => (
          <Tooltip
            multiline
            py={12}
            color="gray"
            withArrow
            position="bottom"
            transitionProps={{ duration: 200 }}
            label={row.note}
          >
            <div className="w-32 overflow-hidden text-ellipsis">{row.note}</div>
          </Tooltip>
        ),
        accessorKey: 'note',
        header: 'Note',
      },
      {
        accessorFn: (row: Transaction) =>
          `${row?.account?.name}${
            row?.account?.referenceNumber
              ? ` [${row?.account?.referenceNumber}]`
              : ''
          }`,
        header: 'Account',
      },
      {
        accessorFn: (row: Transaction) => row?.amount,
        accessorKey: 'amount',
        header: 'Amount',
      },
      {
        accessorKey: 'source',
        header: 'Source',
      },
      {
        accessorFn: (row: Transaction) =>
          row?.type === 'DEBIT' ? (
            <Badge color="red">Debit</Badge>
          ) : (
            <Badge color="green">Credit</Badge>
          ),
        accessorKey: 'type',
        header: 'Type',
      },
    ],
    [],
  );
  return (
    <>
      <PageTitle title="statements" />
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
