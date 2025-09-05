import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback.ts";
import { confirmModal } from "@/commons/components/confirm.tsx";
import {
  BrandsWithPagination,
  CommonFindDocumentDto,
  CommonPaginationDto,
  MatchOperator,
  Product,
  ProductsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { useMutation, useQuery } from "@apollo/client";
import { ActionIcon, Button, Input, NumberInput, Select, Title } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import {
  IconBrandProducthunt,
  IconFileInfo,
  IconPlus,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CategoryPicker } from "../../../shared/components";
import { CategoryTreeNode } from "../../../shared/types";
import {
  BRANDS_QUERY,
  GET_ROOT_CATEGORIES_WITH_CHILDREN_QUERY,
  INVENTORY_PRODUCTS_LIST_QUERY,
  INVENTORY_PRODUCT_CREATE,
  INVENTORY_PRODUCT_REMOVE,
} from "./utils/product.query";
import PageTitle from "@/commons/components/PageTitle";
import ImportExportCSV from "./ImportExportCSV";
import clsx from "clsx";

interface IState {
  refetching: boolean;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const ProductListPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string }>();

  const [state, setState] = useSetState<IState>({
    refetching: false,
  });

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

    if (datatableFilters.category) {
      graphqlFilters.push({
        key: "category",
        operator: MatchOperator.Eq,
        value: datatableFilters.category,
      });
    }

    if (datatableFilters.brand) {
      graphqlFilters.push({
        key: "brand",
        operator: MatchOperator.Eq,
        value: datatableFilters.brand,
      });
    }

    // Add search filters
    if (datatableFilters.name) {
      graphqlFilters.push({
        key: "name",
        operator: MatchOperator.Contains,
        value: datatableFilters.name,
      });
    }

    if (datatableFilters.code) {
      graphqlFilters.push({
        key: "code",
        operator: MatchOperator.Contains,
        value: datatableFilters.code,
      });
    }

    // Add price range filters
    if (datatableFilters.minPrice) {
      graphqlFilters.push({
        key: "price",
        operator: MatchOperator.Gte,
        value: datatableFilters.minPrice,
      });
    }

    if (datatableFilters.maxPrice) {
      graphqlFilters.push({
        key: "price",
        operator: MatchOperator.Lte,
        value: datatableFilters.maxPrice,
      });
    }

    // Add purchase price range filters
    if (datatableFilters.minPurchasePrice) {
      graphqlFilters.push({
        key: "purchasePrice",
        operator: MatchOperator.Gte,
        value: datatableFilters.minPurchasePrice,
      });
    }

    if (datatableFilters.maxPurchasePrice) {
      graphqlFilters.push({
        key: "purchasePrice",
        operator: MatchOperator.Lte,
        value: datatableFilters.maxPurchasePrice,
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
    inventory__products: ProductsWithPagination;
  }>(INVENTORY_PRODUCTS_LIST_QUERY, {
    variables: { where: buildFilterVariables() },
    fetchPolicy: "cache-and-network",
  });

  // Fetch categories for filter
  const { data: categoriesData, loading: categoriesLoading } = useQuery<{
    inventory__rootCategoriesWithChildren: CategoryTreeNode[];
  }>(GET_ROOT_CATEGORIES_WITH_CHILDREN_QUERY);

  // Fetch brands for filter
  const { data: brandsData, loading: brandsLoading } = useQuery<{
    setup__brands: BrandsWithPagination;
  }>(BRANDS_QUERY);

  const [createProduct, { loading: creatingProduct }] = useMutation(
    INVENTORY_PRODUCT_CREATE,
    commonNotifierCallback({
      successTitle: "Inventory product created successfully!",
      onSuccess(res) {
        navigate(
          `/${params.tenant}/inventory-management/products/${res?.inventory__createProduct?._id}`
        );
        refetch();
      },
    })
  );

  const [deleteProductMutation] = useMutation(INVENTORY_PRODUCT_REMOVE, {
    onCompleted: () => handleRefetch(),
  });

  const handleRefetch = () => {
    setState({ refetching: true });

    refetch({ where: buildFilterVariables() }).finally(() => {
      setState({ refetching: false });
    });
  };

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

  // Process brand options for Select component
  const brandOptions = useMemo(() => {
    if (!brandsData?.setup__brands?.nodes) return [];
    return brandsData.setup__brands.nodes.map((brand) => ({
      value: brand._id,
      label: brand.name,
    }));
  }, [brandsData]);

  // Get stock quantity helper
  const getStockQuantity = (product: Product) => {
    if (product.isSellableWithoutStock) {
      return "N/A";
    }
    return (product.currentStockQuantity || 0).toString();
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessor: "name",
        title: "Product Name",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search by name..."
            onChange={(e) => setValue("name", e.target.value)}
          />
        ),
      },
      {
        accessor: "code",
        title: "Product Code",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search by code..."
            onChange={(e) => setValue("code", e.target.value)}
          />
        ),
      },
      {
        accessor: (row) => getStockQuantity(row),
        title: "Stock Quantity",
        sortable: false,
      },
      {
        accessor: "category.name",
        title: "Category",
        sortable: false,
        Filter: (setValue) => (
          <CategoryPicker
            placeholder="Filter by category"
            value={datatableFilters.category}
            categories={
              categoriesData?.inventory__rootCategoriesWithChildren || []
            }
            disabled={categoriesLoading}
            onChange={(value) => {
              setValue("category", value);
            }}
            allowClear={true}
            showPath={false}
            showLevel={false}
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: "brand.name",
        title: "Brand",
        sortable: false,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by brand"
            value={datatableFilters.brand}
            data={brandOptions}
            disabled={brandsLoading}
            onChange={(value) => {
              setValue("brand", value);
            }}
            clearable
            searchable
            style={{ minWidth: 150 }}
          />
        ),
      },
      {
        accessor: (row) => currencyNumberWithSymbolFormat(row?.price || 0),
        title: "Price",
        sortKey: "price",
        sortable: true,
        Filter: (setValue) => (
          <div className="flex gap-2" style={{ minWidth: 200 }}>
            <NumberInput
              placeholder="Min"
              value={datatableFilters.minPrice ? Number(datatableFilters.minPrice) : undefined}
              onChange={(value) => setValue("minPrice", value?.toString() || "")}
              size="sm"
              min={0}
            />
            <NumberInput
              placeholder="Max"
              value={datatableFilters.maxPrice ? Number(datatableFilters.maxPrice) : undefined}
              onChange={(value) => setValue("maxPrice", value?.toString() || "")}
              size="sm"
              min={0}
            />
          </div>
        ),
      },
      {
        accessor: (row) =>
          currencyNumberWithSymbolFormat(row?.purchasePrice || 0),
        title: "Purchase Price",
        sortKey: "purchasePrice",
        sortable: true,
        Filter: (setValue) => (
          <div className="flex gap-2" style={{ minWidth: 200 }}>
            <NumberInput
              placeholder="Min"
              value={datatableFilters.minPurchasePrice ? Number(datatableFilters.minPurchasePrice) : undefined}
              onChange={(value) => setValue("minPurchasePrice", value?.toString() || "")}
              size="sm"
              min={0}
            />
            <NumberInput
              placeholder="Max"
              value={datatableFilters.maxPurchasePrice ? Number(datatableFilters.maxPurchasePrice) : undefined}
              onChange={(value) => setValue("maxPurchasePrice", value?.toString() || "")}
              size="sm"
              min={0}
            />
          </div>
        ),
      },
    ],
    [
      datatableFilters.category,
      datatableFilters.brand,
      datatableFilters.minPrice,
      datatableFilters.maxPrice,
      datatableFilters.minPurchasePrice,
      datatableFilters.maxPurchasePrice,
      categoriesData?.inventory__rootCategoriesWithChildren,
      categoriesLoading,
      brandOptions,
      brandsLoading,
    ]
  );

  return (
    <>
      {/* Header with Title and Filters */}
      <div>
        <PageTitle title="Inventory Products" />

        <div className="flex items-center justify-between">
          <Title order={2}>Product List</Title>

          {/* Action Area */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() =>
                createProduct({
                  variables: {
                    body: {
                      name: `Product ${
                        (data?.inventory__products?.meta
                          ?.totalCount as number) + 1
                      }`,
                      code: `P ${
                        (data?.inventory__products?.meta
                          ?.totalCount as number) + 1
                      }`,
                    },
                  },
                })
              }
              disabled={creatingProduct}
            >
              <IconPlus size={16} />
              {creatingProduct ? "Creating..." : "Add new"}
            </Button>
            <ImportExportCSV onImportComplete={handleRefetch} />
            <ActionIcon
              onClick={handleRefetch}
              variant="outline"
              radius={100}
              size={"lg"}
            >
              <IconRefresh
                className={clsx({ "animate-reverse-spin": loading })}
              />
            </ActionIcon>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <AppDatatable
        columns={columns}
        data={data?.inventory__products.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.inventory__products.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: Product) => (
          <div className="flex items-center gap-2">
            <Link
              to={`/${params.tenant}/inventory-management/products/${row._id}`}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <IconFileInfo size={14} />
              View
            </Link>
            <Link
              to={`/${params.tenant}/inventory-management/purchases/create?productId=${row._id}`}
              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 rounded-md bg-green-50 hover:bg-green-100"
            >
              <IconBrandProducthunt size={14} />
              Purchase
            </Link>
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
        onRowClick={(row: Product) => {
          navigate(
            `/${params.tenant}/inventory-management/products/${row._id}`
          );
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
        emptyMessage="No products found. Try adjusting your filters."
      />
    </>
  );
};

export default ProductListPage;
