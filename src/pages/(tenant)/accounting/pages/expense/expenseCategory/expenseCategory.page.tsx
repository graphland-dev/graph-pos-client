import AppDatatable, { ColumnDef } from "@/commons/components/AppDatatable/AppDatatable";
import { CommonPaginationDto, ExpenseCategory, ExpenseCategorysWithPagination, MatchOperator, SortType } from "@/commons/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { ACCOUNTING_EXPENSE_CATEGORY_DELETE_MUTATION, ACCOUNTING_EXPENSE_CATEGORY_QUERY_LIST } from "./utils/query";
import ExpenseCategoryForm from "./components/ExpenseCategoryForm";
import { confirmModal } from "@/commons/components/confirm.tsx";
import PageTitle from "@/commons/components/PageTitle";

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

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [sorting, setSorting] = useState<{
    column: string;
    direction: "asc" | "desc" | null;
  }>({ column: "createdAt", direction: "desc" });

  const buildWhereClause = (): CommonPaginationDto => {
    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? SortType.Asc : SortType.Desc,
    };
  };

  const { data, loading, refetch } = useQuery<{
    accounting__expenseCategorys: ExpenseCategorysWithPagination;
  }>(ACCOUNTING_EXPENSE_CATEGORY_QUERY_LIST, {
    variables: {
      where: buildWhereClause(),
    },
  });

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

  const columns = useMemo<ColumnDef<ExpenseCategory>[]>(
    () => [
      {
        accessor: "name",
        title: "Name",
        sortable: true,
      },
    ],
    []
  );

  const [deleteExpenseCategoryMutation] = useMutation(
    ACCOUNTING_EXPENSE_CATEGORY_DELETE_MUTATION,
    { onCompleted: () => handleRefetch() }
  );

  const handleDeleteAccount = (_id: string) => {
    confirmModal({
      title: "Sure to delete expense category?",
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

  const ActionColumn = (row: ExpenseCategory) => (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setState({
            modalOpened: true,
            operationType: "update",
            operationId: row._id,
            operationPayload: row,
          });
        }}
        className="flex items-center gap-1 px-2 py-1 text-sm text-orange-600 transition-colors hover:text-orange-700"
        title="Edit"
      >
        <IconPencil size={16} />
        Edit
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteAccount(row._id);
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
    <>
      <PageTitle title="expense-category" />

      <div className="mb-4 flex justify-end">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() =>
            setState({ modalOpened: true, operationPayload: {}, operationType: "create" })
          }
          size="sm"
        >
          Add new
        </Button>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.accounting__expenseCategorys?.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.accounting__expenseCategorys?.meta?.totalCount || 0,
          currentPage: pagination.page,
        }}
        ActionColumn={ActionColumn}
        onSortChange={handleSortChange}
        onPaginationChange={handlePaginationChange}
        loading={loading || state.refetching}
        emptyMessage="No expense categories found."
      />

      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
        title={state.operationType === "create" ? "Create Expense Category" : "Update Expense Category"}
        withCloseButton={true}
      >
        <ExpenseCategoryForm
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

export default ExpenseCategoryPage;
