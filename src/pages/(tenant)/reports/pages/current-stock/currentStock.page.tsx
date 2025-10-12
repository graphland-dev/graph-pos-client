import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import {
  BrandsWithPagination,
  CurrentStockResponse,
  ProductCategorysWithPagination,
  SortType,
  StockSortBy,
  StockStatus,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { useQuery } from "@apollo/client";
import {
  Badge,
  Button,
  Card,
  Group,
  Input,
  Select,
  Text,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconBox,
  IconBoxOff,
  IconCash,
  IconPackage,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { PRODUCT_CATEGORIES_QUERY } from "../sales-analytics/utils/query.sales-analytics";
import {
  BRANDS_QUERY,
  CURRENT_STOCK_REPORT_QUERY,
} from "./utils/query.current-stock";

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: StockSortBy;
  direction: "asc" | "desc";
}

interface FilterState {
  category?: string;
  brand?: string;
  searchTerm?: string;
  stockStatus?: StockStatus;
}

const CurrentStockPage = () => {
  const [refetching, setRefetching] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 50,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: StockSortBy.ProductName,
    direction: "asc",
  });
  const [filters, setFilters] = useState<FilterState>({
    stockStatus: StockStatus.All,
  });

  // Build query variables
  const buildQueryVariables = () => {
    return {
      input: {
        page: pagination.page,
        limit: pagination.pageSize,
        sortBy: sorting.column,
        sort: sorting.direction === "asc" ? SortType.Asc : SortType.Desc,
        category: filters.category || undefined,
        brand: filters.brand || undefined,
        searchTerm: filters.searchTerm || undefined,
        stockStatus: filters.stockStatus || StockStatus.All,
      },
    };
  };

  const { data, loading, refetch } = useQuery<{
    inventory__currentStockReport: CurrentStockResponse;
  }>(CURRENT_STOCK_REPORT_QUERY, {
    variables: buildQueryVariables(),
    fetchPolicy: "cache-and-network",
  });

  // Fetch categories for dropdown filter
  const { data: categoriesData, loading: categoriesLoading } = useQuery<{
    inventory__productCategories: ProductCategorysWithPagination;
  }>(PRODUCT_CATEGORIES_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 1000,
      },
    },
  });

  // Fetch brands for dropdown filter
  const { data: brandsData, loading: brandsLoading } = useQuery<{
    setup__brands: BrandsWithPagination;
  }>(BRANDS_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 1000,
      },
    },
  });

  // Process category options for Select component
  const categoryOptions = useMemo(() => {
    if (!categoriesData?.inventory__productCategories?.nodes) return [];
    return categoriesData.inventory__productCategories.nodes.map(
      (category) => ({
        value: category._id,
        label: category.name,
      })
    );
  }, [categoriesData]);

  // Process brand options for Select component
  const brandOptions = useMemo(() => {
    if (!brandsData?.setup__brands?.nodes) return [];
    return brandsData.setup__brands.nodes.map((brand) => ({
      value: brand._id,
      label: brand.name,
    }));
  }, [brandsData]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessor: "productName",
        title: "Product Name",
        sortKey: "productName",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search product..."
            onChange={(e) => setValue("searchTerm", e.target.value)}
          />
        ),
      },
      {
        accessor: "sku",
        title: "SKU",
        sortable: false,
      },
      {
        accessor: "category",
        title: "Category",
        sortable: false,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by category..."
            value={filters.category || null}
            data={categoryOptions}
            disabled={categoriesLoading}
            onChange={(value) => setValue("category", value || "")}
            clearable
            searchable
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: "brand",
        title: "Brand",
        sortable: false,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by brand..."
            value={filters.brand || null}
            data={brandOptions}
            disabled={brandsLoading}
            onChange={(value) => setValue("brand", value || "")}
            clearable
            searchable
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row) => row.currentQuantity.toLocaleString(),
        title: "Current Stock",
        sortKey: "currentQuantity",
        sortable: true,
      },
      {
        accessor: (row) => {
          const status = row.stockStatus;
          const color =
            status === "OUT_OF_STOCK"
              ? "red"
              : status === "LOW_STOCK"
              ? "yellow"
              : "green";

          return (
            <Badge color={color} variant="light">
              {status.replace("_", " ")}
            </Badge>
          );
        },
        title: "Status",
        sortable: false,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by status..."
            value={filters.stockStatus || StockStatus.All}
            data={[
              { value: StockStatus.All, label: "All" },
              { value: StockStatus.InStock, label: "In Stock" },
              { value: StockStatus.LowStock, label: "Low Stock" },
              { value: StockStatus.OutOfStock, label: "Out of Stock" },
            ]}
            onChange={(value) => setValue("stockStatus", value || "")}
            style={{ minWidth: 150 }}
          />
        ),
      },
      {
        accessor: (row) =>
          row.reorderLevel ? row.reorderLevel.toLocaleString() : "N/A",
        title: "Reorder Level",
        sortable: false,
      },
      {
        accessor: (row) => currencyNumberWithSymbolFormat(row.unitPurchasePrice),
        title: "Unit Purchase",
        sortKey: "netPurchasePrice",
        sortable: true,
      },
      {
        accessor: (row) =>
          row.unitSellPrice
            ? currencyNumberWithSymbolFormat(row.unitSellPrice)
            : "N/A",
        title: "Unit Sell",
        sortKey: "netSellPrice",
        sortable: true,
      },
      {
        accessor: (row) => currencyNumberWithSymbolFormat(row.netPurchasePrice),
        title: "Total Purchase",
        sortKey: "netPurchasePrice",
        sortable: true,
      },
      {
        accessor: (row) => currencyNumberWithSymbolFormat(row.netSellPrice),
        title: "Total Sell",
        sortKey: "netSellPrice",
        sortable: true,
      },
      {
        accessor: (row) =>
          currencyNumberWithSymbolFormat(row.netProfitableAmount),
        title: "Potential Profit",
        sortKey: "netProfitableAmount",
        sortable: true,
      },
    ],
    [
      categoryOptions,
      categoriesLoading,
      brandOptions,
      brandsLoading,
      filters.category,
      filters.brand,
      filters.stockStatus,
    ]
  );

  const handleRefetch = () => {
    setRefetching(true);
    refetch(buildQueryVariables()).finally(() => {
      setRefetching(false);
    });
  };

  const summary = data?.inventory__currentStockReport.summary;

  return (
    <>
      <PageTitle title="Current Stock Report" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" fw={600}>
            Current Stock Report
          </Text>
          <Text size="sm" c="dimmed">
            Real-time inventory levels and stock valuation across all products
          </Text>
        </div>
        <Button onClick={handleRefetch} disabled={refetching} variant="light">
          {refetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Total Products
              </Text>
              <IconPackage size={20} className="text-blue-500" />
            </Group>
            <Text size="xl" fw={700}>
              {summary.totalProductsCount.toLocaleString()}
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                In Stock
              </Text>
              <IconBox size={20} className="text-green-500" />
            </Group>
            <Text size="xl" fw={700}>
              {summary.inStockCount.toLocaleString()}
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Low Stock
              </Text>
              <IconAlertTriangle size={20} className="text-yellow-500" />
            </Group>
            <Text size="xl" fw={700}>
              {summary.lowStockCount.toLocaleString()}
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Out of Stock
              </Text>
              <IconBoxOff size={20} className="text-red-500" />
            </Group>
            <Text size="xl" fw={700}>
              {summary.outOfStockCount.toLocaleString()}
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Stock Value
              </Text>
              <IconCash size={20} className="text-purple-500" />
            </Group>
            <Text size="xl" fw={700}>
              {currencyNumberWithSymbolFormat(summary.netStockPurchasePrice)}
            </Text>
            <Text size="xs" c="dimmed">
              Purchase Price
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Potential Value
              </Text>
              <IconTrendingUp size={20} className="text-orange-500" />
            </Group>
            <Text size="xl" fw={700}>
              {currencyNumberWithSymbolFormat(summary.netProfitableAmount)}
            </Text>
            <Text size="xs" c="dimmed">
              Potential Profit
            </Text>
          </Card>
        </div>
      )}

      {/* Stock Level Breakdown */}
      {summary && (
        <Card withBorder mb="md" p="md">
          <Text size="lg" fw={600} mb="md">
            Stock Level Distribution
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <Text size="sm" c="dimmed">
                  In Stock Products
                </Text>
                <Text size="xl" fw={700} c="green">
                  {summary.inStockCount}
                </Text>
                <Text size="xs" c="dimmed">
                  {(
                    (summary.inStockCount / summary.totalProductsCount) *
                    100
                  ).toFixed(1)}
                  % of total
                </Text>
              </div>
              <IconBox size={40} className="text-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <Text size="sm" c="dimmed">
                  Low Stock Products
                </Text>
                <Text size="xl" fw={700} c="yellow">
                  {summary.lowStockCount}
                </Text>
                <Text size="xs" c="dimmed">
                  {(
                    (summary.lowStockCount / summary.totalProductsCount) *
                    100
                  ).toFixed(1)}
                  % of total
                </Text>
              </div>
              <IconAlertTriangle size={40} className="text-yellow-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <Text size="sm" c="dimmed">
                  Out of Stock
                </Text>
                <Text size="xl" fw={700} c="red">
                  {summary.outOfStockCount}
                </Text>
                <Text size="xs" c="dimmed">
                  {(
                    (summary.outOfStockCount / summary.totalProductsCount) *
                    100
                  ).toFixed(1)}
                  % of total
                </Text>
              </div>
              <IconBoxOff size={40} className="text-red-600" />
            </div>
          </div>
        </Card>
      )}

      {/* Stock Data Table */}
      <Card withBorder p="md">
        <Text size="lg" fw={600} mb="md">
          Product Stock Details
        </Text>
        <AppDatatable
          columns={columns}
          data={data?.inventory__currentStockReport.nodes ?? []}
          paginationConfig={{
            pageSize: pagination.pageSize,
            totalItems: data?.inventory__currentStockReport.meta?.totalCount ?? 0,
            currentPage: pagination.page,
          }}
          onSortChange={(column, direction) => {
            if (column && direction) {
              setSorting({ column: column as StockSortBy, direction });
            }
          }}
          onFilterChange={(column, value) => {
            setFilters((prev) => ({ ...prev, [column]: value }));
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          onPaginationChange={(page, pageSize) => {
            setPagination({ page, pageSize });
          }}
          loading={loading || refetching}
          emptyMessage="No stock data found. Try adjusting your filters."
        />
      </Card>
    </>
  );
};

export default CurrentStockPage;
