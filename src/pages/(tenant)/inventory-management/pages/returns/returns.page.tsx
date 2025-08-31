import { useMemo, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { Badge, Button, Select, Input } from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconPlus, IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { formatTableColumnDate } from "@/commons/utils/dateFormat";
import {
  GET_PRODUCT_RETURNS,
  REMOVE_PRODUCT_RETURN,
} from "./utils/returns.query";
import {
  MatchOperator,
  CommonPaginationDto,
  CommonFindDocumentDto,
  ProductReturn,
  ProductReturnsWithPagination,
  SortType,
} from "@/commons/graphql-models/graphql";

const RETURN_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const RETURN_REASON_OPTIONS = [
  { value: "DAMAGED", label: "Damaged" },
  { value: "DEFECTIVE", label: "Defective" },
  { value: "WRONG_ITEM", label: "Wrong Item" },
  { value: "NOT_AS_DESCRIBED", label: "Not as Described" },
  { value: "CUSTOMER_CHANGED_MIND", label: "Customer Changed Mind" },
  { value: "SIZE_ISSUE", label: "Size Issue" },
  { value: "QUALITY_ISSUE", label: "Quality Issue" },
  { value: "OTHER", label: "Other" },
];

const RETURN_TYPE_OPTIONS = [
  { value: "FULL_REFUND", label: "Full Refund" },
  { value: "PARTIAL_REFUND", label: "Partial Refund" },
  { value: "STORE_CREDIT", label: "Store Credit" },
  { value: "EXCHANGE", label: "Exchange" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "yellow";
    case "APPROVED":
      return "blue";
    case "COMPLETED":
      return "green";
    case "REJECTED":
    case "CANCELLED":
      return "red";
    default:
      return "gray";
  }
};

const ReturnsPage = () => {
  const navigate = useNavigate();
  const { tenant } = useParams<{ tenant: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 100 });
  const [sorting, setSorting] = useState<{
    column: string;
    direction: "asc" | "desc" | null;
  }>({
    column: "createdAt",
    direction: "desc",
  });
  const [datatableFilters, setDatatableFilters] = useState({
    returnUID: searchParams.get("returnUID") || "",
    status: searchParams.get("status") || "",
    reason: searchParams.get("reason") || "",
    returnType: searchParams.get("returnType") || "",
  });

  // Build filter variables for GraphQL query
  const buildFilterVariables = (): CommonPaginationDto => {
    const graphqlFilters: CommonFindDocumentDto[] = [];

    if (datatableFilters.returnUID) {
      graphqlFilters.push({
        key: "returnUID",
        operator: MatchOperator.Contains,
        value: datatableFilters.returnUID,
      });
    }

    if (datatableFilters.status) {
      graphqlFilters.push({
        key: "status",
        operator: MatchOperator.Eq,
        value: datatableFilters.status,
      });
    }

    if (datatableFilters.reason) {
      graphqlFilters.push({
        key: "reason",
        operator: MatchOperator.Eq,
        value: datatableFilters.reason,
      });
    }

    if (datatableFilters.returnType) {
      graphqlFilters.push({
        key: "returnType",
        operator: MatchOperator.Eq,
        value: datatableFilters.returnType,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column,
      sort: sorting.direction === "asc" ? SortType.Asc : SortType.Desc,
      filters: graphqlFilters.length > 0 ? graphqlFilters : undefined,
    };
  };

  const { data, loading, refetch } = useQuery<{
    inventory__productReturns: ProductReturnsWithPagination;
  }>(GET_PRODUCT_RETURNS, {
    variables: {
      where: buildFilterVariables(),
    },
    errorPolicy: "all",
  });

  const [removeReturn] = useMutation(REMOVE_PRODUCT_RETURN, {
    onCompleted: () => {
      showNotification({
        title: "Success",
        message: "Return deleted successfully",
        color: "green",
      });
      refetch();
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: "Failed to delete return",
        color: "red",
      });
      console.error("Delete error:", error);
    },
  });

  const confirmDelete = useMemo(
    () => (returnRecord: ProductReturn) => {
      modals.openConfirmModal({
        title: "Delete Return",
        children: (
          <div>
            Are you sure you want to delete return{" "}
            <strong>{returnRecord.returnUID}</strong>? This action cannot be
            undone.
          </div>
        ),
        labels: { confirm: "Delete", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onConfirm: () => {
          removeReturn({
            variables: {
              productReturnId: returnRecord._id,
            },
          });
        },
      });
    },
    [removeReturn]
  );

  const columns = useMemo<ColumnDef<ProductReturn>[]>(
    () => [
      {
        accessor: (row: ProductReturn) => row.returnUID || "",
        title: "Return ID",
        sortKey: "returnUID",
        sortable: true,
        Filter: (setValue) => (
          <Input
            placeholder="Search by Return ID"
            value={datatableFilters.returnUID}
            onChange={(e) => setValue("returnUID", e.currentTarget.value)}
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row: ProductReturn) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (row.invoice?._id) {
                navigate(
                  `/${tenant}/inventory-management/invoices/${row.invoice._id}`
                );
              }
            }}
            className="text-blue-600 hover:underline"
          >
            {row.invoice?.invoiceUID || ""}
          </button>
        ),
        title: "Original Invoice",
      },
      {
        accessor: (row: ProductReturn) => row.client?.name || "",
        title: "Client",
        sortKey: "client",
        sortable: true,
      },
      {
        accessor: (row: ProductReturn) =>
          row.returnDate ? formatTableColumnDate(row.returnDate as any) : "",
        title: "Return Date",
        sortKey: "returnDate",
        sortable: true,
      },
      {
        accessor: (row: ProductReturn) => (
          <Badge color={getStatusColor(String(row.status))} variant="light">
            {String(row.status).replace("_", " ")}
          </Badge>
        ),
        title: "Status",
        sortKey: "status",
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by status"
            data={RETURN_STATUS_OPTIONS}
            value={datatableFilters.status}
            onChange={(value) => setValue("status", value || "")}
            clearable
            style={{ minWidth: 150 }}
          />
        ),
      },
      {
        accessor: (row: ProductReturn) => String(row.reason).replace("_", " "),
        title: "Reason",
        Filter: (setValue) => (
          <Select
            placeholder="Filter by reason"
            data={RETURN_REASON_OPTIONS}
            value={datatableFilters.reason}
            onChange={(value) => setValue("reason", value || "")}
            clearable
            style={{ minWidth: 150 }}
          />
        ),
      },
      {
        accessor: (row: ProductReturn) =>
          String(row.returnType).replace("_", " "),
        title: "Type",
        Filter: (setValue) => (
          <Select
            placeholder="Filter by type"
            data={RETURN_TYPE_OPTIONS}
            value={datatableFilters.returnType}
            onChange={(value) => setValue("returnType", value || "")}
            clearable
            style={{ minWidth: 150 }}
          />
        ),
      },
      {
        accessor: (row: ProductReturn) =>
          currencyNumberWithSymbolFormat(Number(row.totalReturnAmount) || 0),
        title: "Return Amount",
        sortKey: "totalReturnAmount",
        sortable: true,
      },
      {
        accessor: (row: ProductReturn) =>
          currencyNumberWithSymbolFormat(Number(row.netRefundAmount) || 0),
        title: "Net Refund",
        sortKey: "netRefundAmount",
        sortable: true,
      },
      {
        accessor: (row: ProductReturn) =>
          `${row.returnItems?.length ?? 0} item${
            (row.returnItems?.length ?? 0) !== 1 ? "s" : ""
          }`,
        title: "Items",
      },
    ],
    [tenant, datatableFilters]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <PageTitle title="Product Returns" />
        <Button
          component={Link}
          to={`/${tenant}/inventory-management/returns/create`}
        >
          <IconPlus size={16} style={{ marginRight: 8 }} />
          Create Return
        </Button>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.inventory__productReturns?.nodes || []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.inventory__productReturns?.meta?.totalCount || 0,
          currentPage: pagination.page,
        }}
        loading={loading}
        onRowClick={(row: ProductReturn) => {
          navigate(`/${tenant}/inventory-management/returns/${row?._id}`);
        }}
        onFilterChange={(column: string, value: string) => {
          const newFilters = { ...datatableFilters, [column]: value };
          setDatatableFilters(newFilters);
          // Update URL search params
          const params = new URLSearchParams();
          Object.entries(newFilters).forEach(([key, val]) => {
            if (val) params.set(key, String(val));
          });
          setSearchParams(params);
          // Reset to first page on filter change
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        onSortChange={(column, direction) => {
          setSorting({ column, direction });
        }}
        onPaginationChange={(page, pageSize) => {
          setPagination({ page, pageSize });
        }}
        ActionColumn={(row: ProductReturn) => (
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="light"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${tenant}/inventory-management/returns/${row._id}`);
              }}
            >
              <IconEye size={14} />
            </Button>
            {String(row.status) === "PENDING" && (
              <Button
                size="xs"
                variant="light"
                color="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/${tenant}/inventory-management/returns/${row._id}/edit`
                  );
                }}
              >
                <IconEdit size={14} />
              </Button>
            )}
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete(row);
              }}
            >
              <IconTrash size={14} />
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default ReturnsPage;
