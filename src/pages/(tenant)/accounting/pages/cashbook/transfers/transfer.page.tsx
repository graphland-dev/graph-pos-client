import PageTitle from "@/_app/common/PageTitle";
import { ACCOUNTS_LIST_DROPDOWN } from "@/_app/common/common-gql";
import { confirmModal } from "@/_app/common/confirm/confirm";
import DataTable from "@/_app/common/data-table/DataTable";
import dateFormat from "@/_app/common/utils/dateFormat";
import {
  AccountsWithPagination,
  MatchOperator,
  Transfer,
  TransfersWithPagination,
} from "@/_app/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import TransferForm from "./components/TransferForm";
import {
  ACCOUNTING_DELETE_TRANSFER_MUTATION,
  ACCOUNTING_TRANSFER_QUERY_LIST,
} from "./ulits/query";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const TransferPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const { data, loading, refetch } = useQuery<{
    accounting__transfers: TransfersWithPagination;
  }>(ACCOUNTING_TRANSFER_QUERY_LIST, {
    variables: {
      where: {
        limit: 10,
        page: 1,
      },
    },
  });

  const { data: accountData, refetch: refetchAccounts } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTS_LIST_DROPDOWN, {
    variables: {
      where: { limit: -1 },
    },
  });

  const [deleteAccountMutation] = useMutation(
    ACCOUNTING_DELETE_TRANSFER_MUTATION,
    { onCompleted: () => handleRefetch({}) }
  );

  const handleDeleteAccount = (_id: string) => {
    confirmModal({
      title: "Sure to delete?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteAccountMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
        });
      },
    });
  };

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
        accessorFn(row) {
          return row?.fromAccount?.name;
        },
        header: "From Account",
      },
      {
        accessorFn(row: Transfer) {
          return row?.toAccount?.name;
        },
        header: "To Account",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorFn: (row: Transfer) => dateFormat(row?.date),
        accessorKey: "date",
        header: "Date",
      },
    ],
    []
  );
  return (
    <>
      <PageTitle title="transfer" />
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <TransferForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          accounts={accountData?.accounting__accounts?.nodes || []}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.accounting__transfers?.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.accounting__transfers?.meta?.totalCount ?? 10}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() =>
                setState({ modalOpened: true, operationPayload: {} })
              }
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        RowActionMenu={(row: Transfer) => (
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
              onClick={() => handleDeleteAccount(row?._id)}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
          </>
        )}
        loading={loading || state.refetching}
      />
    </>
  );
};

export default TransferPage;
