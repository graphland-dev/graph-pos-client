import DataTable from "@/_app/common/data-table/DataTable";
import PageTitle from "@/_app/common/PageTitle";
import currencyNumberFormat from "@/_app/common/utils/commaNumber";
import dateFormat from "@/_app/common/utils/dateFormat";
import {
  ProductInvoice,
  ProductInvoicesWithPagination,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Badge, Drawer, Menu, Text } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconFileInfo } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { INVENTORY_PRODUCT_INVOICES_QUERY } from "./utils/query.invoices";
import ProductInvoiceDetails from "./components/ProductInvoiceDetails";
interface IState {
  refetching: boolean;
  openDrawer: boolean;
}

const InvoicesPage = () => {
  const [invoiceDetails, setInvoiceDetails] = useState<ProductInvoice>();
  const [state, setState] = useSetState<IState>({
    refetching: false,
    openDrawer: false,
  });
  const { data, loading, refetch } = useQuery<{
    inventory__productInvoices: ProductInvoicesWithPagination;
  }>(INVENTORY_PRODUCT_INVOICES_QUERY, {
    variables: {
      where: {
        limit: -1,
        page: 1,
      },
    },
  });

  //   console.log(data);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "invoiceUID",
        header: "Invoice UID",
      },
      {
        accessorKey: "client.name",
        header: "Client Name",
      },
      {
        accessorFn: (row: ProductInvoice) =>
          row?.date ? dateFormat(row?.date) : "",
        header: "Purchase Date",
      },
      {
        accessorKey: "subTotal",
        accessorFn: (originalRow: ProductInvoice) =>
          `${currencyNumberFormat(originalRow?.netTotal || 0)} BDT`,
        header: "Sub Total",
      },
      {
        accessorKey: "dueAmount",
        accessorFn: (originalRow: ProductInvoice) => {
          const paidAmount = originalRow?.paidAmount || 0;
          const netTotal = originalRow?.netTotal || 0;

          const totalDue = netTotal - paidAmount;

          let color = "red";
          if (totalDue > 0 && paidAmount !== 0) {
            color = "yellow";
          }
          if (totalDue === 0 && paidAmount !== 0) {
            color = "green";
          }

          return (
            <Badge color={color}>{`${currencyNumberFormat(
              originalRow?.netTotal - (originalRow?.paidAmount || 0)
            )} BDT`}</Badge>
          );
        },

        header: "Due Amount",
      },
      {
        accessorKey: "paidAmount",
        accessorFn: (originalRow: ProductInvoice) =>
          `${currencyNumberFormat(originalRow?.paidAmount || 0)} BDT`,
        header: "Paid Amount",
      },
      {
        accessorKey: "netTotal",
        accessorFn: (originalRow: ProductInvoice) =>
          `${currencyNumberFormat(originalRow?.netTotal || 0)} BDT`,
        header: "Net Total",
      },
      {
        accessorKey: "source",
        header: "Source",
      },
    ],
    []
  );

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  return (
    <>
      <PageTitle title="purchase-list" />
      <Drawer
        onClose={() =>
          setState({
            openDrawer: false,
          })
        }
        title={<Text className="text-2xl font-semibold">Invoice Details</Text>}
        opened={state.openDrawer}
        size={"90%"}
      >
        <ProductInvoiceDetails details={invoiceDetails!} loading={loading} />
      </Drawer>
      {/* <pre>{ JSON.stringify(data,  null, 2)}</pre> */}
      <DataTable
        columns={columns}
        data={data?.inventory__productInvoices.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.inventory__productInvoices.meta?.totalCount ?? 100}
        RowActionMenu={(row: ProductInvoice) => (
          <>
            <Menu.Item
              icon={<IconFileInfo size={18} />}
              onClick={() => {
                setInvoiceDetails(row);
                setState({
                  openDrawer: true,
                });
              }}
            >
              View
            </Menu.Item>
          </>
        )}
        // ActionArea={
        //   <>
        //     <Button
        //       leftIcon={<IconPlus size={16} />}
        //     //   component={Link}
        //     //   to={`/${params.tenant}/inventory-management/purchases/create`}
        //       size="sm"
        //     >
        //       Add new
        //     </Button>
        //   </>
        // }
        loading={loading || state.refetching}
      />
    </>
  );
};

export default InvoicesPage;
