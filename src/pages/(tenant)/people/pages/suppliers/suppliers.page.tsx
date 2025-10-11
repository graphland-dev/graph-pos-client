import { confirmModal } from "@/commons/components/confirm.tsx";
import AppDatatable, { ColumnDef } from "@/commons/components/AppDatatable/AppDatatable";
import {
  CommonPaginationDto,
  MatchOperator,
  SortType,
  Supplier,
  SuppliersWithPagination,
} from "@/commons/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
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

  const {
    data,
    refetch,
    loading: fetchingClient,
  } = useQuery<{
    people__suppliers: SuppliersWithPagination;
  }>(PEOPLE_SUPPLIERS_QUERY, {
    variables: { where: buildWhereClause() },
  });

  const [deleteClientMutation] = useMutation(PEOPLE_REMOVE_SUPPLIERS, {
    onCompleted: () => handleRefetch(),
  });

  const handleRefetch = () => {
    setState({ refetching: true });
    refetch().finally(() => {
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

  const handleSortChange = (
    column: string,
    direction: "asc" | "desc" | null
  ) => {
    setSorting({ column, direction });
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, pageSize });
  };

  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        accessor: "name",
        title: "Name",
        sortable: true,
      },
      {
        accessor: "companyName",
        title: "Company Name",
        sortable: true,
      },
      {
        accessor: "contactNumber",
        title: "Contact number",
        sortable: true,
      },
      {
        accessor: "email",
        title: "Email",
        sortable: true,
      },
      {
        accessor: "address",
        title: "Address",
        sortable: true,
      },
    ],
    []
  );

  const ActionColumn = (row: Supplier) => (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          drawerHandler.open();
          setState({
            selectedSuppliers: row,
            action: "EDIT",
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
          handleDeleteIncrement(row._id);
        }}
        className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 transition-colors hover:text-red-700"
        title="Delete"
      >
        <IconTrash size={16} />
        Delete
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setState({ viewModal: true });
          setSupplierViewDetails(row);
        }}
        className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 transition-colors hover:text-blue-700"
        title="View"
      >
        <IconEye size={16} />
        View
      </button>
    </div>
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

      <div className="mb-4 flex justify-end">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            drawerHandler.open();
            setState({
              action: "CREATE",
              selectedSuppliers: null,
            });
          }}
          size="sm"
        >
          Add new
        </Button>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.people__suppliers?.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.people__suppliers?.meta?.totalCount || 0,
          currentPage: pagination.page,
        }}
        ActionColumn={ActionColumn}
        onSortChange={handleSortChange}
        onPaginationChange={handlePaginationChange}
        loading={fetchingClient || state.refetching}
        emptyMessage="No suppliers found."
      />

      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title={state.action === "CREATE" ? "Create Supplier" : "Edit Supplier"}
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
