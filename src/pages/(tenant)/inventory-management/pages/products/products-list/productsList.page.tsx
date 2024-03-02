import { Notify } from "@/_app/common/Notification/Notify";
import { confirmModal } from "@/_app/common/confirm/confirm";
import DataTable from "@/_app/common/data-table/DataTable";
import {
  MatchOperator,
  Product,
  ProductsWithPagination,
} from "@/_app/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Menu } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconFileInfo, IconPlus, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  INVENTORY_PRODUCTS_LIST_QUERY,
  INVENTORY_PRODUCT_CREATE,
  INVENTORY_PRODUCT_REMOVE,
} from "./utils/product.query";
import PageTitle from "@/_app/common/PageTitle";

interface IState {
  refetching: boolean;
}

const ProductListPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string }>();

  const [state, setState] = useSetState<IState>({
    refetching: false,
  });

  const { data, loading, refetch } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(INVENTORY_PRODUCTS_LIST_QUERY, {
    variables: {
      where: {
        limit: 10,
        page: 1,
      },
    },
  });

  const [createProduct, { loading: creatingProduct }] = useMutation(
    INVENTORY_PRODUCT_CREATE,
    Notify({
      sucTitle: "Inventory product created successfully!",
      onSuccess(res) {
        navigate(
          `/${params.tenant}/inventory-management/products/${res?.inventory__createProduct?._id}`
        );
        refetch();
      },
    })
  );

  const [deleteProductMutation] = useMutation(INVENTORY_PRODUCT_REMOVE, {
    onCompleted: () => handleRefetch({}),
  });

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
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
        accessorKey: "price",
        header: "Price",
      },
    ],
    []
  );

  return (
    <>
      <PageTitle title="product-list" />
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
          </>
        }
        loading={loading || state.refetching}
      />
    </>
  );
};

export default ProductListPage;
