import { ACCOUNTS_LIST_DROPDOWN } from '@/commons/components/common-gql';
import AppDatatable, {
  ColumnDef,
} from '@/commons/components/AppDatatable/AppDatatable';
import PageTitle from '@/commons/components/PageTitle';
import {
  AccountsWithPagination,
  MatchOperator,
  Transaction,
  TransactionsWithPagination,
} from '@/commons/graphql-models/graphql';
import { currencyNumberWithSymbolFormat } from '@/commons/utils/commaNumber';
import dateFormat from '@/commons/utils/dateFormat';
import { useQuery } from '@apollo/client';
import { Badge, NumberInput, Select, Text, Tooltip } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useSetState } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import { ACCOUNTING_STATEMENTS_QUERY_LIST } from './ulits/query';

interface IState {
  modalOpened: boolean;
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
  operationType: 'create' | 'update';
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: 'asc' | 'desc' | null;
}

const StatementPage = () => {
  const [state, setState] = useSetState<IState>({
    operationId: null,
    modalOpened: false,
    operationType: 'create',
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

    // Add search filters for account
    if (filters.account) {
      graphqlFilters.push({
        key: 'account',
        operator: MatchOperator.Eq,
        value: filters.account,
      });
    }

    // Add search filters for source
    if (filters.source) {
      graphqlFilters.push({
        key: 'source',
        operator: MatchOperator.Eq,
        value: filters.source,
      });
    }

    // Add search filters for type
    if (filters.type) {
      graphqlFilters.push({
        key: 'type',
        operator: MatchOperator.Eq,
        value: filters.type,
      });
    }

    // Add amount range filters
    if (filters.minAmount) {
      graphqlFilters.push({
        key: 'amount',
        operator: MatchOperator.Gte,
        value: filters.minAmount,
      });
    }

    if (filters.maxAmount) {
      graphqlFilters.push({
        key: 'amount',
        operator: MatchOperator.Lte,
        value: filters.maxAmount,
      });
    }

    // Add date range filters
    if (filters.startDate) {
      graphqlFilters.push({
        key: 'createdAt',
        operator: MatchOperator.Gte,
        value: filters.startDate,
      });
    }

    if (filters.endDate) {
      graphqlFilters.push({
        key: 'createdAt',
        operator: MatchOperator.Lte,
        value: filters.endDate,
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
    accounting__transactions: TransactionsWithPagination;
  }>(ACCOUNTING_STATEMENTS_QUERY_LIST, {
    variables: {
      where: buildQueryVariables(),
    },
    fetchPolicy: 'cache-and-network',
  });

  // Fetch accounts for dropdown filter
  const { data: accountData } = useQuery<{
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

  // Source options (these would typically come from an enum or be configured)
  const sourceOptions = useMemo(() => [
    { value: 'BalanceAdjustment', label: 'Balance Adjustment' },
    { value: 'Transfer', label: 'Transfer' },
    { value: 'Invoice', label: 'Invoice' },
    { value: 'Purchase', label: 'Purchase' },
    { value: 'Expense', label: 'Expense' },
    { value: 'Payroll', label: 'Payroll' },
  ], []);

  // Type options
  const typeOptions = useMemo(() => [
    { value: 'DEBIT', label: 'Debit' },
    { value: 'CREDIT', label: 'Credit' },
  ], []);

  const handleRefetch = () => {
    setState({ refetching: true });
    refetch({ where: buildQueryVariables() }).finally(() => {
      setState({ refetching: false });
    });
  };

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessor: (row: Transaction) =>
          row?.createdAt ? dateFormat(row?.createdAt) : '',
        title: 'Date',
        sortKey: 'createdAt',
        sortable: true,
        Filter: (setValue) => (
          <div className="flex flex-col gap-2" style={{ minWidth: 200 }}>
            <DatePickerInput
              label="Start date"
              value={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(value: Date | null) => setValue('startDate', value?.toISOString() || '')}
              size="sm"
              clearable
            />
            <DatePickerInput
              label="End date"
              value={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(value: Date | null) => setValue('endDate', value?.toISOString() || '')}
              size="sm"
              clearable
            />
          </div>
        ),
      },
      {
        accessor: (row: Transaction) => (
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
        title: 'Note',
        sortable: false,
      },
      {
        accessor: (row: Transaction) =>
          `${row?.account?.name}${
            row?.account?.referenceNumber
              ? ` [${row?.account?.referenceNumber}]`
              : ''
          }`,
        title: 'Account',
        sortKey: 'account',
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by account..."
            value={filters.account || null}
            data={accountOptions}
            disabled={!accountData?.accounting__accounts?.nodes}
            onChange={(value) => setValue('account', value || '')}
            clearable
            searchable
            style={{ minWidth: 250 }}
          />
        ),
      },
      {
        accessor: (row: Transaction) =>
          `${currencyNumberWithSymbolFormat(row?.amount || 0)} BDT`,
        title: 'Amount',
        sortKey: 'amount',
        sortable: true,
        Filter: (setValue) => (
          <div className="flex gap-2" style={{ minWidth: 200 }}>
            <NumberInput
              placeholder="Min"
              value={filters.minAmount ? Number(filters.minAmount) : undefined}
              onChange={(value) => setValue('minAmount', value?.toString() || '')}
              size="sm"
              min={0}
            />
            <NumberInput
              placeholder="Max"
              value={filters.maxAmount ? Number(filters.maxAmount) : undefined}
              onChange={(value) => setValue('maxAmount', value?.toString() || '')}
              size="sm"
              min={0}
            />
          </div>
        ),
      },
      {
        accessor: 'source',
        title: 'Source',
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by source..."
            value={filters.source || null}
            data={sourceOptions}
            onChange={(value) => setValue('source', value || '')}
            clearable
            searchable
            style={{ minWidth: 180 }}
          />
        ),
      },
      {
        accessor: (row: Transaction) =>
          row?.type === 'DEBIT' ? (
            <Badge color="red">Debit</Badge>
          ) : (
            <Badge color="green">Credit</Badge>
          ),
        title: 'Type',
        sortKey: 'type',
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by type..."
            value={filters.type || null}
            data={typeOptions}
            onChange={(value) => setValue('type', value || '')}
            clearable
            style={{ minWidth: 120 }}
          />
        ),
      },
    ],
    [
      filters.account,
      filters.source,
      filters.type,
      filters.minAmount,
      filters.maxAmount,
      filters.startDate,
      filters.endDate,
      accountOptions,
      accountData?.accounting__accounts?.nodes,
      sourceOptions,
      typeOptions,
    ],
  );
  return (
    <>
      <PageTitle title="statements" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Account Statements
          </Text>
          <Text size="sm" color="dimmed">
            View all account transactions and statements
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
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.accounting__transactions?.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.accounting__transactions?.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
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
        emptyMessage="No transactions found. Try adjusting your filters."
      />
    </>
  );
};

export default StatementPage;
