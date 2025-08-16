import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback.ts";
import { confirmModal } from "@/commons/components/confirm.tsx";
import DataTable from "@/commons/components/DataTable.tsx";
import {
  MatchOperator,
  Product,
  ProductsWithPagination,
  BrandsWithPagination,
  CommonPaginationDto,
  CommonFindDocumentDto,
} from "@/commons/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Menu, Group, Select, Stack, Title } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import {
  IconBrandProducthunt,
  IconFileInfo,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  INVENTORY_PRODUCTS_LIST_QUERY,
  INVENTORY_PRODUCT_CREATE,
  INVENTORY_PRODUCT_REMOVE,
  GET_ROOT_CATEGORIES_WITH_CHILDREN_QUERY,
  BRANDS_QUERY,
} from "./utils/product.query";
import ImportExportCSV from "./ImportExportCSV";
import CategoryPicker from "../products-category/components/CategoryPicker";
import { CategoryTreeNode } from "../products-category/utils/category.validations";

interface IState {
  refetching: boolean;
}

const ProductListPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string }>();

  const [state, setState] = useSetState<IState>({
    refetching: false,
  });

  // Filter states
  const [filterableCategoryId, setFilterableCategoryId] = useState<
    string | null
  >(null);
  const [filterableBrandId, setFilterableBrandId] = useState<string | null>(
    null
  );

  // Build filter variables
  const buildFilterVariables = () => {
    const filters: CommonFindDocumentDto[] = [];

    if (filterableCategoryId) {
      filters.push({
        key: "category",
        operator: MatchOperator.Eq,
        value: filterableCategoryId,
      });
    }

    if (filterableBrandId) {
      filters.push({
        key: "brand",
        operator: MatchOperator.Eq,
        value: filterableBrandId,
      });
    }

    return { page: 1, limit: 10, filters } as CommonPaginationDto;
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

    refetch(buildFilterVariables()).finally(() => {
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
        header: "Stock Quantity",
        accessorFn(originalRow: Product) {
          if (originalRow.isSellableWithoutStock) {
            return "N/A";
          }
          return (
            originalRow?.stockInQuantity - originalRow?.stockOutQuantity || 0
          );
        },
      },
      {
        accessorKey: "category.name",
        header: "Category",
      },
      {
        accessorKey: "brand.name",
        header: "Brand",
      },
      {
        accessorKey: "price",
        header: "Price",
      },
      {
        accessorKey: "purchasePrice",
        header: "Purchase Price",
      },
    ],
    []
  );

  return (
    <Stack spacing="md">
      {/* Header with Title and Filters */}
      <Group position="apart" align="center">
        {/* Left side - Title */}
        <Title order={2}>Inventory Products</Title>

        {/* Right side - Filters */}
        <Group spacing="md">
          <CategoryPicker
            placeholder="Filter by category"
            value={filterableCategoryId}
            categories={
              categoriesData?.inventory__rootCategoriesWithChildren || []
            }
            disabled={categoriesLoading}
            onChange={setFilterableCategoryId}
            allowClear={true}
            showPath={false}
            showLevel={false}
            style={{ minWidth: 200 }}
          />

          <Select
            placeholder="Filter by brand"
            value={filterableBrandId}
            data={brandOptions}
            disabled={brandsLoading}
            onChange={setFilterableBrandId}
            clearable
            searchable
            style={{ minWidth: 150 }}
          />
        </Group>
      </Group>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.inventory__products.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.inventory__products.meta?.totalCount ?? 10}
        RowActionMenu={(row: Product) => (
          <>
            <Menu.Item
              component={Link}
              to={`/${params.tenant}/inventory-management/products/${row?._id}`}
              icon={<IconFileInfo size={18} />}
            >
              View
            </Menu.Item>
            <Menu.Item
              component={Link}
              to={`/${params.tenant}/inventory-management/purchases/create?productId=${row?._id}`}
              icon={<IconBrandProducthunt size={18} />}
            >
              Purchase This
            </Menu.Item>
            <Menu.Item
              onClick={() => handleDeleteAccount(row._id)}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
          </>
        )}
        ActionArea={
          <Group spacing="sm">
            <Button
              leftIcon={<IconPlus size={16} />}
              loading={creatingProduct}
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
              size="sm"
            >
              Add new
            </Button>
            <ImportExportCSV onImportComplete={refetch} />
          </Group>
        }
        onRowClick={(row) => {
          navigate(
            `/${params.tenant}/inventory-management/products/${row?._id}`
          );
        }}
        loading={loading || state.refetching}
      />
    </Stack>
  );
};

export default ProductListPage;
