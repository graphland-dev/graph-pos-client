import { ACCOUNTS_LIST_DROPDOWN } from "@/commons/components/common-gql";
import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import {
  Accounting_Transaction_Source,
  AccountsWithPagination,
  MatchOperator,
  Transaction,
  TransactionsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { dateTimeFormatter } from "@/commons/utils/dateFormat";
import { useMutation, useQuery } from "@apollo/client";
import { Badge, Button, Drawer, Select, Text } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import BalanceAdjustmentForm from "./components/BalanceAdjustmentForm";
import {
  ACCOUNTING_TRANSACTION_QUERY,
  ACCOUNT_REMOVE_TRANSACTION,
} from "./utils/query";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
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
  direction: "asc" | "desc" | null;
}

const AdjustmentPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: "",
    direction: null,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Build query variables
  const buildQueryVariables = () => {
    const graphqlFilters: any[] = [
      {
        key: "source",
        operator: MatchOperator.Eq,
        value: Accounting_Transaction_Source.BalanceAdjustment,
      },
    ];

    // Add search filters for account
    if (filters.account) {
      graphqlFilters.push({
        key: "account",
        operator: MatchOperator.Eq,
        value: filters.account,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? "ASC" : "DESC",
      filters: graphqlFilters,
    };
  };

  const { data, loading, refetch } = useQuery<{
    accounting__transactions: TransactionsWithPagination;
  }>(ACCOUNTING_TRANSACTION_QUERY, {
    variables: {
      where: buildQueryVariables(),
    },
    fetchPolicy: "cache-and-network",
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

  const [deleteAccountMutation, { loading: deleting }] = useMutation(
    ACCOUNT_REMOVE_TRANSACTION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Adjustment deleted successfully",
          color: "green",
        });
        refetch();
        refetchAccounts();
      },
      onError: (error) => {
        showNotification({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    }
  );

  const handleRefetch = () => {
    setState({ refetching: true });
    refetchAccounts();
    refetch({ where: buildQueryVariables() }).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteAdjustment = (transaction: Transaction) => {
    modals.openConfirmModal({
      title: "Delete Adjustment",
      children: (
        <Text size="sm">
          Are you sure you want to delete this balance adjustment for{" "}
          <strong>{transaction.account?.name}</strong>? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleting },
      onConfirm: () =>
        deleteAccountMutation({
          variables: {
            where: {
              key: "_id",
              operator: MatchOperator.Eq,
              value: transaction._id,
            },
          },
        }),
    });
  };

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessor: (row: Transaction) =>
          `${row?.account?.name} [${row?.account?.referenceNumber}]`,
        title: "Account",
        sortKey: "account",
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by account..."
            value={filters.account || null}
            data={accountOptions}
            disabled={!accountData?.accounting__accounts?.nodes}
            onChange={(value) => setValue("account", value || "")}
            clearable
            searchable
            style={{ minWidth: 250 }}
          />
        ),
      },
      {
        accessor: (row: Transaction) => row?.account?.brunchName || "",
        title: "Branch Name",
        sortKey: "account.brunchName",
        sortable: true,
      },
      {
        accessor: (row: Transaction) =>
          currencyNumberWithSymbolFormat(row?.amount || 0),
        title: "Amount",
        sortKey: "amount",
        sortable: true,
      },
      {
        accessor: (row: Transaction) => {
          return row?.type === "DEBIT" ? (
            <Badge color="red">Reduce Balance</Badge>
          ) : (
            <Badge color="green">Add Balance</Badge>
          );
        },
        title: "Type",
        sortKey: "type",
        sortable: true,
      },
      {
        accessor: (row: Transaction) =>
          row?.createdAt ? dateTimeFormatter.displayDate(row?.createdAt) : "",
        title: "Date",
        sortKey: "createdAt",
        sortable: true,
      },
    ],
    [filters.account, accountOptions, accountData?.accounting__accounts?.nodes]
  );

  return (
    <>
      <PageTitle title="adjustment" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" fw={600}>
            Balance Adjustments
          </Text>
          <Text size="sm" color="dimmed">
            Manage account balance adjustments
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="subtle"
            onClick={handleRefetch}
            disabled={state.refetching}
          >
            {state.refetching ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() =>
              setState({ modalOpened: true, operationType: "create" })
            }
          >
            Add Adjustment
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.accounting__transactions.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.accounting__transactions.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: Transaction) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAdjustment(row);
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
        emptyMessage="No balance adjustments found. Try adjusting your filters."
      />

      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <BalanceAdjustmentForm
          onSubmissionDone={() => {
            handleRefetch();
            setState({ modalOpened: false });
          }}
          accounts={accountData?.accounting__accounts?.nodes || []}
        />
      </Drawer>
    </>
  );
};

export default AdjustmentPage;
