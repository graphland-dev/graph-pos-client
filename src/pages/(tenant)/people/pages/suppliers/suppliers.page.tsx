import { confirmModal } from "@/commons/components/confirm.tsx";
import DataTable from "@/commons/components/DataTable.tsx";
import {
  MatchOperator,
  Supplier,
  SuppliersWithPagination,
} from "@/commons/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import ViewSupplierDetails from "./components/supplier_details/ViewSupplierDetails";
import {
  PEOPLE_REMOVE_SUPPLIERS,
  PEOPLE_SUPPLIERS_QUERY,
} from "./utils/suppliers.query";
import SuppliersCreateFrom from "./components/SuppliersCreateFrom";
import PageTitle from "@/commons/components/PageTitle";
import { useSearchParams } from "react-router-dom";

interface IState {
  refetching: boolean;
  action: "CREATE" | "EDIT";
  selectedSuppliers: Supplier | null;
  viewModal: boolean;
}

const SuppliersPage = () => {
  const [openedDrawer, drawerHandler] = useDisclosure();
  const [searchParams] = useSearchParams();

  const supplierId = searchParams.get("supplierId");

  const [state, setState] = useSetState<IState>({
    refetching: false,
    action: "CREATE",
    selectedSuppliers: null,
    viewModal: false,
  });

  const [supplierViewDetails, setSupplierViewDetails] =
    useState<Supplier | null>(null);

  const {
    data,
    refetch,
    loading: fetchingClient,
  } = useQuery<{
    people__suppliers: SuppliersWithPagination;
  }>(PEOPLE_SUPPLIERS_QUERY);

  const [deleteClientMutation] = useMutation(PEOPLE_REMOVE_SUPPLIERS, {
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
      title: "Sure to delete supplier?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteClientMutation({
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
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "companyName",
        header: "Company Name",
      },
      {
        accessorKey: "contactNumber",
        header: "Contact number",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "address",
        header: "Address",
      },
    ],
    []
  );

  useEffect(() => {
    if (supplierId) {
      const row = data?.people__suppliers?.nodes?.find(
        (item) => item._id == supplierId
      );

      if (row) {
        setState({ viewModal: true });
        setSupplierViewDetails(row);
      }
    }
  }, [supplierId, fetchingClient]);

  return (
    <div>
      <PageTitle title="suppliers" />
      <DataTable
        columns={columns}
        data={data?.people__suppliers?.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.people__suppliers?.meta?.totalCount ?? 100}
        RowActionMenu={(row: Supplier) => (
          <>
            <Menu.Item
              onClick={() => {
                drawerHandler.open();
                setState({
                  selectedSuppliers: row,
                  action: "EDIT",
                });
              }}
              icon={<IconPencil size={18} />}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={() => handleDeleteIncrement(row._id)}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setState({ viewModal: true });
                setSupplierViewDetails(row);
              }}
              icon={<IconEye size={18} />}
            >
              View
            </Menu.Item>
          </>
        )}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() => {
                drawerHandler.open();
                setState({
                  action: "CREATE",
                });
              }}
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        loading={fetchingClient || state.refetching}
      />

      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title="Create Supplier"
        withCloseButton={true}
      >
        <SuppliersCreateFrom
          action={state.action}
          formData={state.selectedSuppliers!}
          onFormSubmitted={() => {
            refetch();
            drawerHandler.close();
          }}
        />
      </Drawer>
      <Drawer
        padding={0}
        m={0}
        opened={state.viewModal}
        onClose={() => setState({ viewModal: false })}
        position="right"
        size={"95%"}
      >
        <ViewSupplierDetails
          supplierDetails={supplierViewDetails}
          refetch={() => {
            refetch();
          }}
        />
      </Drawer>
    </div>
  );
};

export default SuppliersPage;
