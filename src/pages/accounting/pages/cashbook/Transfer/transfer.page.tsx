import DataTable from "@/_app/common/data-table/DataTable";
import {
  Transfer,
  TransfersWithPagination,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import TransferForm from "./components/TransferForm";
import { ACCOUNT_TRANSFER_QUERY_LIST } from "./ulits/query";

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
    acounting__transfers: TransfersWithPagination;
  }>(ACCOUNT_TRANSFER_QUERY_LIST, {
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
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorFn(row) {
          return row.fromAccount.name;
        },
        accessorKey: "fromAccountId",
        header: "From Account",
      },

      {
        accessorFn(row) {
          return row.toAccount.name;
        },
        accessorKey: "toAccountId",
        header: "To Account",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorFn: (row: any) =>
          dayjs(row.createdAt).format("MMMM D, YYYY h:mm A"),
        accessorKey: "createdAt",
        header: "CreatedAt",
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
        <TransferForm
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
        data={data?.acounting__transfers?.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.acounting__transfers?.meta?.totalCount ?? 10}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() => setState({ modalOpened: true })}
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        RowIconMenu={(row: Transfer) => (
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
        loading={loading || state.refetching}
      />
    </>
  );
};

export default TransferPage;
