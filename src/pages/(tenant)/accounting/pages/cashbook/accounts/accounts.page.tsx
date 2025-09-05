import AppDatatable, {
  ColumnDef,
} from '@/commons/components/AppDatatable/AppDatatable';
import PageTitle from '@/commons/components/PageTitle';
import {
  Account,
  AccountsWithPagination,
  MatchOperator,
} from '@/commons/graphql-models/graphql';
import { currencyNumberWithSymbolFormat } from '@/commons/utils/commaNumber';
import { formatTableColumnDate } from '@/commons/utils/dateFormat';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Input, Text } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccountForm from './components/AccountForm';
import {
  ACCOUNTING_ACCOUNTS_LIST,
  ACCOUNTING_ACCOUNT_DELETE_MUTATION,
} from './utils/query';

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

const AccountsPage = () => {
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
    const graphqlFilters = [];

    // Add search filters
    if (filters.name) {
      graphqlFilters.push({
        key: 'name',
        operator: MatchOperator.Contains,
        value: filters.name,
      });
    }

    if (filters.referenceNumber) {
      graphqlFilters.push({
        key: 'referenceNumber',
        operator: MatchOperator.Contains,
        value: filters.referenceNumber,
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
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTING_ACCOUNTS_LIST, {
    variables: {
      where: buildQueryVariables(),
    },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteAccountMutation, { loading: deleting }] = useMutation(
    ACCOUNTING_ACCOUNT_DELETE_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: 'Success',
          message: 'Account deleted successfully',
          color: 'green',
        });
        refetch();
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
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');

  const [fetchEmployee] = useLazyQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTING_ACCOUNTS_LIST, {
    fetchPolicy: 'network-only',
  });

  const handleRefetch = () => {
    setState({ refetching: true });
    refetch({ where: buildQueryVariables() }).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteAccount = (account: Account) => {
    modals.openConfirmModal({
      title: 'Delete Account',
      children: (
        <Text size="sm">
          Are you sure you want to delete account{' '}
          <strong>{account.name}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', loading: deleting },
      onConfirm: () =>
        deleteAccountMutation({
          variables: {
            where: {
              key: '_id',
              operator: MatchOperator.Eq,
              value: account._id,
            },
          },
        }),
    });
  };

  const columns = useMemo<ColumnDef<Account>[]>(
    () => [
      {
        accessor: 'name',
        title: 'Account Name',
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search account name..."
            onChange={(e) => setValue('name', e.target.value)}
          />
        ),
      },
      {
        accessor: 'referenceNumber',
        title: 'Reference',
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search reference..."
            onChange={(e) => setValue('referenceNumber', e.target.value)}
          />
        ),
      },
      {
        accessor: (row: Account) =>
          `${currencyNumberWithSymbolFormat(
            (row?.creditAmount || 0) - (row?.debitAmount || 0),
          )} BDT`,
        title: 'Balance',
        sortable: false,
      },
      {
        accessor: 'note',
        title: 'Note',
        sortable: false,
      },
      {
        accessor: (row: Account) =>
          row?.openedAt ? formatTableColumnDate(row?.openedAt) : '',
        title: 'Date',
        sortKey: 'openedAt',
        sortable: true,
      },
      {
        accessor: 'brunchName',
        title: 'Branch Name',
        sortable: true,
      },
    ],
    [],
  );

  useEffect(() => {
    if (accountId) {
      // alert(invoiceId);
      fetchEmployee({
        variables: {
          where: {
            filters: [
              {
                key: '_id',
                operator: MatchOperator.Eq,
                value: accountId,
              },
            ],
          },
        },
        onError: (err) => console.log(err),
      }).then((res) => {
        setState({
          modalOpened: true,
          operationType: 'update',
          operationId: res.data?.accounting__accounts.nodes?.[0]._id,
          operationPayload: res.data?.accounting__accounts.nodes?.[0],
        });
      });
    }
  }, [searchParams]);

  return (
    <>
      <PageTitle title="accounts" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Accounts
          </Text>
          <Text size="sm" color="dimmed">
            Manage your chart of accounts
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
              setState({ modalOpened: true, operationType: 'create' })
            }
          >
            Add Account
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.accounting__accounts.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.accounting__accounts.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: Account) => (
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
                handleDeleteAccount(row);
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
        emptyMessage="No accounts found. Try adjusting your filters."
      />

      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <AccountForm
          onSubmissionDone={() => {
            handleRefetch();
            setState({ modalOpened: false });
          }}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
    </>
  );
};

export default AccountsPage;
