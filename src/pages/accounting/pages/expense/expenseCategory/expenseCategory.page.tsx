import DataTable from "@/_app/common/data-table/DataTable";
import { ExpenseCategory, ExpenseCategorysWithPagination, MatchOperator } from "@/_app/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { useMemo } from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { ACCOUNTING_EXPENSE_CATEGORY_DELETE_MUTATION, ACCOUNTING_EXPENSE_CATEGORY_QUERY_LIST } from "./utils/query";
import ExpenseCategoryForm from "./components/ExpenseCategoryForm";
import { MRT_ColumnDef } from "mantine-react-table";
import { confirmModal } from "@/_app/common/confirm/confirm";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const ExpenseCategoryPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const { data, loading, refetch } = useQuery<{
    accounting__expenseCategorys: ExpenseCategorysWithPagination;
  }>(ACCOUNTING_EXPENSE_CATEGORY_QUERY_LIST, {
    variables: {
      where: {
        limit: 10,
        page: 1,
      },
    },
  });


  console.log(data);

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch();
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
    ],
    []
  );

   const [deleteExpenseCategoryMutation] = useMutation(
     ACCOUNTING_EXPENSE_CATEGORY_DELETE_MUTATION,
     { onCompleted: () => handleRefetch({}) }
  );
  
   const handleDeleteAccount = (_id: string) => {
     confirmModal({
       title: "Sure to delete account?",
       description: "Be careful!! Once you deleted, it can not be undone",
       isDangerous: true,
       onConfirm() {
         deleteExpenseCategoryMutation({
           variables: {
             where: { key: "_id", operator: MatchOperator.Eq, value: _id },
           },
         });
       },
     });
   };

  return (
    <>
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <ExpenseCategoryForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.accounting__expenseCategorys?.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.accounting__expenseCategorys?.meta?.totalCount ?? 10}
        RowActionMenu={(row: ExpenseCategory) => (
          <>
            <Menu.Item
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
    </>
  );
};

export default ExpenseCategoryPage;
