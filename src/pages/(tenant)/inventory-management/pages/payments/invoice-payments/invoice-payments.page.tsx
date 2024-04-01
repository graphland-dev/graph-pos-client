import DataTable from "@/_app/common/data-table/DataTable";
import PageTitle from "@/_app/common/PageTitle";
import {
  InventoryInvoicePayment,
  InventoryInvoicePaymentsWithPagination,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Drawer, Menu, Text } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconFileInfo } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { INVENTORY_INVOICE_PAYMENTS_QUERY } from "./utils/query.invoice-payments";
import dateFormat from "@/_app/common/utils/dateFormat";
import currencyNumberFormat from "@/_app/common/utils/commaNumber";
import InventoryInvoicePaymentDetails from "./components/InventoryInvoicePaymentDetails";

interface IState {
  refetching: boolean;
  openDrawer: boolean;
}

const InvoicePaymentsPage = () => {
  const [invoicePaymentsDetails, setInvoicePaymentsDetails] =
    useState<InventoryInvoicePayment>();
  const [state, setState] = useSetState<IState>({
    refetching: false,
    openDrawer: false,
  });

  const { data, loading, refetch } = useQuery<{
    accounting__inventoryInvoicePayments: InventoryInvoicePaymentsWithPagination;
  }>(INVENTORY_INVOICE_PAYMENTS_QUERY, {
    variables: {
      where: {
        limit: -1,
        page: 1,
      },
    },
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "inventoryInvoicePaymentUID",
        header: "Invoice Payment UID",
      },

      {
        accessorKey: "client.name",
        header: "Client",
      },
      {
        accessorKey: "date",
        accessorFn: (row: InventoryInvoicePayment) =>
          row?.date ? dateFormat(row?.date) : "",
        header: "Date",
      },
      {
        accessorKey: "netAmount",
        accessorFn: (originalRow: InventoryInvoicePayment) =>
          `${currencyNumberFormat(originalRow?.netAmount || 0)} BDT`,
        header: "Net Total",
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
        title={
          <Text className="text-2xl font-semibold">
            Inventory Invoice Payments Details
          </Text>
        }
        opened={state.openDrawer}
        size={"95%"}
      >
        <InventoryInvoicePaymentDetails id={`${invoicePaymentsDetails?._id}`} />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.accounting__inventoryInvoicePayments.nodes ?? []}
        refetch={handleRefetch}
        totalCount={
          data?.accounting__inventoryInvoicePayments.meta?.totalCount ?? 100
        }
        RowActionMenu={(row: InventoryInvoicePayment) => (
          <>
            <Menu.Item
              icon={<IconFileInfo size={18} />}
              onClick={() => {
                setInvoicePaymentsDetails(row);
                setState({
                  openDrawer: true,
                });
              }}
            >
              View
            </Menu.Item>
          </>
        )}
        loading={loading || state.refetching}
      />
    </>
  );
};

export default InvoicePaymentsPage;
