import DataTable from "@/_app/common/data-table/DataTable";
import { Account, AccountsWithPagination } from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import AccountForm from "./components/AccountForm";
import { ACCOUNTING_ACCOUNTS_LIST } from "./utils/query";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const AccountsPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const { data, loading, refetch } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTING_ACCOUNTS_LIST, {
    variables: {
      where: {
        limit: 10,
        page: 1,
      },
    },
  });

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  // const handleDeleteAccount = (_id: string) => {
  //   // confirmModal({
  //   //   title: "Sure to delete account?",
  //   //   onConfirm() {
  //   //     // alert("Delete mutation" + _id);
  //   //   },
  //   // });
  //   // mutation
  // };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Account Name",
      },
      {
        accessorKey: "note",
        header: "Note",
      },
      {
        accessorFn: (row) => dayjs(row.createdAt).format("MMMM D, YYYY h:mm A"),
        accessorKey: "createdAt",
        header: "CreatedAt",
      },
      {
        accessorKey: "referenceNumber",
        header: "Reference Number",
      },
      {
        accessorKey: "brunchName",
        header: "Brunch Name",
      },
    ],
    []
  );

  return (
    <>
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <AccountForm
          onSubmissionDone={() => {
            refetch();
            setState({ modalOpened: false });
          }}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.accounting__accounts.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.accounting__accounts.meta?.totalCount ?? 10}
        RowIconMenu={(row: Account) => (
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
            <Menu.Item icon={<IconTrash size={18} />}>Delete</Menu.Item>
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

export default AccountsPage;
