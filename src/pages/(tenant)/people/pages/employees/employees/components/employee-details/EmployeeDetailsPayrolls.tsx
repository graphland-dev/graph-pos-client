import AppDatatable, { ColumnDef } from "@/commons/components/AppDatatable/AppDatatable";
import {
  Account,
  AccountsWithPagination,
  CommonPaginationDto,
  Employee,
  MatchOperator,
  Payroll,
  PayrollsWithPagination,
  SortType,
} from "@/commons/graphql-models/graphql";
import {
  PAYROLL_ACCOUNTS_QUERY,
  PAYROLL_QUERY,
  REMOVE_PAYROLL_MUTATION,
} from "@/pages/(tenant)/accounting/pages/cashbook/payroll/utils/payroll.query";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import EmployeePayrollsForm from "./employee_details_form/EmployeePayrollsForm";
import { confirmModal } from "@/commons/components/confirm.tsx";

interface IPayrollDetailsProps {
  employeeDetails: Employee | null;
}

interface IState {
  refetching: boolean;
}

const EmployeeDetailsPayrolls: React.FC<IPayrollDetailsProps> = ({
  employeeDetails,
}) => {
  const [openedDrawer, drawerHandler] = useDisclosure();
  const [state, setState] = useSetState<IState>({ refetching: false });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [sorting, setSorting] = useState<{
    column: string;
    direction: "asc" | "desc" | null;
  }>({ column: "createdAt", direction: "desc" });

  const { data: payRoll_accounts } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(PAYROLL_ACCOUNTS_QUERY);

  const buildWhereClause = (): CommonPaginationDto => {
    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? SortType.Asc : SortType.Desc,
      filters: [
        {
          key: "employee",
          operator: MatchOperator.Eq,
          value: employeeDetails?._id,
        },
      ],
    };
  };

  const {
    data: payRolls,
    loading: fetchingPayrolls,
    refetch,
  } = useQuery<{
    accounting__payrolls: PayrollsWithPagination;
  }>(PAYROLL_QUERY, {
    variables: { where: buildWhereClause() },
    skip: !employeeDetails?._id,
  });

  const [deletePayrollMutation] = useMutation(REMOVE_PAYROLL_MUTATION, {
    onCompleted: () => handleRefetch(),
  });

  const handleDeletePayroll = (_id: string) => {
    confirmModal({
      title: "Sure to delete payroll?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deletePayrollMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
        });
      },
    });
  };

  const handleRefetch = () => {
    setState({ refetching: true });
    refetch().finally(() => {
      setState({ refetching: false });
    });
  };

  const handleSortChange = (
    column: string,
    direction: "asc" | "desc" | null
  ) => {
    setSorting({ column, direction });
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, pageSize });
  };

  const columns = useMemo<ColumnDef<Payroll>[]>(
    () => [
      {
        accessor: (row) => row.account?.name || "N/A",
        title: "Account",
        sortKey: "account.name",
        sortable: true,
      },
      {
        accessor: "amount",
        title: "Amount",
        sortable: true,
      },
      {
        accessor: (row) =>
          `${row?.salaryMonth} - ${dayjs(row?.salaryDate).format("YYYY")}`,
        title: "Month",
        sortKey: "salaryMonth",
        sortable: true,
      },
      {
        accessor: (row) =>
          dayjs(row?.salaryDate).format("MMMM D, YYYY h:mm A"),
        title: "Date",
        sortKey: "salaryDate",
        sortable: true,
      },
    ],
    []
  );

  const ActionColumn = (row: Payroll) => (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeletePayroll(row._id);
        }}
        className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 transition-colors hover:text-red-700"
        title="Delete"
      >
        <IconTrash size={16} />
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={drawerHandler.open}
          size="sm"
          className="flex items-center gap-2"
        >
          <IconPlus size={16} />
          Add new
        </Button>
      </div>

      <AppDatatable
        columns={columns}
        data={payRolls?.accounting__payrolls.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: payRolls?.accounting__payrolls.meta?.totalCount || 0,
          currentPage: pagination.page,
        }}
        ActionColumn={ActionColumn}
        onSortChange={handleSortChange}
        onPaginationChange={handlePaginationChange}
        loading={fetchingPayrolls || state.refetching}
        emptyMessage="No payrolls found for this employee."
      />

      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title="Create Payroll"
        withCloseButton={true}
      >
        <EmployeePayrollsForm
          employeeDetails={employeeDetails}
          accounts={payRoll_accounts?.accounting__accounts?.nodes as Account[]}
          onFormSubmitted={() => {
            refetch();
            drawerHandler.close();
          }}
          currentSalary={undefined}
        />
      </Drawer>
    </div>
  );
};

export default EmployeeDetailsPayrolls;
