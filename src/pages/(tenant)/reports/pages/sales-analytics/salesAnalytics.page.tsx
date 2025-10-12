import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import {
  ProductCategorysWithPagination,
  ProductSalesResponse,
  ProductSortBy,
  SalesSummaryResponse,
  SortType,
  TimeGrouping,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { useQuery } from "@apollo/client";
import {
  Badge,
  Button,
  Card,
  Group,
  Select,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconChartBar,
  IconChartLine,
  IconCoins,
  IconReceipt,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PRODUCT_CATEGORIES_QUERY,
  SALES_BY_PRODUCT_REPORT_QUERY,
  SALES_SUMMARY_REPORT_QUERY,
} from "./utils/query.sales-analytics";

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: ProductSortBy;
  direction: "asc" | "desc";
}

interface FilterState {
  category?: string;
  startDate?: string;
  endDate?: string;
}

const SalesAnalyticsPage = () => {
  const [refetching, setRefetching] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 50,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: ProductSortBy.Revenue,
    direction: "desc",
  });
  const [filters, setFilters] = useState<FilterState>({
    startDate: (() => {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 1);
      return d.toISOString().split("T")[0];
    })(),
    endDate: new Date().toISOString().split("T")[0],
  });
  const [timeGrouping, setTimeGrouping] = useState<TimeGrouping>(
    TimeGrouping.Daily
  );

  // Build query variables for product sales
  const buildProductSalesVariables = () => {
    return {
      input: {
        page: pagination.page,
        limit: pagination.pageSize,
        sortBy: sorting.column,
        sort: sorting.direction === "asc" ? SortType.Asc : SortType.Desc,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      },
    };
  };

  // Build query variables for sales summary
  const buildSalesSummaryVariables = () => {
    return {
      input: {
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        groupBy: timeGrouping,
      },
    };
  };

  // Fetch sales summary data
  const { data: summaryData } = useQuery<{
    inventory__salesSummaryReport: SalesSummaryResponse;
  }>(SALES_SUMMARY_REPORT_QUERY, {
    variables: buildSalesSummaryVariables(),
    fetchPolicy: "cache-and-network",
    skip: !filters.startDate || !filters.endDate,
  });

  // Fetch product sales data
  const { data, loading, refetch } = useQuery<{
    inventory__salesByProductReport: ProductSalesResponse;
  }>(SALES_BY_PRODUCT_REPORT_QUERY, {
    variables: buildProductSalesVariables(),
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

  // Format time series data for charts (safe against invalid dates)
  const chartData = useMemo(() => {
    if (!summaryData?.inventory__salesSummaryReport.timeSeries) return [];
    return summaryData.inventory__salesSummaryReport.timeSeries.map((point) => {
      const d = new Date(point.date as unknown as string);
      const label = isNaN(d.getTime())
        ? String(point.date ?? "")
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return {
        date: label,
        revenue: point.revenue,
        profit: point.profit,
        transactions: point.transactions,
      };
    });
  }, [summaryData]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessor: "productName",
        title: "Product Name",
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
        accessor: (row) => row.unitsSold.toLocaleString(),
        title: "Units Sold",
        sortKey: "unitsSold",
        sortable: true,
      },
      {
        accessor: (row) => currencyNumberWithSymbolFormat(row.revenue),
        title: "Revenue",
        sortKey: "revenue",
        sortable: true,
      },
      {
        accessor: (row) => currencyNumberWithSymbolFormat(row.profit),
        title: "Profit",
        sortKey: "profit",
        sortable: true,
      },
      {
        accessor: (row) => {
          const percentage = (row.profitMargin * 100).toFixed(2);
          const color =
            row.profitMargin >= 0.3
              ? "green"
              : row.profitMargin >= 0.15
              ? "yellow"
              : "red";

          return (
            <Badge color={color} variant="light">
              {percentage}%
            </Badge>
          );
        },
        title: "Profit Margin",
        sortable: false,
      },
    ],
    [categoryOptions, categoriesLoading, filters.category]
  );

  const handleRefetch = () => {
    setRefetching(true);
    refetch(buildProductSalesVariables()).finally(() => {
      setRefetching(false);
    });
  };

  return (
    <>
      <PageTitle title="Sales Analytics" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" fw={600}>
            Sales Analytics Dashboard
          </Text>
          <Text size="sm" c="dimmed">
            Comprehensive sales analysis with metrics, trends, and product
            performance
          </Text>
        </div>
        <Button onClick={handleRefetch} disabled={refetching} variant="light">
          {refetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card withBorder mb="md" p="md">
        <Group>
          <DatePickerInput
            label="Start Date"
            placeholder="Select start date"
            value={filters.startDate ? new Date(filters.startDate) : null}
            onChange={(value) => {
              const next = (value && typeof value !== "string"
                ? (value as Date).toISOString().slice(0, 10)
                : (value as string)) || "";
              setFilters((prev) => ({ ...prev, startDate: next }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            clearable
            style={{ flex: 1 }}
          />
          <DatePickerInput
            label="End Date"
            placeholder="Select end date"
            value={filters.endDate ? new Date(filters.endDate) : null}
            onChange={(value) => {
              const next = (value && typeof value !== "string"
                ? (value as Date).toISOString().slice(0, 10)
                : (value as string)) || "";
              setFilters((prev) => ({ ...prev, endDate: next }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            clearable
            style={{ flex: 1 }}
          />
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500} mb={4}>
              Time Grouping
            </Text>
            <SegmentedControl
              value={timeGrouping}
              onChange={(value) => setTimeGrouping(value as TimeGrouping)}
              data={[
                { label: "Daily", value: TimeGrouping.Daily },
                { label: "Weekly", value: TimeGrouping.Weekly },
                { label: "Monthly", value: TimeGrouping.Monthly },
                { label: "Yearly", value: TimeGrouping.Yearly },
              ]}
              fullWidth
            />
          </div>
        </Group>
      </Card>

      {/* Summary Cards from Sales Summary Report */}
      {summaryData?.inventory__salesSummaryReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Total Revenue
              </Text>
              <IconCoins size={20} className="text-blue-500" />
            </Group>
            <Text size="xl" fw={700}>
              {currencyNumberWithSymbolFormat(
                summaryData.inventory__salesSummaryReport.totalRevenue
              )}
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Total Profit
              </Text>
              <IconTrendingUp size={20} className="text-green-500" />
            </Group>
            <Text size="xl" fw={700}>
              {currencyNumberWithSymbolFormat(
                summaryData.inventory__salesSummaryReport.totalProfit
              )}
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Avg Sale Value
              </Text>
              <IconChartBar size={20} className="text-purple-500" />
            </Group>
            <Text size="xl" fw={700}>
              {currencyNumberWithSymbolFormat(
                summaryData.inventory__salesSummaryReport.averageSaleValue
              )}
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Transactions
              </Text>
              <IconReceipt size={20} className="text-orange-500" />
            </Group>
            <Text size="xl" fw={700}>
              {summaryData.inventory__salesSummaryReport.totalTransactions.toLocaleString()}
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Total Discounts
              </Text>
              <IconChartLine size={20} className="text-red-500" />
            </Group>
            <Text size="xl" fw={700}>
              {currencyNumberWithSymbolFormat(
                summaryData.inventory__salesSummaryReport.totalDiscounts
              )}
            </Text>
          </Card>
        </div>
      )}

      {/* Time Series Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Revenue & Profit Trend */}
          <Card withBorder p="md">
            <Text size="lg" fw={600} mb="md">
              Revenue & Profit Trend
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: 12 }} />
                <YAxis style={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) =>
                    currencyNumberWithSymbolFormat(value)
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Transactions Trend */}
          <Card withBorder p="md">
            <Text size="lg" fw={600} mb="md">
              Transaction Volume
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: 12 }} />
                <YAxis style={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="transactions"
                  fill="#f59e0b"
                  name="Transactions"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Revenue vs Profit Area Chart */}
      {chartData.length > 0 && (
        <Card withBorder p="md" mb="md">
          <Text size="lg" fw={600} mb="md">
            Revenue vs Profit Analysis
          </Text>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" style={{ fontSize: 12 }} />
              <YAxis style={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) =>
                  currencyNumberWithSymbolFormat(value)
                }
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Category Totals */}
      {data?.inventory__salesByProductReport.categoryTotals &&
        data.inventory__salesByProductReport.categoryTotals.length > 0 && (
          <Card withBorder mb="md" p="md">
            <Text size="lg" fw={600} mb="md">
              Sales by Category
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.inventory__salesByProductReport.categoryTotals.map(
                (cat) => (
                  <Card key={cat.category} withBorder p="sm" bg="gray.0">
                    <Group justify="space-between" mb="xs">
                      <Text fw={600}>{cat.category}</Text>
                      <Badge variant="light">{cat.productCount} products</Badge>
                    </Group>
                    <div className="space-y-1">
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Revenue:
                        </Text>
                        <Text size="sm" fw={500}>
                          {currencyNumberWithSymbolFormat(cat.totalRevenue)}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          Units:
                        </Text>
                        <Text size="sm" fw={500}>
                          {cat.totalUnits.toLocaleString()}
                        </Text>
                      </Group>
                    </div>
                  </Card>
                )
              )}
            </div>
          </Card>
        )}

      {/* Product Sales Table */}
      <Card withBorder p="md">
        <Text size="lg" fw={600} mb="md">
          Product-Level Sales Performance
        </Text>
        <AppDatatable
          columns={columns}
          data={data?.inventory__salesByProductReport.nodes ?? []}
          paginationConfig={{
            pageSize: pagination.pageSize,
            totalItems:
              data?.inventory__salesByProductReport.meta?.totalCount ?? 0,
            currentPage: pagination.page,
          }}
          onSortChange={(column, direction) => {
            if (column && direction) {
              setSorting({ column: column as ProductSortBy, direction });
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
          emptyMessage="No sales data found. Try adjusting your filters or date range."
        />
      </Card>
    </>
  );
};

export default SalesAnalyticsPage;
