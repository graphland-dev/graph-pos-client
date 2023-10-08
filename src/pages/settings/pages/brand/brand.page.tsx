import DataTable from "@/_app/common/data-table/DataTable";
import BrandsForm from "./components/BrandsForm";
import { Button, Drawer, Menu } from "@mantine/core";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useSetState } from "@mantine/hooks";
import { useMemo } from "react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMutation, useQuery } from "@apollo/client";
import { SETTING_BRAND_DELETE_MUTATION, SETTING_BRAND_QUERY } from "./utils/query";
import { Brand, BrandsWithPagination, MatchOperator } from "@/_app/graphql-models/graphql";
import { confirmModal } from "@/_app/common/confirm/confirm";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const BrandPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const { data, refetch, loading } = useQuery<{ setup__brands: BrandsWithPagination }>(SETTING_BRAND_QUERY, {
    variables: {
    where:{limit : -1},
    },
  })

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {

        accessorKey: "name",
        header: "Name",
      },
      {

        accessorKey: "code",
        header: "Code",
      },
      {

        accessorKey: "note",
        header: "Note",
      },

    ],
    []
  );

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch();
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const [deleteBrandMutation] = useMutation(
    SETTING_BRAND_DELETE_MUTATION
  );

  const handleDeleteEmployee = (_id: string) => {
    confirmModal({
      title: "Sure to delete?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteBrandMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
          onCompleted: () => handleRefetch({}),
          onError: (error) => console.log({ error }),
        });
      },
    });
  };


  return <>
    <Drawer
      opened={state.modalOpened}
      onClose={() => setState({ modalOpened: false })}
      position="right"
      size={"md"}
    >
      <BrandsForm
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
      data={data?.setup__brands?.nodes ?? []}
      refetch={handleRefetch}
      totalCount={data?.setup__brands?.meta?.totalCount ?? 10}
      RowActionMenu={(row: Brand) => (
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
            onClick={() => handleDeleteEmployee(row._id)}
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
              setState({ modalOpened: true, operationPayload: "create" })
            }
            size="sm"
          >
            Add new
          </Button>
        </>
      }
      loading={loading || state.refetching}
    />
  </>;
};

export default BrandPage;
