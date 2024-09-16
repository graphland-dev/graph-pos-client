import { ACCOUNTS_LIST_DROPDOWN } from "@/commons/components/common-gql";
import { confirmModal } from "@/commons/components/confirm.tsx";
import DataTable from "@/commons/components/DataTable.tsx";
import {
  Account,
  Accounting_Transaction_Source,
  AccountsWithPagination,
  MatchOperator,
  Transaction,
  TransactionsWithPagination,
} from "@/commons/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Badge, Button, Drawer, Menu } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import BalanceAdjustmentForm from "./components/BalanceAdjustmentForm";
import {
  ACCOUNTING_TRANSACTION_QUERY,
  ACCOUNT_REMOVE_TRANSACTION,
} from "./utils/query";
import dayjs from "dayjs";
import PageTitle from "@/commons/components/PageTitle";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const AdjustmentPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const { data, loading, refetch } = useQuery<{
    accounting__transactions: TransactionsWithPagination;
  }>(ACCOUNTING_TRANSACTION_QUERY);

  const { data: accountData, refetch: refetchAccounts } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTS_LIST_DROPDOWN, {
    variables: {
      where: { limit: -1 },
    },
  });

  const [deleteAccountMutation] = useMutation(ACCOUNT_REMOVE_TRANSACTION, {
    onCompleted: () => handleRefetch({}),
  });

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetchAccounts();
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteAccount = (_id: string) => {
    confirmModal({
      title: "Sure to delete account?",
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

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorFn: (row: Transaction) =>
          `${row?.account?.name} [${row?.account?.referenceNumber}]`,
        header: "Account",
      },
      {
        accessorKey: "account.brunchName",
        header: "Brunch Name",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorFn: (row: Transaction) =>
          row?.type === "DEBIT" ? (
            <Badge color="red">Reduce Balance</Badge>
          ) : (
            <Badge color="green">Add Balance</Badge>
          ),
        header: "Type",
      },
      {
        accessorFn: (row: Transaction) =>
          dayjs(row?.createdAt).format("MMMM D, YYYY h:mm A"),
        // filterVariant: "date-range",
        accessorKey: "createdAt",
        header: "Date",
      },
    ],
    []
  );

  return (
    <>
      <PageTitle title="adjustment" />
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <BalanceAdjustmentForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          accounts={accountData?.accounting__accounts?.nodes || []}
        />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.accounting__transactions.nodes ?? []}
        filters={[
          {
            key: "source",
            operator: MatchOperator.Eq,
            value: Accounting_Transaction_Source.BalanceAdjustment,
          },
        ]}
        refetch={handleRefetch}
        totalCount={data?.accounting__transactions.meta?.totalCount ?? 100}
        RowActionMenu={(row: Account) => (
          <>
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

export default AdjustmentPage;
