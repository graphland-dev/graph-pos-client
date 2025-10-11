import { ACCOUNTS_LIST_DROPDOWN } from "@/commons/components/common-gql";
import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import {
  AccountsWithPagination,
  CommonFindDocumentDto,
  Expense,
  ExpensesWithPagination,
  MatchOperator,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { formatTableColumnDate } from "@/commons/utils/dateFormat";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Drawer,
  Input,
  NumberInput,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useSetState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ViewExpenseDetails from "./components/ViewExpenseDetails";
import {
  ACCOUNTING_EXPENSE_DELETE_MUTATION,
  ACCOUNTING_EXPENSE_QUERY_LIST,
} from "./utils/query";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
  viewDetailsOpened: boolean;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const ExpenseListPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
    viewDetailsOpened: false,
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

  const [expenseViewDetails, setExpenseViewDetails] = useState<Expense | null>(
    null
  );

  // Build query variables
  const buildQueryVariables = () => {
    const graphqlFilters: CommonFindDocumentDto[] = [];

    // Add search filters for purpose
    if (filters.purpose) {
      graphqlFilters.push({
        key: "purpose",
        operator: MatchOperator.Contains,
        value: filters.purpose,
      });
    }

    // Add search filters for note
    if (filters.note) {
      graphqlFilters.push({
        key: "note",
        operator: MatchOperator.Contains,
        value: filters.note,
      });
    }

    // Add search filters for account
    if (filters.account) {
      graphqlFilters.push({
        key: "account",
        operator: MatchOperator.Eq,
        value: filters.account,
      });
    }

    // Add amount range filters
    if (filters.minAmount) {
      graphqlFilters.push({
        key: "amount",
        operator: MatchOperator.Gte,
        value: filters.minAmount,
      });
    }

    if (filters.maxAmount) {
      graphqlFilters.push({
        key: "amount",
        operator: MatchOperator.Lte,
        value: filters.maxAmount,
      });
    }

    // Add date range filters
    if (filters.startDate) {
      graphqlFilters.push({
        key: "date",
        operator: MatchOperator.Gte,
        value: filters.startDate,
      });
    }

    if (filters.endDate) {
      graphqlFilters.push({
        key: "date",
        operator: MatchOperator.Lte,
        value: filters.endDate,
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
    accounting__expenses: ExpensesWithPagination;
  }>(ACCOUNTING_EXPENSE_QUERY_LIST, {
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

  const [deleteExpenseMutation, { loading: deleting }] = useMutation(
    ACCOUNTING_EXPENSE_DELETE_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Expense deleted successfully",
          color: "green",
        });
        handleRefetch({});
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

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetchAccounts();
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const columns = useMemo<ColumnDef<Expense>[]>(
    () => [
      {
        accessor: (row: Expense) => row?.purpose || "",
        title: "Purpose",
        sortKey: "purpose",
        sortable: true,
        Filter: (setValue) => (
          <Input
            placeholder="Filter by purpose..."
            value={filters.purpose || ""}
            onChange={(e) => setValue("purpose", e.target.value)}
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row: Expense) => row?.note || "",
        title: "Note",
        sortKey: "note",
        sortable: true,
        Filter: (setValue) => (
          <Input
            placeholder="Filter by note..."
            value={filters.note || ""}
            onChange={(e) => setValue("note", e.target.value)}
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row: Expense) => (row?.date ? formatTableColumnDate(row?.date) : ""),
        title: "Date",
        sortKey: "date",
        sortable: true,
        Filter: (setValue) => (
          <div className="flex flex-col gap-2" style={{ minWidth: 200 }}>
            <DatePickerInput
              label="Start date"
              value={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(value) =>
                setValue(
                  "startDate",
                  (value && typeof value !== 'string'
                    ? (value as Date).toISOString()
                    : (value as string)) || ""
                )
              }
              size="sm"
              clearable
            />
            <DatePickerInput
              label="End date"
              value={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(value) =>
                setValue(
                  "endDate",
                  (value && typeof value !== 'string'
                    ? (value as Date).toISOString()
                    : (value as string)) || ""
                )
              }
              size="sm"
              clearable
            />
          </div>
        ),
      },
      {
        accessor: (row: Expense) =>
          `${row?.account?.name}${
            row?.account?.referenceNumber
              ? ` [${row?.account?.referenceNumber}]`
              : ""
          }`,
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
        accessor: (row: Expense) =>
          currencyNumberWithSymbolFormat(row?.amount || 0),
        title: "Amount",
        sortKey: "amount",
        sortable: true,
        Filter: (setValue) => (
          <div className="flex gap-2" style={{ minWidth: 200 }}>
            <NumberInput
              placeholder="Min"
              value={filters.minAmount ? Number(filters.minAmount) : undefined}
              onChange={(value) =>
                setValue("minAmount", value?.toString() || "")
              }
              size="sm"
              min={0}
            />
            <NumberInput
              placeholder="Max"
              value={filters.maxAmount ? Number(filters.maxAmount) : undefined}
              onChange={(value) =>
                setValue("maxAmount", value?.toString() || "")
              }
              size="sm"
              min={0}
            />
          </div>
        ),
      },
    ],
    [
      filters.purpose,
      filters.note,
      filters.account,
      filters.minAmount,
      filters.maxAmount,
      filters.startDate,
      filters.endDate,
      accountOptions,
      accountData?.accounting__accounts?.nodes,
    ]
  );

  const handleDeleteExpense = (expense: Expense) => {
    modals.openConfirmModal({
      title: "Delete Expense",
      children: (
        <Text size="sm">
          Are you sure you want to delete expense for{" "}
          <strong>{expense.purpose}</strong> with amount{" "}
          <strong>
            {currencyNumberWithSymbolFormat(expense.amount || 0)}
          </strong>
          ? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleting },
      onConfirm: () =>
        deleteExpenseMutation({
          variables: {
            where: {
              key: "_id",
              operator: MatchOperator.Eq,
              value: expense._id,
            },
          },
        }),
    });
  };

  return (
    <>
      <PageTitle title="expense-list" />
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <ExpenseForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
          accounts={accountData?.accounting__accounts?.nodes || []}
        />
      </Drawer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" fw={600}>
            Expense Management
          </Text>
          <Text size="sm" color="dimmed">
            Manage company expenses and track spending
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleRefetch({})}
            disabled={state.refetching}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {state.refetching ? "Refreshing..." : "Refresh"}
          </button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() =>
              setState({ modalOpened: true, operationType: "create" })
            }
          >
            Add Expense
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.accounting__expenses?.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.accounting__expenses?.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: Expense) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState({ viewDetailsOpened: true });
                setExpenseViewDetails(row);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <IconEye size={14} />
              Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteExpense(row);
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
        emptyMessage="No expenses found. Try adjusting your filters."
      />

      <Drawer
        padding={14}
        title={
          <Title order={4} mb={"md"}>
            Expense details
          </Title>
        }
        opened={state.viewDetailsOpened}
        onClose={() => setState({ viewDetailsOpened: false })}
        position="right"
        size={"40%"}
      >
        <ViewExpenseDetails
          expenseDetails={expenseViewDetails}
          refetch={() => {
            refetch();
          }}
        />
      </Drawer>
    </>
  );
};

export default ExpenseListPage;
