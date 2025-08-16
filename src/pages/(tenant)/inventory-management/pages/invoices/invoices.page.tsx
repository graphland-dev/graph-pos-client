import DataTable from "@/commons/components/DataTable.tsx";
import PageTitle from "@/commons/components/PageTitle";
import {
  MatchOperator,
  ProductInvoice,
  ProductInvoicesWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import dateFormat from "@/commons/utils/dateFormat";
import { useMutation, useQuery } from "@apollo/client";
import { Badge, Button, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { EyeIcon } from "lucide-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DELETE_PRODUCT_INVOICE_MUTATION,
  INVENTORY_PRODUCT_INVOICES_QUERY,
} from "./utils/query.invoices";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [refetching, setRefetching] = useState(false);
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

  const params = useParams<{ tenant: string }>();

  const [deleteInvoice, { loading: deleting }] = useMutation(
    DELETE_PRODUCT_INVOICE_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Invoice deleted successfully",
          color: "green",
        });
        refetch();
      },
      onError: (error) => {
        showNotification({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    }
  );

  const handleDeleteInvoice = (invoice: ProductInvoice) => {
    modals.openConfirmModal({
      title: "Delete Invoice",
      children: (
        <Text size="sm">
          Are you sure you want to delete invoice{" "}
          <strong>{invoice.invoiceUID}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleting },
      onConfirm: () =>
        deleteInvoice({
          variables: {
            where: {
              key: "_id",
              operator: MatchOperator.Eq,
              value: invoice?._id,
            },
          },
        }),
    });
  };

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
          `${currencyNumberWithSymbolFormat(originalRow?.netTotal || 0)} BDT`,
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
            <Badge color={color}>{`${currencyNumberWithSymbolFormat(
              originalRow?.netTotal - (originalRow?.paidAmount || 0)
            )} BDT`}</Badge>
          );
        },

        header: "Due Amount",
      },
      {
        accessorKey: "paidAmount",
        accessorFn: (originalRow: ProductInvoice) =>
          `${currencyNumberWithSymbolFormat(originalRow?.paidAmount || 0)} BDT`,
        header: "Paid Amount",
      },
      {
        accessorKey: "netTotal",
        accessorFn: (originalRow: ProductInvoice) =>
          `${currencyNumberWithSymbolFormat(originalRow?.netTotal || 0)} BDT`,
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
    setRefetching(true);
    refetch(variables).finally(() => {
      setRefetching(false);
    });
  };

  return (
    <>
      <PageTitle title="invoice-details" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Invoices
          </Text>
          <Text size="sm" color="dimmed">
            Manage and track your invoices
          </Text>
        </div>
        <Button
          onClick={() =>
            navigate(`/${params.tenant}/inventory-management/invoices/create`)
          }
        >
          Create Invoice
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.inventory__productInvoices.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.inventory__productInvoices.meta?.totalCount ?? 100}
        onRowClick={(row: ProductInvoice) => {
          navigate(
            `/${params.tenant}/inventory-management/invoices/${row._id}`
          );
        }}
        RowActionMenu={(row: ProductInvoice) => (
          <Menu>
            <Menu.Item
              icon={<EyeIcon size={18} />}
              onClick={() => {
                navigate(
                  `/${params.tenant}/inventory-management/invoices/${row._id}`
                );
              }}
            >
              View Details
            </Menu.Item>
            <Menu.Item
              icon={<IconEdit size={18} />}
              onClick={() => {
                navigate(
                  `/${params.tenant}/inventory-management/invoices/${row._id}/edit`
                );
              }}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              icon={<IconTrash size={18} />}
              color="red"
              onClick={() => handleDeleteInvoice(row)}
            >
              Delete
            </Menu.Item>
          </Menu>
        )}
        loading={loading || refetching}
      />
    </>
  );
};

export default InvoicesPage;
