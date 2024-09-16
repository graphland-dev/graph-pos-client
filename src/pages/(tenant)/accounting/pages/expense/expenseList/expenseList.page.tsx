import PageTitle from "@/commons/components/PageTitle";
import { ACCOUNTS_LIST_DROPDOWN } from "@/commons/components/common-gql";
import { confirmModal } from "@/commons/components/confirm.tsx";
import DataTable from "@/commons/components/DataTable.tsx";
import {
  AccountsWithPagination,
  Expense,
  ExpensesWithPagination,
  MatchOperator,
} from "@/commons/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Menu, Title } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
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

const ExpenseListPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
    viewDetailsOpened: false,
  });

  const [expenseViewDetails, setExpenseViewDetails] = useState<Expense | null>(
    null
  );

  const { data, loading, refetch } = useQuery<{
    accounting__expenses: ExpensesWithPagination;
  }>(ACCOUNTING_EXPENSE_QUERY_LIST);

  const { data: accountData, refetch: refetchAccounts } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTS_LIST_DROPDOWN, {
    variables: {
      where: { limit: -1 },
    },
  });

  const [deleteExpenseMutation] = useMutation(
    ACCOUNTING_EXPENSE_DELETE_MUTATION,
    { onCompleted: () => handleRefetch({}) }
  );

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetchAccounts();
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "purpose",
        header: "Purpose",
      },

      {
        accessorKey: "note",
        header: "Note",
      },

      {
        accessorFn: (row: Expense) =>
          dayjs(row?.date)?.format("MMMM D, YYYY h:mm A"),
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorFn: (row: Expense) =>
          `${row?.account?.name}${
            row?.account?.referenceNumber
              ? ` [${row?.account?.referenceNumber}]`
              : ""
          }`,
        accessorKey: "account",
        header: "Account",
      },
      {
        accessorFn: (row: Expense) => row?.amount,
        accessorKey: "amount",
        header: "Amount",
      },
    ],
    []
  );

  const handleDeleteAccount = (_id: string) => {
    confirmModal({
      title: "Sure to delete account?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteExpenseMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
        });
      },
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
      <DataTable
        columns={columns}
        data={data?.accounting__expenses?.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.accounting__expenses?.meta?.totalCount ?? 10}
        RowActionMenu={(row: Expense) => (
          <>
            {/* <Menu.Item
              onClick={() =>
                setState({
                  modalOpened: true,
                  operationType: "update",
                  operationId: row._id,
                  operationPayload: row,
                })
              }
              icon={<IconPencil size={18} />}
            >
              Edit
            </Menu.Item> */}
            <Menu.Item
              onClick={() => {
                setState({ viewDetailsOpened: true });
                setExpenseViewDetails(row);
              }}
              icon={<IconEye size={18} />}
            >
              Details
            </Menu.Item>
            <Menu.Item
              onClick={() => handleDeleteAccount(row._id)}
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
              onClick={() =>
                setState({ modalOpened: true, operationType: "create" })
              }
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        loading={loading || state.refetching}
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
