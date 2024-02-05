import DataTable from "@/_app/common/data-table/DataTable";
import {
  Account,
  AccountsWithPagination,
  Employee,
  MatchOperator,
  Payroll,
  PayrollsWithPagination,
} from "@/_app/graphql-models/graphql";
import {
  PAYROLL_ACCOUNTS_QUERY,
  PAYROLL_QUERY,
  REMOVE_PAYROLL_MUTATION,
} from "@/pages/(tenant)/accounting/pages/cashbook/payroll/utils/payroll.query";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import EmployeePayrollsForm from "./employee_details_form/EmployeePayrollsForm";
import { confirmModal } from "@/_app/common/confirm/confirm";

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

  const { data: payRoll_accounts } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(PAYROLL_ACCOUNTS_QUERY);

  const {
    data: payRolls,
    loading: fetchingPayrolls,
    refetch,
  } = useQuery<{
    accounting__payrolls: PayrollsWithPagination;
  }>(PAYROLL_QUERY);
  const [deletePayrollMutation] = useMutation(REMOVE_PAYROLL_MUTATION, {
    onCompleted: () => handleRefetch({}),
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

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "account.name",
        header: "Account",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "salaryMonth",
        accessorFn: (row: Payroll) =>
          `${row?.salaryMonth} - ${dayjs(row?.salaryDate).format("YYYY")}`,
        header: "Month",
      },
      {
        accessorFn: (row: Payroll) =>
          dayjs(row?.salaryDate).format("MMMM D, YYYY h:mm A"),
        accessorKey: "salaryDate",
        header: "Date",
      },
    ],
    []
  );

  return (
    <div>
      <DataTable
        columns={columns}
        data={payRolls?.accounting__payrolls.nodes ?? []}
        refetch={handleRefetch}
        totalCount={payRolls?.accounting__payrolls.meta?.totalCount ?? 100}
        filters={[
          {
            key: "employee",
            operator: MatchOperator.Eq,
            value: employeeDetails?._id,
          },
        ]}
        RowActionMenu={(row: Payroll) => (
          <>
            <Menu.Item
              onClick={() => {
                handleDeletePayroll(row._id);
              }}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
          </>
        )}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={drawerHandler.open}
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        loading={fetchingPayrolls || state.refetching}
      />
      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title="Create increment"
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
