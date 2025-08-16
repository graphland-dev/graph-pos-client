import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import {
  MatchOperator,
  ProductInvoice,
  ProductInvoicesWithPagination,
  ClientsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import dateFormat from "@/commons/utils/dateFormat";
import { useMutation, useQuery } from "@apollo/client";
import { Badge, Button, Input, Select, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { EyeIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DELETE_PRODUCT_INVOICE_MUTATION,
  INVENTORY_PRODUCT_INVOICES_QUERY,
} from "./utils/query.invoices";
import { PEOPLE_CLIENTS_QUERY } from "../../../people/pages/client/utils/client.query";

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [refetching, setRefetching] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: "",
    direction: null,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});
  // Build query variables
  const buildQueryVariables = () => {
    const graphqlFilters = [];

    // Add search filters
    if (filters.invoiceUID) {
      graphqlFilters.push({
        key: "invoiceUID",
        operator: MatchOperator.Contains,
        value: filters.invoiceUID,
      });
    }

    if (filters.client) {
      graphqlFilters.push({
        key: "client",
        operator: MatchOperator.Eq,
        value: filters.client,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? "ASC" : "DESC",
      filters: graphqlFilters,
    };
  };

  const { data, loading, refetch } = useQuery<{
    inventory__productInvoices: ProductInvoicesWithPagination;
  }>(INVENTORY_PRODUCT_INVOICES_QUERY, {
    variables: {
      where: buildQueryVariables(),
    },
    fetchPolicy: "cache-and-network",
  });

  // Fetch clients for dropdown filter
  const { data: clientsData, loading: clientsLoading } = useQuery<{
    people__clients: ClientsWithPagination;
  }>(PEOPLE_CLIENTS_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: -1, // Get all clients for dropdown
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

  // Process client options for Select component
  const clientOptions = useMemo(() => {
    if (!clientsData?.people__clients?.nodes) return [];
    return clientsData.people__clients.nodes.map((client) => ({
      value: client._id,
      label: client.name,
    }));
  }, [clientsData]);

  const columns = useMemo<ColumnDef<ProductInvoice>[]>(
    () => [
      {
        accessor: "invoiceUID",
        title: "Invoice UID",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search invoice UID..."
            onChange={(e) => setValue("invoiceUID", e.target.value)}
          />
        ),
      },
      {
        accessor: (row) => row?.client?.name || "No Client",
        title: "Client Name",
        sortKey: "client",
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by client..."
            value={filters.client || null}
            data={clientOptions}
            disabled={clientsLoading}
            onChange={(value) => setValue("client", value || "")}
            clearable
            searchable
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row) => (row?.date ? dateFormat(row?.date) : ""),
        title: "Purchase Date",
        sortKey: "date",
        sortable: true,
      },
      {
        accessor: (row) =>
          `${currencyNumberWithSymbolFormat(row?.netTotal || 0)} BDT`,
        title: "Sub Total",
        sortKey: "netTotal",
        sortable: true,
      },
      {
        accessor: (row) => {
          const paidAmount = row?.paidAmount || 0;
          const netTotal = row?.netTotal || 0;
          const totalDue = netTotal - paidAmount;

          // Determine badge color based on payment status
          let color = "red";
          if (totalDue > 0 && paidAmount !== 0) {
            color = "yellow";
          }
          if (totalDue === 0 && paidAmount !== 0) {
            color = "green";
          }

          // Return Badge component for custom rendering
          return (
            <Badge color={color}>
              {currencyNumberWithSymbolFormat(totalDue)} BDT
            </Badge>
          );
        },
        title: "Due Amount",
        sortable: false, // Disable sorting for custom components
      },
      {
        accessor: (row) =>
          `${currencyNumberWithSymbolFormat(row?.paidAmount || 0)} BDT`,
        title: "Paid Amount",
        sortKey: "paidAmount",
        sortable: true,
      },
      {
        accessor: (row) =>
          `${currencyNumberWithSymbolFormat(row?.netTotal || 0)} BDT`,
        title: "Net Total",
        sortKey: "netTotal",
        sortable: true,
      },
      {
        accessor: "source",
        title: "Source",
        sortable: true,
      },
    ],
    [clientOptions, clientsLoading, filters.client]
  );

  const handleRefetch = () => {
    setRefetching(true);
    refetch({ where: buildQueryVariables() }).finally(() => {
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
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefetch}
            disabled={refetching}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {refetching ? "Refreshing..." : "Refresh"}
          </button>
          <Button
            onClick={() =>
              navigate(`/${params.tenant}/inventory-management/invoices/create`)
            }
          >
            Create Invoice
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.inventory__productInvoices.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.inventory__productInvoices.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: ProductInvoice) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/${params.tenant}/inventory-management/invoices/${row._id}`
                );
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <EyeIcon size={14} />
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/${params.tenant}/inventory-management/invoices/${row._id}/edit`
                );
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 rounded-md bg-green-50 hover:bg-green-100"
            >
              <IconEdit size={14} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteInvoice(row);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 rounded-md bg-red-50 hover:bg-red-100"
            >
              <IconTrash size={14} />
              Delete
            </button>
          </div>
        )}
        onRowClick={(row: ProductInvoice) => {
          navigate(
            `/${params.tenant}/inventory-management/invoices/${row._id}`
          );
        }}
        onSortChange={(column, direction) => {
          setSorting({ column, direction });
        }}
        onFilterChange={(column, value) => {
          setFilters((prev) => ({ ...prev, [column]: value }));
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onPaginationChange={(page, pageSize) => {
          setPagination({ page, pageSize });
        }}
        loading={loading || refetching}
        emptyMessage="No invoices found. Try adjusting your filters."
      />
    </>
  );
};

export default InvoicesPage;
