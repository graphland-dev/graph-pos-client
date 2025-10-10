import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import {
  AccountsWithPagination,
  CommonFindDocumentDto,
  CommonPaginationDto,
  MatchOperator,
  PurchasePayment,
  PurchasePaymentsWithPagination,
  SuppliersWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { formatTableColumnDate } from "@/commons/utils/dateFormat";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Button, Drawer, Input, Select, Title, Flex } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { IconListDetails, IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import PurchasePaymentsDetails from "./components/PurchasePaymentsDetails";
import { PURCHASE_PAYMENTS_QUERY } from "./utils/query.gql";

interface IState {
  refetching: boolean;
  purchasePaymentsRow: null | PurchasePayment;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const PurchasePaymentPage = () => {
  const [state, setState] = useSetState<IState>({
    refetching: false,
    purchasePaymentsRow: null,
  });
  const [openedDetailsDrawer, detailsDrawerHandler] = useDisclosure();
  const params = useParams<{ tenant: string }>();

  // Pagination and sorting states
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: "",
    direction: null,
  });
  const [datatableFilters, setDatatableFilters] = useState<Record<string, any>>(
    {}
  );

  // Build filter variables
  const buildFilterVariables = (): CommonPaginationDto => {
    const graphqlFilters: CommonFindDocumentDto[] = [];

    // Add search filters
    if (datatableFilters.paymentUID) {
      graphqlFilters.push({
        key: "paymentUID",
        operator: MatchOperator.Contains,
        value: datatableFilters.paymentUID,
      });
    }

    if (datatableFilters.supplierName) {
      graphqlFilters.push({
        key: "supplier.name",
        operator: MatchOperator.Contains,
        value: datatableFilters.supplierName,
      });
    }

    if (datatableFilters.supplierId) {
      graphqlFilters.push({
        key: "supplier",
        operator: MatchOperator.Eq,
        value: datatableFilters.supplierId,
      });
    }

    if (datatableFilters.account) {
      graphqlFilters.push({
        key: "account",
        operator: MatchOperator.Eq,
        value: datatableFilters.account,
      });
    }

    // Add date range filters
    if (
      datatableFilters.fromDate &&
      datatableFilters.fromDate instanceof Date
    ) {
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

  const { data, loading } = useQuery<{
    accounting__purchasePayments: PurchasePaymentsWithPagination;
  }>(PURCHASE_PAYMENTS_QUERY, {
    variables: { where: buildFilterVariables() },
    fetchPolicy: "cache-and-network",
  });

  // Fetch accounts for filter dropdown
  const { data: accountsData, loading: accountsLoading } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(PURCHASE_PAYMENTS_ACCOUNTS_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 1000, // Get all accounts for dropdown
      },
    },
  });

  // Fetch suppliers for filter dropdown
  const { data: suppliersData, loading: suppliersLoading } = useQuery<{
    people__suppliers: SuppliersWithPagination;
  }>(PURCHASE_PAYMENTS_SUPPLIERS_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 1000, // Get all suppliers for dropdown
      },
    },
  });

  const [searchParams] = useSearchParams();
  const purchasePaymentId = searchParams.get("purchasePaymentId");

  const [productPurchase] = useLazyQuery<{
    accounting__purchasePayments: PurchasePaymentsWithPagination;
  }>(PURCHASE_PAYMENTS_QUERY, {
    fetchPolicy: "network-only",
  });

  // Process account options for Select component
  const accountOptions = useMemo(() => {
    if (!accountsData?.accounting__accounts?.nodes) return [];
    return accountsData.accounting__accounts.nodes.map((account) => ({
      value: account._id,
      label: `${account.name} [${account.referenceNumber}]`,
    }));
  }, [accountsData]);

  // Process supplier options for Select component
  const supplierOptions = useMemo(() => {
    if (!suppliersData?.people__suppliers?.nodes) return [];
    return suppliersData.people__suppliers.nodes.map((supplier) => ({
      value: supplier._id,
      label: supplier.name,
    }));
  }, [suppliersData]);

  const columns = useMemo<ColumnDef<PurchasePayment>[]>(
    () => [
      {
        accessor: "paymentUID",
        title: "Payment UID",
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
        accessor: (row) =>
          `${row?.account?.name} [${row?.account?.referenceNumber}]`,
        title: "Account",
        sortable: false,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by account"
            value={datatableFilters.account}
            data={accountOptions}
            disabled={accountsLoading}
            onChange={(value) => {
              setValue("account", value);
            }}
            clearable
            searchable
            style={{ minWidth: 250 }}
          />
        ),
      },
      {
        accessor: (row) => row?.supplier?.name || "",
        title: "Supplier",
        sortable: false,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by supplier"
            value={datatableFilters.supplierId}
            data={supplierOptions}
            disabled={suppliersLoading}
            onChange={(value) => {
              setValue("supplierId", value);
            }}
            clearable
            searchable
            style={{ minWidth: 200 }}
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
          currencyNumberWithSymbolFormat(row?.paidAmount || 0),
        title: "Paid Amount",
        sortKey: "paidAmount",
        sortable: true,
      },
    ],
    [
      datatableFilters.account,
      datatableFilters.supplierId,
      datatableFilters.fromDate,
      datatableFilters.toDate,
      accountOptions,
      supplierOptions,
      accountsLoading,
      suppliersLoading,
    ]
  );

  useEffect(() => {
    if (purchasePaymentId) {
      productPurchase({
        variables: {
          where: {
            filters: [
              {
                key: "_id",
                operator: MatchOperator.Eq,
                value: purchasePaymentId,
              },
            ],
          },
        },
        onError: (err) => console.log(err),
      }).then((res) => {
        setState({
          purchasePaymentsRow:
            res.data?.accounting__purchasePayments?.nodes?.[0],
        });
        detailsDrawerHandler.open();
      });
    }
  }, [purchasePaymentId, productPurchase, setState, detailsDrawerHandler]);

  return (
    <>
      <PageTitle title="Purchase Payment-list" />

      <div className="flex items-center justify-between mb-4">
        <div></div>
        <Button
          leftSection={<IconPlus size={16} />}
          component={Link}
          to={`/${params.tenant}/inventory-management/payments/create-purchase-payment`}
          size="sm"
        >
          Make a payment
        </Button>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.accounting__purchasePayments.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.accounting__purchasePayments?.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: PurchasePayment) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  purchasePaymentsRow: row,
                });
                detailsDrawerHandler.open();
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <IconListDetails size={14} />
              View
            </button>
          </div>
        )}
        onRowClick={(row: PurchasePayment) => {
          setState({
            purchasePaymentsRow: row,
          });
          detailsDrawerHandler.open();
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
        emptyMessage="No purchase payments found. Try adjusting your filters."
      />

      <Drawer
        opened={openedDetailsDrawer}
        onClose={detailsDrawerHandler.close}
        position="left"
        size={"90%"}
        title={<Title order={3}>Purchase Payment details</Title>}
        withCloseButton={true}
      >
        <PurchasePaymentsDetails
          purchasePaymentsRow={state?.purchasePaymentsRow as PurchasePayment}
          loading={loading}
        />
      </Drawer>
    </>
  );
};

// Local query for accounts dropdown - isolated from other usages
const PURCHASE_PAYMENTS_ACCOUNTS_QUERY = gql`
  query PurchasePayments__accounts($where: CommonPaginationDto) {
    accounting__accounts(where: $where) {
      nodes {
        _id
        name
        referenceNumber
      }
    }
  }
`;

// Local query for suppliers dropdown - isolated from other usages
const PURCHASE_PAYMENTS_SUPPLIERS_QUERY = gql`
  query PurchasePayments__suppliers($where: CommonPaginationDto) {
    people__suppliers(where: $where) {
      nodes {
        _id
        name
      }
    }
  }
`;

export default PurchasePaymentPage;
