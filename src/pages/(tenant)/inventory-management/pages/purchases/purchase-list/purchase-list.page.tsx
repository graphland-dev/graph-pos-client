import PageTitle from "@/_app/common/PageTitle";
import { confirmModal } from "@/_app/common/confirm/confirm";
import DataTable from "@/_app/common/data-table/DataTable";
import commaNumber from "@/_app/common/utils/commaNumber";
import dateFormat from "@/_app/common/utils/dateFormat";
import {
  MatchOperator,
  ProductPurchase,
  ProductPurchasesWithPagination,
} from "@/_app/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconFileInfo, IconPlus, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PurchaseDetails from "./components/PurchaseDetails";
import {
  Inventory__Remove_Product_Purchase,
  Inventory__product_Purchases_Query,
} from "./utils/query";

interface IState {
  refetching: boolean;
  openDrawer: boolean;
}

const PurchaseListPage = () => {
  const [purchaseDetails, setPurchaseDetails] = useState<ProductPurchase>();
  const [state, setState] = useSetState<IState>({
    refetching: false,
    openDrawer: false,
  });

  const params = useParams<{ tenant: string }>();

  const { data, loading, refetch } = useQuery<{
    inventory__productPurchases: ProductPurchasesWithPagination;
  }>(Inventory__product_Purchases_Query, {
    variables: {
      where: {
        limit: 10,
        page: 1,
      },
    },
  });

  const [deleteProductMutation] = useMutation(
    Inventory__Remove_Product_Purchase,
    {
      onCompleted: () => handleRefetch({}),
    }
  );

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
        accessorKey: "purchaseUID",
        header: "Purchase UID",
      },
      {
        accessorKey: "supplier.name",
        header: "Supplier Name",
      },
      {
        accessorKey: "purchaseDate",
        accessorFn: (row: ProductPurchase) => dateFormat(row?.purchaseDate),
        header: "Purchase Date",
      },
      {
        accessorKey: "purchaseOrderDate",
        accessorFn: (row: ProductPurchase) =>
          dateFormat(row?.purchaseOrderDate),
        header: "Order Date",
      },
      {
        accessorKey: "dueAmount",
        accessorFn: (originalRow: ProductPurchase) =>
          `${commaNumber(
            originalRow?.netTotal - (originalRow?.paidAmount || 0)
          )} BDT`,
        header: "Due Amount",
      },
      {
        accessorKey: "paidAmount",
        accessorFn: (originalRow: ProductPurchase) =>
          `${commaNumber(originalRow?.paidAmount || 0)} BDT`,
        header: "Paid Amount",
      },
      {
        accessorKey: "netTotal",
        accessorFn: (originalRow: ProductPurchase) =>
          `${commaNumber(originalRow?.netTotal || 0)} BDT`,
        header: "Net Total",
      },
    ],
    []
  );

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
      <DataTable
        columns={columns}
        data={data?.inventory__productPurchases.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.inventory__productPurchases.meta?.totalCount ?? 10}
        RowActionMenu={(row: ProductPurchase) => (
          <>
            {(row?.paidAmount || 0) < (row?.netTotal || 0) && (
              <Menu.Item
                icon={<IconFileInfo size={18} />}
                component={Link}
                to={`/${params.tenant}/inventory-management/payments/create-purchase-payment?supplierId=${row.supplier?._id}&purchaseId=${row._id}`}
              >
                Make Payment
              </Menu.Item>
            )}

            <Menu.Item
              icon={<IconFileInfo size={18} />}
              onClick={() => {
                setPurchaseDetails(row);
                setState({
                  openDrawer: true,
                });
              }}
            >
              View
            </Menu.Item>
            <Menu.Item
              onClick={() => handleDeleteAccount(row._id)}
              icon={<IconTrash size={18} />}
              color="red"
            >
              Delete
            </Menu.Item>
          </>
        )}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              component={Link}
              to={`/${params.tenant}/inventory-management/purchases/create`}
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

export default PurchaseListPage;
