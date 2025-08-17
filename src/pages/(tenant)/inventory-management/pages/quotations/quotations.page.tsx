import AppDatatable, { ColumnDef } from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import {
  MatchOperator,
  ProductQuotation,
  ProductQuotationsWithPagination,
  ClientsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import dateFormat from "@/commons/utils/dateFormat";
import { useMutation, useQuery } from "@apollo/client";
import { Badge, Button, Input, Select, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  INVENTORY_PRODUCT_QUOTATIONS_QUERY, 
  DELETE_PRODUCT_QUOTATION_MUTATION 
} from "./utils/query.quotations";
import { PEOPLE_CLIENTS_QUERY } from "../../../people/pages/client/utils/client.query";

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const QuotationsPage = () => {
  const navigate = useNavigate();
  const [refetching, setRefetching] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>({ column: "", direction: null });
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Build query variables
  const buildQueryVariables = () => {
    const graphqlFilters = [];

    // Add search filters
    if (filters.quotationUID) {
      graphqlFilters.push({
        key: "quotationUID",
        operator: MatchOperator.Contains,
        value: filters.quotationUID,
      });
    }

    if (filters.client) {
      graphqlFilters.push({
        key: "client",
        operator: MatchOperator.Eq,
        value: filters.client,
      });
    }

    if (filters.status) {
      graphqlFilters.push({
        key: "status",
        operator: MatchOperator.Eq,
        value: filters.status,
      });
    }

    // Add date range filters
    if (filters.startDate) {
      graphqlFilters.push({
        key: "date",
        operator: MatchOperator.Gte,
        value: filters.startDate,
      });
    }

    if (filters.endDate) {
      graphqlFilters.push({
        key: "date",
        operator: MatchOperator.Lte,
        value: filters.endDate,
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
    inventory__productQuotations: ProductQuotationsWithPagination;
  }>(INVENTORY_PRODUCT_QUOTATIONS_QUERY, {
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

  const [deleteQuotation, { loading: deleting }] = useMutation(
    DELETE_PRODUCT_QUOTATION_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Quotation deleted successfully",
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

  const handleDeleteQuotation = (quotation: ProductQuotation) => {
    modals.openConfirmModal({
      title: "Delete Quotation",
      children: (
        <Text size="sm">
          Are you sure you want to delete quotation{" "}
          <strong>{quotation.quotationUID}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleting },
      onConfirm: () =>
        deleteQuotation({
          variables: {
            where: {
              key: "_id",
              operator: MatchOperator.Eq,
              value: quotation?._id,
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

  // Status options for filter
  const statusOptions = [
    { value: "DRAFT", label: "Draft" },
    { value: "SENT", label: "Sent" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "CONVERTED", label: "Converted" },
    { value: "EXPIRED", label: "Expired" },
  ];

  const columns = useMemo<ColumnDef<ProductQuotation>[]>(
    () => [
      {
        accessor: "quotationUID",
        title: "Quotation UID",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search quotation UID..."
            onChange={(e) => setValue("quotationUID", e.target.value)}
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
        accessor: (row) => row?.date ? dateFormat(row?.date) : "",
        title: "Quotation Date",
        sortKey: "date",
        sortable: true,
        Filter: (setValue) => (
          <div className="flex flex-col gap-2" style={{ minWidth: 200 }}>
            <DatePickerInput
              label="Start date"
              value={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(value: Date | null) =>
                setValue("startDate", value?.toISOString() || "")
              }
              size="sm"
              clearable
            />
            <DatePickerInput
              label="End date"
              value={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(value: Date | null) =>
                setValue("endDate", value?.toISOString() || "")
              }
              size="sm"
              clearable
            />
          </div>
        ),
      },
      {
        accessor: (row) => row?.validUntil ? dateFormat(row?.validUntil) : "",
        title: "Valid Until",
        sortKey: "validUntil", 
        sortable: true,
      },
      {
        accessor: (row) => `${currencyNumberWithSymbolFormat(row?.netTotal || 0)} BDT`,
        title: "Sub Total",
        sortKey: "netTotal",
        sortable: true,
      },
      {
        accessor: (row) => `${currencyNumberWithSymbolFormat(row?.netTotal || 0)} BDT`,
        title: "Net Total",
        sortKey: "netTotal",
        sortable: true,
      },
      {
        accessor: (row) => {
          const status = row?.status || "DRAFT";
          let color = "gray";

          switch (status) {
            case "SENT":
              color = "blue";
              break;
            case "ACCEPTED":
              color = "green";
              break;
            case "REJECTED":
              color = "red";
              break;
            case "CONVERTED":
              color = "violet";
              break;
            case "EXPIRED":
              color = "orange";
              break;
          }

          return <Badge color={color}>{status}</Badge>;
        },
        title: "Status",
        sortKey: "status",
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by status..."
            value={filters.status || null}
            data={statusOptions}
            onChange={(value) => setValue("status", value || "")}
            clearable
            style={{ minWidth: 150 }}
          />
        ),
      },
    ],
    [
      clientOptions,
      clientsLoading,
      filters.client,
      filters.status,
      filters.startDate,
      filters.endDate,
    ]
  );

  const handleRefetch = () => {
    setRefetching(true);
    refetch({ where: buildQueryVariables() }).finally(() => {
      setRefetching(false);
    });
  };

  return (
    <>
      <PageTitle title="quotation-details" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Quotations
          </Text>
          <Text size="sm" color="dimmed">
            Manage and track your quotations
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
              navigate(`/${params.tenant}/inventory-management/quotations/create`)
            }
          >
            Create Quotation
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.inventory__productQuotations.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.inventory__productQuotations.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: ProductQuotation) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/${params.tenant}/inventory-management/quotations/${row._id}`
                );
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteQuotation(row);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
            >
              <IconTrash size={14} />
              Delete
            </button>
          </div>
        )}
        onRowClick={(row: ProductQuotation) => {
          navigate(
            `/${params.tenant}/inventory-management/quotations/${row._id}`
          );
        }}
        onSortChange={(column, direction) => {
          setSorting({ column, direction });
        }}
        onFilterChange={(column, value) => {
          setFilters(prev => ({ ...prev, [column]: value }));
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
        onPaginationChange={(page, pageSize) => {
          setPagination({ page, pageSize });
        }}
        loading={loading || refetching}
        emptyMessage="No quotations found. Try adjusting your filters."
      />
    </>
  );
};

export default QuotationsPage;
