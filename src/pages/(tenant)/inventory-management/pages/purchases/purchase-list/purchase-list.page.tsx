import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import { confirmModal } from "@/commons/components/confirm.tsx";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { formatTableColumnDate } from "@/commons/utils/dateFormat";
import {
  CommonFindDocumentDto,
  CommonPaginationDto,
  MatchOperator,
  ProductPurchase,
  ProductPurchasesWithPagination,
  SuppliersWithPagination,
} from "@/commons/graphql-models/graphql";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Badge, Button, Drawer, Input, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useSetState } from "@mantine/hooks";
import { IconFileInfo, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import PurchaseDetails from "./components/PurchaseDetails";
import {
  Inventory__Remove_Product_Purchase,
  Inventory__product_Purchases_Query,
} from "./utils/query";

interface IState {
  refetching: boolean;
  openDrawer: boolean;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const PurchaseListPage = () => {
  const [purchaseDetails, setPurchaseDetails] = useState<ProductPurchase>();
  const [state, setState] = useSetState<IState>({
    refetching: false,
    openDrawer: false,
  });

  const params = useParams<{ tenant: string }>();

  // Pagination and sorting states
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: "",
    direction: null,
  });
  const [datatableFilters, setDatatableFilters] = useState<
    Record<string, string>
  >({});

  // Build filter variables
  const buildFilterVariables = (): CommonPaginationDto => {
    const graphqlFilters: CommonFindDocumentDto[] = [];

    // Add search filters
    if (datatableFilters.purchaseUID) {
      graphqlFilters.push({
        key: "purchaseUID",
        operator: MatchOperator.Contains,
        value: datatableFilters.purchaseUID,
      });
    }

    if (datatableFilters.supplier) {
      graphqlFilters.push({
        key: "supplier",
        operator: MatchOperator.Eq,
        value: datatableFilters.supplier,
      });
    }

    // Add date range filters for purchase date
    if (datatableFilters.purchaseDateStart) {
      graphqlFilters.push({
        key: "purchaseDate",
        operator: MatchOperator.Gte,
        value: datatableFilters.purchaseDateStart,
      });
    }

    if (datatableFilters.purchaseDateEnd) {
      graphqlFilters.push({
        key: "purchaseDate",
        operator: MatchOperator.Lte,
        value: datatableFilters.purchaseDateEnd,
      });
    }

    // Add date range filters for purchase order date
    if (datatableFilters.orderDateStart) {
      graphqlFilters.push({
        key: "purchaseOrderDate",
        operator: MatchOperator.Gte,
        value: datatableFilters.orderDateStart,
      });
    }

    if (datatableFilters.orderDateEnd) {
      graphqlFilters.push({
        key: "purchaseOrderDate",
        operator: MatchOperator.Lte,
        value: datatableFilters.orderDateEnd,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? "ASC" : "DESC",
      filters: graphqlFilters,
    } as CommonPaginationDto;
  };

  const { data, loading, refetch } = useQuery<{
    inventory__productPurchases: ProductPurchasesWithPagination;
  }>(Inventory__product_Purchases_Query, {
    variables: {
      where: buildFilterVariables(),
    },
    fetchPolicy: "cache-and-network",
  });

  // Fetch suppliers for filter dropdown
  const { data: suppliersData, loading: suppliersLoading } = useQuery<{
    people__suppliers: SuppliersWithPagination;
  }>(PURCHASE_LIST_SUPPLIERS_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 1000, // Get all suppliers for dropdown
      },
    },
  });

  const [deleteProductMutation] = useMutation(
    Inventory__Remove_Product_Purchase,
    {
      onCompleted: () => handleRefetch(),
    }
  );

  const [searchParams] = useSearchParams();
  const purchaseId = searchParams.get("purchaseId");
  // console.log(purchasesUId);

  const [productPurchase] = useLazyQuery<{
    inventory__productPurchases: ProductPurchasesWithPagination;
  }>(Inventory__product_Purchases_Query, {
    fetchPolicy: "network-only",
  });

  const handleRefetch = () => {
    setState({ refetching: true });
    refetch({ where: buildFilterVariables() }).finally(() => {
      setState({ refetching: false });
    });
  };

  // Process supplier options for Select component
  const supplierOptions = useMemo(() => {
    if (!suppliersData?.people__suppliers?.nodes) return [];
    return suppliersData.people__suppliers.nodes.map((supplier) => ({
      value: supplier._id,
      label: supplier.name,
    }));
  }, [suppliersData]);

  const handleDeleteAccount = (_id: string) => {
    confirmModal({
      title: "Sure to delete product?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteProductMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
        });
      },
    });
  };

  const columns = useMemo<ColumnDef<ProductPurchase>[]>(
    () => [
      {
        accessor: "purchaseUID",
        title: "Purchase UID",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search by UID..."
            onChange={(e) => setValue("purchaseUID", e.target.value)}
          />
        ),
      },
      {
        accessor: "supplier.name",
        title: "Supplier Name",
        sortable: false,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by supplier"
            value={datatableFilters.supplier}
            data={supplierOptions}
            disabled={suppliersLoading}
            onChange={(value) => {
              setValue("supplier", value);
            }}
            clearable
            searchable
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row) => formatTableColumnDate(row?.purchaseDate),
        title: "Purchase Date",
        sortKey: "purchaseDate",
        sortable: true,
        Filter: (setValue) => (
          <div className="flex flex-col gap-2" style={{ minWidth: 200 }}>
            <DatePickerInput
              label="Start date"
              value={
                datatableFilters.purchaseDateStart
                  ? new Date(datatableFilters.purchaseDateStart)
                  : null
              }
              onChange={(value) =>
                setValue(
                  "purchaseDateStart",
                  (value && typeof value !== 'string'
                    ? (value as Date).toISOString()
                    : (value as string)) || ""
                )
              }
              size="sm"
              clearable
            />
            <DatePickerInput
              label="End date"
              value={
                datatableFilters.purchaseDateEnd
                  ? new Date(datatableFilters.purchaseDateEnd)
                  : null
              }
              onChange={(value) =>
                setValue(
                  "purchaseDateEnd",
                  (value && typeof value !== 'string'
                    ? (value as Date).toISOString()
                    : (value as string)) || ""
                )
              }
              size="sm"
              clearable
            />
          </div>
        ),
      },
      {
        accessor: (row) => formatTableColumnDate(row?.purchaseOrderDate),
        title: "Order Date",
        sortKey: "purchaseOrderDate",
        sortable: true,
        Filter: (setValue) => (
          <div className="flex flex-col gap-2" style={{ minWidth: 200 }}>
            <DatePickerInput
              label="Start date"
              value={
                datatableFilters.orderDateStart
                  ? new Date(datatableFilters.orderDateStart)
                  : null
              }
              onChange={(value) =>
                setValue(
                  "orderDateStart",
                  (value && typeof value !== 'string'
                    ? (value as Date).toISOString()
                    : (value as string)) || ""
                )
              }
              size="sm"
              clearable
            />
            <DatePickerInput
              label="End date"
              value={
                datatableFilters.orderDateEnd
                  ? new Date(datatableFilters.orderDateEnd)
                  : null
              }
              onChange={(value) =>
                setValue(
                  "orderDateEnd",
                  (value && typeof value !== 'string'
                    ? (value as Date).toISOString()
                    : (value as string)) || ""
                )
              }
              size="sm"
              clearable
            />
          </div>
        ),
      },
      {
        accessor: (row) => {
          const totalDue = row?.netTotal - (row?.paidAmount || 0);
          let color = "red";
          if (totalDue === 0) {
            color = "green";
          }
          if (totalDue > 0) {
            color = "yellow";
          }
          return (
            <Badge color={color}>{currencyNumberWithSymbolFormat(
              totalDue
            )}</Badge>
          );
        },
        title: "Due Amount",
        sortable: false,
      },
      {
        accessor: (row) =>
          currencyNumberWithSymbolFormat(row?.paidAmount || 0),
        title: "Paid Amount",
        sortKey: "paidAmount",
        sortable: true,
      },
      {
        accessor: (row) =>
          currencyNumberWithSymbolFormat(row?.netTotal || 0),
        title: "Net Total",
        sortKey: "netTotal",
        sortable: true,
      },
    ],
    [
      datatableFilters.supplier,
      datatableFilters.purchaseDateStart,
      datatableFilters.purchaseDateEnd,
      datatableFilters.orderDateStart,
      datatableFilters.orderDateEnd,
      supplierOptions,
      suppliersLoading,
    ]
  );

  useEffect(() => {
    if (purchaseId) {
      productPurchase({
        variables: {
          where: {
            filters: [
              {
                key: "_id",
                operator: MatchOperator.Eq,
                value: purchaseId,
              },
            ],
          },
        },
      }).then((res) => {
        console.log(res);
        setPurchaseDetails(res.data?.inventory__productPurchases.nodes?.[0]);
        setState({
          openDrawer: true,
        });
      });
    }
  }, [purchaseId, productPurchase, setState]);

  return (
    <>
      <PageTitle title="purchase-list" />
      <Drawer
        onClose={() =>
          setState({
            openDrawer: false,
          })
        }
        title="Product items in purchase"
        opened={state.openDrawer}
        size={"90%"}
      >
        <PurchaseDetails details={purchaseDetails!} />
      </Drawer>
      <div className="flex items-center justify-between mb-4">
        <div></div>
        <Button
          leftSection={<IconPlus size={16} />}
          component={Link}
          to={`/${params.tenant}/inventory-management/purchases/create`}
          size="sm"
        >
          Add new
        </Button>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.inventory__productPurchases.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.inventory__productPurchases.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: ProductPurchase) => (
          <div className="flex items-center gap-2">
            {(row?.paidAmount || 0) < (row?.netTotal || 0) && (
              <Link
                to={`/${params.tenant}/inventory-management/payments/create-purchase-payment?supplierId=${row.supplier?._id}&purchaseId=${row._id}`}
                className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 rounded-md bg-green-50 hover:bg-green-100"
              >
                <IconFileInfo size={14} />
                Make Payment
              </Link>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPurchaseDetails(row);
                setState({
                  openDrawer: true,
                });
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <IconFileInfo size={14} />
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAccount(row._id);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 rounded-md bg-red-50 hover:bg-red-100"
            >
              <IconTrash size={14} />
              Delete
            </button>
          </div>
        )}
        onRowClick={(row: ProductPurchase) => {
          setPurchaseDetails(row);
          setState({
            openDrawer: true,
          });
        }}
        onSortChange={(column, direction) => {
          setSorting({ column, direction });
        }}
        onFilterChange={(column, value) => {
          setDatatableFilters((prev) => ({ ...prev, [column]: value }));
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onPaginationChange={(page, pageSize) => {
          setPagination({ page, pageSize });
        }}
        loading={loading || state.refetching}
        emptyMessage="No purchases found. Try adjusting your filters."
      />
    </>
  );
};

// Local query for suppliers dropdown - isolated from other usages
const PURCHASE_LIST_SUPPLIERS_QUERY = gql`
  query PurchaseList__suppliers($where: CommonPaginationDto) {
    people__suppliers(where: $where) {
      nodes {
        _id
        name
      }
    }
  }
`;

export default PurchaseListPage;
