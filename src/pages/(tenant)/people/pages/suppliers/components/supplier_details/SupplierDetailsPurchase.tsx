import DataTable from "@/_app/common/data-table/DataTable";
import { MatchOperator, ProductPurchase, ProductPurchasesWithPagination, Supplier } from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
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
    const [state, setState] = useSetState<IState>({ refetching: false });
    

  const { data: purchaseData, loading: fetchingPurchaseData, refetch } = useQuery<{
      inventory__productPurchases: ProductPurchasesWithPagination;
  }>(SUPPLIER_DETAILS_PURCHASE_QUERY);
   
    
    const handleRefetch = (variables: any) => {
      setState({ refetching: true });
      refetch(variables).finally(() => {
        setState({ refetching: false });
      });
    };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorFn: (row: ProductPurchase) =>
          dayjs(row?.purchaseDate).format("MMMM D, YYYY h:mm A"),
        accessorKey: "purchaseDate",
        header: "Purchase Date",
      },
      {
        accessorKey: "taxAmount",
        header: "TaxAmount",
      },
      {
        accessorKey: "subTotal",
        header: "Sub Total",
      },
      {
        accessorKey: "costAmount",
        header: "Cost Amount",
      },
      {
        accessorKey: "netTotal",
        header: "Net Total",
      },
    ],
    []
  );

  return (
    <div>
      <DataTable
        columns={columns}
        data={purchaseData?.inventory__productPurchases.nodes ?? []}
        refetch={handleRefetch}
        totalCount={
          purchaseData?.inventory__productPurchases.meta?.totalCount ?? 100
        }
        filters={[
          {
            key: "supplier",
            operator: MatchOperator.Eq,
            value: supplierDetails?._id,
          },
        ]}
        RowActionMenu={() => (
          <>
            <Menu.Item
              //   onClick={() => {
              //     handleDeletePurchase(row._id);
              //   }}
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
              onClick={drawerHandler.open}
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        loading={fetchingPurchaseData || state.refetching}
      />
      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title="Create Purchase"
        withCloseButton={true}
      >
        {/* <EmployeePurchaseDataForm
          supplierDetails={supplierDetails}
          accounts={payRoll_accounts?.accounting__accounts?.nodes as Account[]}
          onFormSubmitted={() => {
            refetch();
            drawerHandler.close();
          }}
          currentSalary={undefined}
        /> */}
      </Drawer>
      {/* <pre>{JSON.stringify(purchaseData, null, 2)}</pre>
      <pre>{JSON.stringify(supplierDetails, null, 2)}</pre> */}
    </div>
  );
};

export default SupplierDetailsPurchase;
