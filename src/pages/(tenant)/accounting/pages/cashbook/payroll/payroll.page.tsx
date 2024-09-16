import { confirmModal } from "@/commons/components/confirm.tsx";
import {
  Account,
  AccountsWithPagination,
  Employee,
  EmployeesWithPagination,
  MatchOperator,
  Payroll,
  PayrollsWithPagination,
} from "@/commons/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";

import DataTable from "@/commons/components/DataTable.tsx";
import { INCREMENT_EMPLOYEE_QUERY } from "@/pages/(tenant)/people/pages/employees/increments/utils/increment.query";
import { Button, Drawer, Menu } from "@mantine/core";
import { IconListDetails, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import PayrollDetails from "./components/PayrollDetails";
import PayrollForm from "./components/PayrollForm";
import {
  PAYROLL_ACCOUNTS_QUERY,
  PAYROLL_QUERY,
  REMOVE_PAYROLL_MUTATION,
} from "./utils/payroll.query";
import PageTitle from "@/commons/components/PageTitle";

interface IState {
  refetching: boolean;
  payRollRow: null | Payroll;
}

const PayrollPage = () => {
  const [openedDrawer, drawerHandler] = useDisclosure();
  const [openedDetailsDrawer, detailsDrawerHandler] = useDisclosure();

  const [state, setState] = useSetState<IState>({
    refetching: false,
    payRollRow: null,
  });

  const { data } = useQuery<{
    people__employees: EmployeesWithPagination;
  }>(INCREMENT_EMPLOYEE_QUERY);

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

  const [deleteIncrementMutation] = useMutation(REMOVE_PAYROLL_MUTATION, {
    onCompleted: () => handleRefetch({}),
  });

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteIncrement = (_id: string) => {
    confirmModal({
      title: "Sure to delete payroll?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteIncrementMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
        });
      },
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "employee.name",
        header: "Employee",
      },
      {
        accessorKey: "account.name",
        header: "Account",
      },
      {
        accessorKey: "amount",
        header: "Amount",
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
      <PageTitle title="payroll" />
      <DataTable
        columns={columns}
        data={payRolls?.accounting__payrolls.nodes ?? []}
        refetch={handleRefetch}
        totalCount={payRolls?.accounting__payrolls.meta?.totalCount ?? 100}
        RowActionMenu={(row: Payroll) => (
          <>
            <Menu.Item
              onClick={() => {
                handleDeleteIncrement(row._id);
              }}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
            <Menu.Item
              icon={<IconListDetails size={18} />}
              onClick={() => {
                setState({
                  payRollRow: row,
                });
                detailsDrawerHandler.open();
              }}
            >
              Details
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
    </div>
  );
};

export default PayrollPage;
