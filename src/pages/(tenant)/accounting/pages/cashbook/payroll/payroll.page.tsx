import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import {
  Account,
  AccountsWithPagination,
  Employee,
  EmployeesWithPagination,
  MatchOperator,
  Payroll,
  PayrollsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { dateTimeFormatter } from "@/commons/utils/dateFormat";
import { INCREMENT_EMPLOYEE_QUERY } from "@/pages/(tenant)/people/pages/employees/increments/utils/increment.query";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, NumberInput, Select, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconListDetails, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import PayrollDetails from "./components/PayrollDetails";
import PayrollForm from "./components/PayrollForm";
import {
  PAYROLL_ACCOUNTS_QUERY,
  PAYROLL_QUERY,
  REMOVE_PAYROLL_MUTATION,
} from "./utils/payroll.query";

interface IState {
  refetching: boolean;
  payRollRow: null | Payroll;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const PayrollPage = () => {
  const [openedDrawer, drawerHandler] = useDisclosure();
  const [openedDetailsDrawer, detailsDrawerHandler] = useDisclosure();

  const [state, setState] = useSetState<IState>({
    refetching: false,
    payRollRow: null,
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

  const { data } = useQuery<{
    people__employees: EmployeesWithPagination;
  }>(INCREMENT_EMPLOYEE_QUERY);

  const { data: payRoll_accounts } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(PAYROLL_ACCOUNTS_QUERY);

  // Build query variables
  const buildQueryVariables = () => {
    const graphqlFilters: any[] = [];

    // Add search filters for employee
    if (filters.employee) {
      graphqlFilters.push({
        key: "employee",
        operator: MatchOperator.Eq,
        value: filters.employee,
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
        key: "salaryDate",
        operator: MatchOperator.Gte,
        value: filters.startDate,
      });
    }

    if (filters.endDate) {
      graphqlFilters.push({
        key: "salaryDate",
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

  const {
    data: payRolls,
    loading: fetchingPayrolls,
    refetch,
  } = useQuery<{
    accounting__payrolls: PayrollsWithPagination;
  }>(PAYROLL_QUERY, {
    variables: {
      where: buildQueryVariables(),
    },
    fetchPolicy: "cache-and-network",
  });

  // Process employee options for Select component
  const employeeOptions = useMemo(() => {
    if (!data?.people__employees?.nodes) return [];
    return data.people__employees.nodes.map((employee) => ({
      value: employee._id,
      label: employee.name,
    }));
  }, [data]);

  // Process account options for Select component
  const accountOptions = useMemo(() => {
    if (!payRoll_accounts?.accounting__accounts?.nodes) return [];
    return payRoll_accounts.accounting__accounts.nodes.map((account) => ({
      value: account._id,
      label: `${account.name} [${account.referenceNumber}]`,
    }));
  }, [payRoll_accounts]);

  const [deletePayrollMutation, { loading: deleting }] = useMutation(
    REMOVE_PAYROLL_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Payroll deleted successfully",
          color: "green",
        });
        refetch();
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
    refetch({ where: buildQueryVariables() }).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeletePayroll = (payroll: Payroll) => {
    modals.openConfirmModal({
      title: "Delete Payroll",
      children: (
        <Text size="sm">
          Are you sure you want to delete payroll for{" "}
          <strong>{payroll.employee?.name}</strong> with amount{" "}
          <strong>{currencyNumberWithSymbolFormat(payroll.amount || 0)}</strong>?
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleting },
      onConfirm: () =>
        deletePayrollMutation({
          variables: {
            where: {
              key: "_id",
              operator: MatchOperator.Eq,
              value: payroll._id,
            },
          },
        }),
    });
  };

  const columns = useMemo<ColumnDef<Payroll>[]>(
    () => [
      {
        accessor: (row: Payroll) => row?.employee?.name || "",
        title: "Employee",
        sortKey: "employee",
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by employee..."
            value={filters.employee || null}
            data={employeeOptions}
            disabled={!data?.people__employees?.nodes}
            onChange={(value) => setValue("employee", value || "")}
            clearable
            searchable
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row: Payroll) =>
          `${row?.account?.name} [${row?.account?.referenceNumber}]`,
        title: "Account",
        sortKey: "account",
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by account..."
            value={filters.account || null}
            data={accountOptions}
            disabled={!payRoll_accounts?.accounting__accounts?.nodes}
            onChange={(value) => setValue("account", value || "")}
            clearable
            searchable
            style={{ minWidth: 250 }}
          />
        ),
      },
      {
        accessor: (row: Payroll) =>
          currencyNumberWithSymbolFormat(row?.amount || 0),
        title: "Amount",
        sortKey: "amount",
        sortable: true,
        Filter: (setValue) => (
          <div className="flex gap-2" style={{ minWidth: 200 }}>
            <NumberInput
              placeholder="Min"
              value={filters.minAmount ? Number(filters.minAmount) : undefined}
              onChange={(value) => setValue("minAmount", value?.toString() || "")}
              size="sm"
              min={0}
            />
            <NumberInput
              placeholder="Max"
              value={filters.maxAmount ? Number(filters.maxAmount) : undefined}
              onChange={(value) => setValue("maxAmount", value?.toString() || "")}
              size="sm"
              min={0}
            />
          </div>
        ),
      },
      {
        accessor: (row: Payroll) =>
          row?.salaryDate ? dateTimeFormatter.displayDate(row?.salaryDate) : "",
        title: "Salary Date",
        sortKey: "salaryDate",
        sortable: true,
        Filter: (setValue) => (
          <div className="flex flex-col gap-2" style={{ minWidth: 200 }}>
            <DatePickerInput
              label="Start date"
              value={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(value: Date | null) => setValue("startDate", value?.toISOString() || "")}
              size="sm"
              clearable
            />
            <DatePickerInput
              label="End date"
              value={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(value: Date | null) => setValue("endDate", value?.toISOString() || "")}
              size="sm"
              clearable
            />
          </div>
        ),
      },
    ],
    [
      filters.employee,
      filters.account,
      filters.minAmount,
      filters.maxAmount,
      filters.startDate,
      filters.endDate,
      employeeOptions,
      accountOptions,
      data?.people__employees?.nodes,
      payRoll_accounts?.accounting__accounts?.nodes,
    ]
  );
  return (
    <>
      <PageTitle title="payroll" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Payroll Management
          </Text>
          <Text size="sm" color="dimmed">
            Manage employee payrolls and salary records
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefetch}
            disabled={state.refetching}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {state.refetching ? "Refreshing..." : "Refresh"}
          </button>
          <Button leftIcon={<IconPlus size={16} />} onClick={drawerHandler.open}>
            Add Payroll
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={payRolls?.accounting__payrolls.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: payRolls?.accounting__payrolls.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: Payroll) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  payRollRow: row,
                });
                detailsDrawerHandler.open();
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <IconListDetails size={14} />
              Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePayroll(row);
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
        loading={fetchingPayrolls || state.refetching}
        emptyMessage="No payroll records found. Try adjusting your filters."
      />

      <Drawer
        opened={openedDetailsDrawer}
        onClose={detailsDrawerHandler.close}
        position="right"
        title="Payroll details"
        withCloseButton={true}
      >
        <PayrollDetails payRollRow={state?.payRollRow as Payroll} />
      </Drawer>

      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title="Create payroll"
        withCloseButton={true}
      >
        <PayrollForm
          employees={data?.people__employees?.nodes as Employee[]}
          accounts={payRoll_accounts?.accounting__accounts?.nodes as Account[]}
          onFormSubmitted={() => {
            refetch();
            drawerHandler.close();
          }}
        />
      </Drawer>
    </>
  );
};

export default PayrollPage;
