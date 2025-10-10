import AppDatatable, { ColumnDef } from "@/commons/components/AppDatatable/AppDatatable";
import { CommonPaginationDto, MatchOperator, ProductPurchase, ProductPurchasesWithPagination, SortType, Supplier } from "@/commons/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Button, Drawer } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { SUPPLIER_DETAILS_PURCHASE_QUERY } from "../../utils/suppliers.query";

interface ISupplierDetailsProps {
  supplierDetails: Supplier | null;
}

interface IState {
  refetching: boolean;
}

const SupplierDetailsPurchase: React.FC<ISupplierDetailsProps> = ({
  supplierDetails,
}) => {
  const [openedDrawer, drawerHandler] = useDisclosure();
  const [state, _setState] = useSetState<IState>({ refetching: false });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [sorting, setSorting] = useState<{
    column: string;
    direction: "asc" | "desc" | null;
  }>({ column: "purchaseDate", direction: "desc" });

  const buildWhereClause = (): CommonPaginationDto => {
    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "purchaseDate",
      sort: sorting.direction === "asc" ? SortType.Asc : SortType.Desc,
      filters: [
        {
          key: "supplier",
          operator: MatchOperator.Eq,
          value: supplierDetails?._id,
        },
      ],
    };
  };

  const { data: purchaseData, loading: fetchingPurchaseData, refetch: _refetch } = useQuery<{
    inventory__productPurchases: ProductPurchasesWithPagination;
  }>(SUPPLIER_DETAILS_PURCHASE_QUERY, {
    variables: { where: buildWhereClause() },
    skip: !supplierDetails?._id,
  });

  // refetch helper removed as unused

  const handleSortChange = (
    column: string,
    direction: "asc" | "desc" | null
  ) => {
    setSorting({ column, direction });
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, pageSize });
  };

  const columns = useMemo<ColumnDef<ProductPurchase>[]>(
    () => [
      {
        accessor: (row) =>
          dayjs(row?.purchaseDate).format("MMMM D, YYYY h:mm A"),
        title: "Purchase Date",
        sortKey: "purchaseDate",
        sortable: true,
      },
      {
        accessor: "taxAmount",
        title: "Tax Amount",
        sortable: true,
      },
      {
        accessor: "subTotal",
        title: "Sub Total",
        sortable: true,
      },
      {
        accessor: "costAmount",
        title: "Cost Amount",
        sortable: true,
      },
      {
        accessor: "netTotal",
        title: "Net Total",
        sortable: true,
      },
    ],
    []
  );

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={drawerHandler.open}
          size="sm"
        >
          Add new
        </Button>
      </div>

      <AppDatatable
        columns={columns}
        data={purchaseData?.inventory__productPurchases.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: purchaseData?.inventory__productPurchases.meta?.totalCount || 0,
          currentPage: pagination.page,
        }}
        onSortChange={handleSortChange}
        onPaginationChange={handlePaginationChange}
        loading={fetchingPurchaseData || state.refetching}
        emptyMessage="No purchases found for this supplier."
      />

      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title="Create Purchase"
        withCloseButton={true}
      >
        {/* Form component can be added here */}
      </Drawer>
    </div>
  );
};

export default SupplierDetailsPurchase;
