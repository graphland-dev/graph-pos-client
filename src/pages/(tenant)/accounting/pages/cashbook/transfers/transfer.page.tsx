import { ACCOUNTS_LIST_DROPDOWN } from '@/commons/components/common-gql';
import AppDatatable, {
  ColumnDef,
} from '@/commons/components/AppDatatable/AppDatatable';
import PageTitle from '@/commons/components/PageTitle';
import {
  AccountsWithPagination,
  MatchOperator,
  Transfer,
  TransfersWithPagination,
} from '@/commons/graphql-models/graphql';
import { currencyNumberWithSymbolFormat } from '@/commons/utils/commaNumber';
import { dateTimeFormatter } from '@/commons/utils/dateFormat';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Select, Text } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import TransferForm from './components/TransferForm';
import {
  ACCOUNTING_DELETE_TRANSFER_MUTATION,
  ACCOUNTING_TRANSFER_QUERY_LIST,
} from './ulits/query';

interface IState {
  modalOpened: boolean;
  operationType: 'create' | 'update';
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: 'asc' | 'desc' | null;
}

const TransferPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: 'create',
    operationId: null,
    operationPayload: {},
    refetching: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: '',
    direction: null,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Build query variables
  const buildQueryVariables = () => {
    const graphqlFilters: any[] = [];

    // Add search filters for from account
    if (filters.fromAccount) {
      graphqlFilters.push({
        key: 'fromAccount',
        operator: MatchOperator.Eq,
        value: filters.fromAccount,
      });
    }

    // Add search filters for to account
    if (filters.toAccount) {
      graphqlFilters.push({
        key: 'toAccount',
        operator: MatchOperator.Eq,
        value: filters.toAccount,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || 'createdAt',
      sort: sorting.direction === 'asc' ? 'ASC' : 'DESC',
      filters: graphqlFilters,
    };
  };

  const { data, loading, refetch } = useQuery<{
    accounting__transfers: TransfersWithPagination;
  }>(ACCOUNTING_TRANSFER_QUERY_LIST, {
    variables: {
      where: buildQueryVariables(),
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: accountData, refetch: refetchAccounts } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTS_LIST_DROPDOWN, {
    variables: {
      where: { limit: -1 },
    },
  });

  // Process account options for Select component
  const accountOptions = useMemo(() => {
    if (!accountData?.accounting__accounts?.nodes) return [];
    return accountData.accounting__accounts.nodes.map((account) => ({
      value: account._id,
      label: `${account.name} [${account.referenceNumber}]`,
    }));
  }, [accountData]);

  const [deleteTransferMutation, { loading: deleting }] = useMutation(
    ACCOUNTING_DELETE_TRANSFER_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: 'Success',
          message: 'Transfer deleted successfully',
          color: 'green',
        });
        refetch();
        refetchAccounts();
      },
      onError: (error) => {
        showNotification({
          title: 'Error',
          message: error.message,
          color: 'red',
        });
      },
    },
  );

  const handleDeleteTransfer = (transfer: Transfer) => {
    modals.openConfirmModal({
      title: 'Delete Transfer',
      children: (
        <Text size="sm">
          Are you sure you want to delete this transfer from{' '}
          <strong>{transfer.fromAccount?.name}</strong> to{' '}
          <strong>{transfer.toAccount?.name}</strong>? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', loading: deleting },
      onConfirm: () =>
        deleteTransferMutation({
          variables: {
            where: {
              key: '_id',
              operator: MatchOperator.Eq,
              value: transfer._id,
            },
          },
        }),
    });
  };

  const handleRefetch = () => {
    setState({ refetching: true });
    refetchAccounts();
    refetch({ where: buildQueryVariables() }).finally(() => {
      setState({ refetching: false });
    });
  };

  const columns = useMemo<ColumnDef<Transfer>[]>(
    () => [
      {
        accessor: (row: Transfer) =>
          `${row?.fromAccount?.name} [${row?.fromAccount?.referenceNumber}]`,
        title: 'From Account',
        sortKey: 'fromAccount',
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by from account..."
            value={filters.fromAccount || null}
            data={accountOptions}
            disabled={!accountData?.accounting__accounts?.nodes}
            onChange={(value) => setValue('fromAccount', value || '')}
            clearable
            searchable
            style={{ minWidth: 250 }}
          />
        ),
      },
      {
        accessor: (row: Transfer) =>
          `${row?.toAccount?.name} [${row?.toAccount?.referenceNumber}]`,
        title: 'To Account',
        sortKey: 'toAccount',
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by to account..."
            value={filters.toAccount || null}
            data={accountOptions}
            disabled={!accountData?.accounting__accounts?.nodes}
            onChange={(value) => setValue('toAccount', value || '')}
            clearable
            searchable
            style={{ minWidth: 250 }}
          />
        ),
      },
      {
        accessor: (row: Transfer) =>
          currencyNumberWithSymbolFormat(row?.amount || 0),
        title: 'Amount',
        sortKey: 'amount',
        sortable: true,
      },
      {
        accessor: (row: Transfer) =>
          row?.date ? dateTimeFormatter.displayDate(row?.date) : '',
        title: 'Date',
        sortKey: 'date',
        sortable: true,
      },
    ],
    [
      filters.fromAccount,
      filters.toAccount,
      accountOptions,
      accountData?.accounting__accounts?.nodes,
    ],
  );
  return (
    <>
      <PageTitle title="transfer" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Account Transfers
          </Text>
          <Text size="sm" color="dimmed">
            Manage money transfers between accounts
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefetch}
            disabled={state.refetching}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {state.refetching ? 'Refreshing...' : 'Refresh'}
          </button>
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() =>
              setState({ modalOpened: true, operationPayload: {} })
            }
          >
            Add Transfer
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.accounting__transfers?.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.accounting__transfers?.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: Transfer) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  modalOpened: true,
                  operationType: 'update',
                  operationId: row._id,
                  operationPayload: row,
                });
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 rounded-md bg-green-50 hover:bg-green-100"
            >
              <IconEdit size={14} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTransfer(row);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 rounded-md bg-red-50 hover:bg-red-100"
            >
              <IconTrash size={14} />
              Delete
            </button>
          </div>
        )}
        onSortChange={(column, direction) => {
          setSorting({ column, direction });
        }}
        onFilterChange={(column, value) => {
          setFilters((prev) => ({ ...prev, [column]: value }));
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onPaginationChange={(page, pageSize) => {
          setPagination({ page, pageSize });
        }}
        loading={loading || state.refetching}
        emptyMessage="No transfers found. Try adjusting your filters."
      />

      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <TransferForm
          onSubmissionDone={() => {
            handleRefetch();
            setState({ modalOpened: false });
          }}
          accounts={accountData?.accounting__accounts?.nodes || []}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
    </>
  );
};

export default TransferPage;
