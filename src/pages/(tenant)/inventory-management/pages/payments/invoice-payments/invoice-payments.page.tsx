import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { formatTableColumnDate } from "@/commons/utils/dateFormat";
import {
  CommonFindDocumentDto,
  CommonPaginationDto,
  InventoryInvoicePayment,
  InventoryInvoicePaymentsWithPagination,
  MatchOperator,
  ClientsWithPagination,
} from "@/commons/graphql-models/graphql";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { Drawer, Input, Text, Select, Flex } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { IconFileInfo } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InventoryInvoicePaymentDetails from "./components/InventoryInvoicePaymentDetails";

interface IState {
  refetching: boolean;
  openDrawer: boolean;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const InvoicePaymentsPage = () => {
  const [invoicePaymentsDetails, setInvoicePaymentsDetails] =
    useState<InventoryInvoicePayment>();
  const [state, setState] = useSetState<IState>({
    refetching: false,
    openDrawer: false,
  });

  // Pagination and sorting states
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: "",
    direction: null,
  });
  const [datatableFilters, setDatatableFilters] = useState<
    Record<string, any>
  >({});

  // Build filter variables
  const buildFilterVariables = (): CommonPaginationDto => {
    const graphqlFilters: CommonFindDocumentDto[] = [];

    // Add search filters
    if (datatableFilters.paymentUID) {
      graphqlFilters.push({
        key: "inventoryInvoicePaymentUID",
        operator: MatchOperator.Contains,
        value: datatableFilters.paymentUID,
      });
    }

    if (datatableFilters.clientName) {
      graphqlFilters.push({
        key: "client.name",
        operator: MatchOperator.Contains,
        value: datatableFilters.clientName,
      });
    }

    if (datatableFilters.clientId) {
      graphqlFilters.push({
        key: "client",
        operator: MatchOperator.Eq,
        value: datatableFilters.clientId,
      });
    }

    // Add date range filters
    if (datatableFilters.fromDate && datatableFilters.fromDate instanceof Date) {
      graphqlFilters.push({
        key: "date",
        operator: MatchOperator.Gte,
        value: datatableFilters.fromDate.toISOString(),
      });
    }

    if (datatableFilters.toDate && datatableFilters.toDate instanceof Date) {
      // Set end of day for toDate to include the entire day
      const endOfDay = new Date(datatableFilters.toDate);
      endOfDay.setHours(23, 59, 59, 999);
      graphqlFilters.push({
        key: "date",
        operator: MatchOperator.Lte,
        value: endOfDay.toISOString(),
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? "ASC" : "DESC",
      filters: graphqlFilters,
    } as CommonPaginationDto;
  };

  // Fetch clients for dropdown
  const { data: clientsData, loading: clientsLoading } = useQuery<{
    people__clients: ClientsWithPagination;
  }>(INVOICE_PAYMENTS_CLIENTS_QUERY);

  const { data, loading } = useQuery<{
    accounting__inventoryInvoicePayments: InventoryInvoicePaymentsWithPagination;
  }>(INVOICE_PAYMENTS_FILTERED_QUERY, {
    variables: {
      where: buildFilterVariables(),
    },
    fetchPolicy: "cache-and-network",
  });

  const [searchParams] = useSearchParams();
  const invoicePaymentId = searchParams.get("invoicePaymentId");

  const [invoicePayment] = useLazyQuery<{
    accounting__inventoryInvoicePayments: InventoryInvoicePaymentsWithPagination;
  }>(INVOICE_PAYMENTS_FILTERED_QUERY, {
    fetchPolicy: "network-only",
  });

  // Process client options for dropdown
  const clientOptions = useMemo(() => {
    if (!clientsData?.people__clients?.nodes) return [];
    return clientsData.people__clients.nodes.map((client) => ({
      value: client._id,
      label: client.name,
    }));
  }, [clientsData]);

  const columns = useMemo<ColumnDef<InventoryInvoicePayment>[]>(
    () => [
      {
        accessor: "inventoryInvoicePaymentUID",
        title: "Invoice Payment UID",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search by payment UID..."
            onChange={(e) => setValue("paymentUID", e.target.value)}
          />
        ),
      },
      {
        accessor: "client.name",
        title: "Client",
        sortable: false,
        Filter: (setValue) => (
          <Select
            placeholder="Select client..."
            data={clientOptions}
            onChange={(value) => setValue("clientId", value || "")}
            clearable
            searchable
            disabled={clientsLoading}
          />
        ),
      },
      {
        accessor: (row) => (row?.date ? formatTableColumnDate(row?.date) : ""),
        title: "Date",
        sortKey: "date",
        sortable: true,
        Filter: (setValue) => (
          <Flex gap="xs" direction="column">
            <DateInput
              placeholder="From date"
              value={datatableFilters.fromDate || null}
              onChange={(date) => setValue("fromDate", date)}
              clearable
              size="xs"
            />
            <DateInput
              placeholder="To date"
              value={datatableFilters.toDate || null}
              onChange={(date) => setValue("toDate", date)}
              clearable
              size="xs"
            />
          </Flex>
        ),
      },
      {
        accessor: (row) =>
          currencyNumberWithSymbolFormat(row?.netAmount || 0),
        title: "Net Total",
        sortKey: "netAmount",
        sortable: true,
      },
    ],
    [clientOptions, clientsLoading, datatableFilters.fromDate, datatableFilters.toDate]
  );

  useEffect(() => {
    if (invoicePaymentId) {
      invoicePayment({
        variables: {
          where: {
            filters: [
              {
                key: "_id",
                operator: MatchOperator.Eq,
                value: invoicePaymentId,
              },
            ],
          },
        },
        onError: (err) => console.log(err),
      }).then((res) => {
        setInvoicePaymentsDetails(
          res.data?.accounting__inventoryInvoicePayments?.nodes?.[0]
        );
        setState({
          openDrawer: true,
        });
      });
    }
  }, [invoicePaymentId, invoicePayment, setState]);

  return (
    <>
      <PageTitle title="Invoice Payments" />
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
      <AppDatatable
        columns={columns}
        data={data?.accounting__inventoryInvoicePayments.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems:
            data?.accounting__inventoryInvoicePayments.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: InventoryInvoicePayment) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInvoicePaymentsDetails(row);
                setState({
                  openDrawer: true,
                });
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <IconFileInfo size={14} />
              View
            </button>
          </div>
        )}
        onRowClick={(row: InventoryInvoicePayment) => {
          setInvoicePaymentsDetails(row);
          setState({
            openDrawer: true,
          });
        }}
        onSortChange={(column, direction) => {
          setSorting({ column, direction });
        }}
        onFilterChange={(column, value) => {
          setDatatableFilters((prev) => ({ ...prev, [column]: value }));
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onPaginationChange={(page, pageSize) => {
          setPagination({ page, pageSize });
        }}
        loading={loading || state.refetching}
        emptyMessage="No invoice payments found. Try adjusting your filters."
      />
    </>
  );
};

export default InvoicePaymentsPage;

// Local GraphQL query for clients dropdown
const INVOICE_PAYMENTS_CLIENTS_QUERY = gql`
  query InvoicePaymentsClients {
    people__clients {
      nodes {
        _id
        name
      }
    }
  }
`;

// Local GraphQL query for invoice payments with filtering support
const INVOICE_PAYMENTS_FILTERED_QUERY = gql`
  query InvoicePaymentsFiltered($where: CommonPaginationDto) {
    accounting__inventoryInvoicePayments(where: $where) {
      nodes {
        _id
        inventoryInvoicePaymentUID
        client {
          _id
          name
        }
        netAmount
        date
      }
      meta {
        totalCount
        currentPage
        hasNextPage
        totalPages
      }
    }
  }
`;
