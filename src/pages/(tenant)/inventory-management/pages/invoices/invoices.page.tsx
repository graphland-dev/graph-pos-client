import DataTable from "@/commons/components/DataTable.tsx";
import PrintableFullInvoice from "@/commons/components/invoice/PrintableFullInvoice";
import PageTitle from "@/commons/components/PageTitle";
import {
  MatchOperator,
  ProductInvoice,
  ProductInvoicesWithPagination,
} from "@/commons/graphql-models/graphql";
import currencyNumberFormat from "@/commons/utils/commaNumber";
import dateFormat from "@/commons/utils/dateFormat";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Badge, Button, Drawer, Menu, Text } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconFileInfo } from "@tabler/icons-react";
import { PrinterIcon } from "lucide-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductInvoiceDetails from "./components/ProductInvoiceDetails";
import { INVENTORY_PRODUCT_INVOICES_QUERY } from "./utils/query.invoices";
interface IState {
  refetching: boolean;
  openDrawer: boolean;
  openPrintableInvoice: boolean;
  printableInvoiceId?: string;
}

const InvoicesPage = () => {
  const [invoiceDetails, setInvoiceDetails] = useState<ProductInvoice>();
  const [state, setState] = useSetState<IState>({
    refetching: false,
    openDrawer: false,
    openPrintableInvoice: false,
    printableInvoiceId: undefined,
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

  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");
  const params = useParams<{ tenant: string }>();

  const [productInvoice] = useLazyQuery<{
    inventory__productInvoices: ProductInvoicesWithPagination;
  }>(INVENTORY_PRODUCT_INVOICES_QUERY, {
    fetchPolicy: "network-only",
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "invoiceUID",
        header: "Invoice UID",
      },
      {
        accessorFn(originalRow) {
          return (
            originalRow?.client?.name || (
              <p className="px-2 bg-destructive/10">No Client</p>
            )
          );
        },
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

  useEffect(() => {
    if (invoiceId) {
      productInvoice({
        variables: {
          where: {
            filters: [
              {
                key: "_id",
                operator: MatchOperator.Eq,
                value: invoiceId,
              },
            ],
          },
        },
      }).then((res) => {
        setInvoiceDetails(res.data?.inventory__productInvoices?.nodes?.[0]);
        setState({
          openDrawer: true,
        });
      });
    }
  }, [searchParams]);

  return (
    <>
      <PageTitle title="invoice-details" />

      <Drawer
        onClose={() => setState({ openDrawer: false })}
        title={
          <div className="flex items-center justify-between gap-3">
            <Text className="text-2xl font-semibold">Invoice Details</Text>
            <Button
              variant="outline"
              leftIcon={<PrinterIcon />}
              onClick={() =>
                setState({
                  openPrintableInvoice: true,
                  printableInvoiceId: invoiceDetails?._id,
                })
              }
            >
              Print
            </Button>
          </div>
        }
        opened={state.openDrawer}
        size={"100%"}
      >
        <ProductInvoiceDetails details={invoiceDetails!} loading={loading} />
      </Drawer>

      <Drawer
        onClose={() =>
          setState({
            openPrintableInvoice: false,
            printableInvoiceId: undefined,
          })
        }
        title={
          <Text className="text-2xl font-semibold">Printable Invoice</Text>
        }
        opened={state.openPrintableInvoice}
        size={"100%"}
      >
        {state.printableInvoiceId && (
          <PrintableFullInvoice
            invoiceId={state.printableInvoiceId}
            tenant={params.tenant ?? ""}
          />
        )}
      </Drawer>

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
        loading={loading || state.refetching}
      />
    </>
  );
};

export default InvoicesPage;
