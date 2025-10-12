import PageTitle from "@/commons/components/PageTitle";
import {
  ExpenseCategorysWithPagination,
  ExpenseReportResponse,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { useQuery } from "@apollo/client";
import {
  Badge,
  Button,
  Card,
  Group,
  Progress,
  Select,
  Table,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconCategory,
  IconChartBar,
  IconReceipt,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  EXPENSE_CATEGORIES_QUERY,
  EXPENSE_REPORT_QUERY,
} from "./utils/query.expense-report";

interface FilterState {
  startDate?: string;
  endDate?: string;
  category?: string;
  topExpensesLimit?: number;
}

const ExpenseReport = () => {
  const [refetching, setRefetching] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    startDate: (() => {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 1);
      return d.toISOString().split("T")[0];
    })(),
    endDate: new Date().toISOString().split("T")[0],
    topExpensesLimit: 10,
  });

  // Build query variables
  const buildQueryVariables = () => {
    return {
      input: {
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        category: filters.category || undefined,
        topExpensesLimit: filters.topExpensesLimit || 10,
      },
    };
  };

  // Fetch expense report data
  const { data, loading, refetch } = useQuery<{
    accounting__expenseReport: ExpenseReportResponse;
  }>(EXPENSE_REPORT_QUERY, {
    variables: buildQueryVariables(),
    fetchPolicy: "cache-and-network",
    skip: !filters.startDate || !filters.endDate,
  });

  // Fetch expense categories for filter dropdown
  const { data: categoriesData, loading: categoriesLoading } = useQuery<{
    accounting__expenseCategories: ExpenseCategorysWithPagination;
  }>(EXPENSE_CATEGORIES_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 1000,
      },
    },
  });

  // Process category options for Select component
  const categoryOptions = useMemo(() => {
    if (!categoriesData?.accounting__expenseCategories?.nodes) return [];
    return categoriesData.accounting__expenseCategories.nodes.map(
      (category) => ({
        value: category._id,
        label: category.name,
      })
    );
  }, [categoriesData]);

  // Format time series data for chart
  const timeSeriesChartData = useMemo(() => {
    if (!data?.accounting__expenseReport.timeSeries) return [];
    return data.accounting__expenseReport.timeSeries.map((point) => ({
      date: new Date(point.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount: point.amount,
      transactions: point.transactionCount,
    }));
  }, [data]);

  // Colors for charts
  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  const handleRefetch = () => {
    setRefetching(true);
    refetch(buildQueryVariables()).finally(() => {
      setRefetching(false);
    });
  };

  const summary = data?.accounting__expenseReport.summary;

  return (
    <>
      <PageTitle title="Expense Report" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" fw={600}>
            Expense Report
          </Text>
          <Text size="sm" c="dimmed">
            Detailed analysis of business expenses by category and time period
          </Text>
        </div>
        <Button onClick={handleRefetch} disabled={refetching} variant="light">
          {refetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Date Range and Category Filters */}
      <Card withBorder mb="md" p="md">
        <Group>
          <DatePickerInput
            label="Start Date"
            placeholder="Select start date"
            value={filters.startDate ? new Date(filters.startDate) : null}
            onChange={(value) => {
              const next =
                (value && typeof value !== "string"
                  ? (value as Date).toISOString().slice(0, 10)
                  : (value as string)) || "";
              setFilters((prev) => ({ ...prev, startDate: next }));
            }}
            clearable
            style={{ flex: 1 }}
          />
          <DatePickerInput
            label="End Date"
            placeholder="Select end date"
            value={filters.endDate ? new Date(filters.endDate) : null}
            onChange={(value) => {
              const next =
                (value && typeof value !== "string"
                  ? (value as Date).toISOString().slice(0, 10)
                  : (value as string)) || "";
              setFilters((prev) => ({ ...prev, endDate: next }));
            }}
            clearable
            style={{ flex: 1 }}
          />
          <Select
            label="Filter by Category"
            placeholder="All Categories"
            value={filters.category || null}
            data={categoryOptions}
            disabled={categoriesLoading}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, category: value || undefined }))
            }
            clearable
            searchable
            style={{ flex: 1 }}
          />
          <Select
            label="Top Expenses Limit"
            value={filters.topExpensesLimit?.toString() || "10"}
            data={[
              { value: "5", label: "Top 5" },
              { value: "10", label: "Top 10" },
              { value: "20", label: "Top 20" },
              { value: "50", label: "Top 50" },
            ]}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                topExpensesLimit: parseInt(value || "10"),
              }))
            }
            style={{ flex: 1 }}
          />
        </Group>
      </Card>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Total Expenses
              </Text>
              <IconWallet size={20} className="text-red-500" />
            </Group>
            <Text size="xl" fw={700}>
              {currencyNumberWithSymbolFormat(summary.totalExpenses)}
            </Text>
            <Text size="xs" c="dimmed">
              Total spending in period
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Avg Per Day
              </Text>
              <IconTrendingUp size={20} className="text-blue-500" />
            </Group>
            <Text size="xl" fw={700}>
              {currencyNumberWithSymbolFormat(summary.averageExpensePerDay)}
            </Text>
            <Text size="xs" c="dimmed">
              Daily average
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Transactions
              </Text>
              <IconReceipt size={20} className="text-green-500" />
            </Group>
            <Text size="xl" fw={700}>
              {summary.transactionCount.toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed">
              Total expense entries
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Categories
              </Text>
              <IconCategory size={20} className="text-purple-500" />
            </Group>
            <Text size="xl" fw={700}>
              {summary.categoryCount}
            </Text>
            <Text size="xs" c="dimmed">
              Active categories
            </Text>
          </Card>

          <Card withBorder p="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                Largest Category
              </Text>
              <IconChartBar size={20} className="text-orange-500" />
            </Group>
            <Text size="lg" fw={700} lineClamp={1}>
              {summary.largestExpenseCategory || "N/A"}
            </Text>
            <Text size="xs" c="dimmed">
              Highest spending
            </Text>
          </Card>
        </div>
      )}

      {/* Expense Trend Chart */}
      {timeSeriesChartData.length > 0 && (
        <Card withBorder mb="md" p="md">
          <Text size="lg" fw={600} mb="md" className="flex items-center gap-2">
            <IconCalendar size={24} className="text-blue-500" />
            Expense Trend Over Time
          </Text>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={timeSeriesChartData}>
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
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Expense Amount"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Category Breakdown Section */}
      {data?.accounting__expenseReport.categories &&
        data.accounting__expenseReport.categories.length > 0 && (
          <Card withBorder mb="md" p="md">
            <Text
              size="lg"
              fw={600}
              mb="md"
              className="flex items-center gap-2"
            >
              <IconCategory size={24} className="text-purple-500" />
              Expense Breakdown by Category
            </Text>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div>
                <Text size="md" fw={600} mb="md">
                  Category Distribution
                </Text>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={data.accounting__expenseReport.categories.map(
                        (cat) => ({
                          name: cat.category,
                          value: cat.amount,
                        })
                      )}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) =>
                        `${entry.name}: ${(entry.percentage || 0).toFixed(1)}%`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.accounting__expenseReport.categories.map(
                        (_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        currencyNumberWithSymbolFormat(value)
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category List with Progress Bars */}
              <div>
                <Text size="md" fw={600} mb="md">
                  Category Details
                </Text>
                <div className="space-y-4">
                  {data.accounting__expenseReport.categories.map(
                    (cat, index) => (
                      <div key={cat.category}>
                        <Group justify="space-between" mb={4}>
                          <Badge
                            color={COLORS[index % COLORS.length]}
                            variant="light"
                          >
                            {cat.category}
                          </Badge>
                          <Text size="sm" fw={600}>
                            {currencyNumberWithSymbolFormat(cat.amount)}
                          </Text>
                        </Group>
                        <Progress
                          value={cat.percentage}
                          color={COLORS[index % COLORS.length]}
                          size="lg"
                        />
                        <Group justify="space-between" mt={4}>
                          <Text size="xs" c="dimmed">
                            {cat.percentage.toFixed(1)}% of total
                          </Text>
                          <Text size="xs" c="dimmed">
                            {cat.transactionCount} transactions
                          </Text>
                        </Group>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

      {/* Top Expenses Table */}
      {data?.accounting__expenseReport.topExpenses &&
        data.accounting__expenseReport.topExpenses.length > 0 && (
          <Card withBorder p="md">
            <Text
              size="lg"
              fw={600}
              mb="md"
              className="flex items-center gap-2"
            >
              <IconReceipt size={24} className="text-green-500" />
              Top {filters.topExpensesLimit} Highest Expenses
            </Text>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Purpose</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Voucher No</Table.Th>
                  <Table.Th>Check No</Table.Th>
                  <Table.Th>Note</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.accounting__expenseReport.topExpenses.map((expense) => (
                  <Table.Tr key={expense.expenseId}>
                    <Table.Td>
                      {new Date(expense.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light">{expense.category}</Badge>
                    </Table.Td>
                    <Table.Td>{expense.purpose}</Table.Td>
                    <Table.Td>
                      <Text fw={600}>
                        {currencyNumberWithSymbolFormat(expense.amount)}
                      </Text>
                    </Table.Td>
                    <Table.Td>{expense.voucherNo || "-"}</Table.Td>
                    <Table.Td>{expense.checkNo || "-"}</Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {expense.note || "-"}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        )}

      {/* Loading State */}
      {loading && !data && (
        <Card withBorder p="xl">
          <Text ta="center" c="dimmed">
            Loading expense report data...
          </Text>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !data?.accounting__expenseReport.summary && (
        <Card withBorder p="xl">
          <Text ta="center" c="dimmed">
            No expense data found for the selected period. Try adjusting your
            date range.
          </Text>
        </Card>
      )}
    </>
  );
};

export default ExpenseReport;
