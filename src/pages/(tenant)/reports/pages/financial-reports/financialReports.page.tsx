import PageTitle from "@/commons/components/PageTitle";
import {
  CashFlowResponse,
  ProfitLossResponse,
  TimeGrouping,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { useQuery } from "@apollo/client";
import {
  Badge,
  Button,
  Card,
  Group,
  Progress,
  SegmentedControl,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCash,
  IconChartLine,
  IconCoin,
  IconMoneybag,
  IconPercentage,
  IconReceipt,
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
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
} from "recharts";
import {
  CASH_FLOW_REPORT_QUERY,
  PROFIT_LOSS_REPORT_QUERY,
} from "./utils/query.financial-reports";

interface FilterState {
  startDate?: string;
  endDate?: string;
}

const FinancialReportsPage = () => {
  const [refetching, setRefetching] = useState(false);
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

  // Build query variables
  const buildQueryVariables = () => {
    return {
      input: {
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        groupBy: timeGrouping,
      },
    };
  };

  // Fetch cash flow report
  const { data: cashFlowData } = useQuery<{
    accounting__cashFlowReport: CashFlowResponse;
  }>(CASH_FLOW_REPORT_QUERY, {
    variables: buildQueryVariables(),
    fetchPolicy: "cache-and-network",
    skip: !filters.startDate || !filters.endDate,
  });

  // Fetch P&L report
  const { data: plData } = useQuery<{
    accounting__profitAndLossSummaryReport: ProfitLossResponse;
  }>(PROFIT_LOSS_REPORT_QUERY, {
    variables: buildQueryVariables(),
    fetchPolicy: "cache-and-network",
    skip: !filters.startDate || !filters.endDate,
  });

  // Format cash flow time series
  const cashFlowChartData = useMemo(() => {
    if (!cashFlowData?.accounting__cashFlowReport.timeSeries) return [];
    return cashFlowData.accounting__cashFlowReport.timeSeries.map((point) => ({
      date: new Date(point.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      inflows: point.inflows,
      outflows: point.outflows,
      netFlow: point.netFlow,
      balance: point.balance,
    }));
  }, [cashFlowData]);

  // Format P&L time series
  const plChartData = useMemo(() => {
    if (!plData?.accounting__profitAndLossSummaryReport.timeSeries) return [];
    return plData.accounting__profitAndLossSummaryReport.timeSeries.map(
      (point) => ({
        date: new Date(point.period).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: point.revenue,
        cogs: point.cogs,
        expenses: point.expenses,
        grossProfit: point.grossProfit,
        netProfit: point.netProfit,
      })
    );
  }, [plData]);

  // Colors for charts
  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  const handleRefetch = () => {
    setRefetching(true);
    Promise.all([]).finally(() => {
      setRefetching(false);
    });
  };

  const cashFlowSummary = cashFlowData?.accounting__cashFlowReport.summary;
  const plSummary = plData?.accounting__profitAndLossSummaryReport.summary;

  return (
    <>
      <PageTitle title="Financial Reports" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" fw={600}>
            Financial Reports
          </Text>
          <Text size="sm" c="dimmed">
            Comprehensive cash flow and profit & loss analysis with trend
            visualizations
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

      {/* Combined KPI Cards */}
      {(cashFlowSummary || plSummary) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cashFlowSummary && (
            <>
              <Card withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">
                    Net Cash Flow
                  </Text>
                  {cashFlowSummary.netCashFlow >= 0 ? (
                    <IconArrowUpRight size={20} className="text-green-500" />
                  ) : (
                    <IconArrowDownRight size={20} className="text-red-500" />
                  )}
                </Group>
                <Text
                  size="xl"
                  fw={700}
                  c={cashFlowSummary.netCashFlow >= 0 ? "green" : "red"}
                >
                  {currencyNumberWithSymbolFormat(cashFlowSummary.netCashFlow)}
                </Text>
                <Text size="xs" c="dimmed">
                  Closing: {currencyNumberWithSymbolFormat(cashFlowSummary.closingBalance)}
                </Text>
              </Card>

              <Card withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">
                    Cash Inflows
                  </Text>
                  <IconCash size={20} className="text-green-500" />
                </Group>
                <Text size="xl" fw={700}>
                  {currencyNumberWithSymbolFormat(
                    cashFlowSummary.totalInflows
                  )}
                </Text>
                <Text size="xs" c="dimmed">
                  Total Received
                </Text>
              </Card>
            </>
          )}

          {plSummary && (
            <>
              <Card withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">
                    Net Profit
                  </Text>
                  {plSummary.netProfit >= 0 ? (
                    <IconTrendingUp size={20} className="text-green-500" />
                  ) : (
                    <IconTrendingDown size={20} className="text-red-500" />
                  )}
                </Group>
                <Text
                  size="xl"
                  fw={700}
                  c={plSummary.netProfit >= 0 ? "green" : "red"}
                >
                  {currencyNumberWithSymbolFormat(plSummary.netProfit)}
                </Text>
                <Text size="xs" c="dimmed">
                  Margin: {plSummary.netProfitMargin.toFixed(2)}%
                </Text>
              </Card>

              <Card withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">
                    Total Revenue
                  </Text>
                  <IconReceipt size={20} className="text-blue-500" />
                </Group>
                <Text size="xl" fw={700}>
                  {currencyNumberWithSymbolFormat(plSummary.totalRevenue)}
                </Text>
                <Text size="xs" c="dimmed">
                  Gross Margin: {plSummary.grossProfitMargin.toFixed(2)}%
                </Text>
              </Card>
            </>
          )}
        </div>
      )}

      {/* CASH FLOW ANALYSIS SECTION */}
      <Card withBorder mb="md" p="md" className="scroll-mt-6">
        <Text size="xl" fw={700} mb="md" className="flex items-center gap-2">
          <IconWallet size={28} className="text-blue-500" />
          Cash Flow Analysis
        </Text>

        {/* Cash Flow Summary Cards */}
        {cashFlowSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Text size="sm" c="dimmed" mb="xs">
                Opening Balance
              </Text>
              <Text size="xl" fw={700}>
                {currencyNumberWithSymbolFormat(
                  cashFlowSummary.openingBalance
                )}
              </Text>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Total Inflows
                  </Text>
                  <Text size="xl" fw={700} c="green">
                    {currencyNumberWithSymbolFormat(
                      cashFlowSummary.totalInflows
                    )}
                  </Text>
                </div>
                <IconArrowUpRight size={32} className="text-green-600" />
              </Group>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <Group justify="space-between">
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Total Outflows
                  </Text>
                  <Text size="xl" fw={700} c="red">
                    {currencyNumberWithSymbolFormat(
                      cashFlowSummary.totalOutflows
                    )}
                  </Text>
                </div>
                <IconArrowDownRight size={32} className="text-red-600" />
              </Group>
            </div>
          </div>
        )}

        {/* Cash Flow Charts */}
        {cashFlowChartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Cash Flow Trend */}
            <div>
              <Text size="lg" fw={600} mb="md">
                Cash Flow Trend
              </Text>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cashFlowChartData}>
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
                    dataKey="inflows"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Inflows"
                  />
                  <Area
                    type="monotone"
                    dataKey="outflows"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                    name="Outflows"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Running Balance */}
            <div>
              <Text size="lg" fw={600} mb="md">
                Running Cash Balance
              </Text>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowChartData}>
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
                    dataKey="balance"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Balance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Cash Flow Categories */}
        {cashFlowData?.accounting__cashFlowReport.categories &&
          cashFlowData.accounting__cashFlowReport.categories.length > 0 && (
            <div>
              <Text size="lg" fw={600} mb="md">
                Cash Flow by Category
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cashFlowData.accounting__cashFlowReport.categories.map(
                  (cat) => (
                    <Card key={cat.category} withBorder p="sm" bg="gray.0">
                      <Group justify="space-between" mb="xs">
                        <Badge
                          color={cat.type === "INFLOW" ? "green" : "red"}
                          variant="light"
                        >
                          {cat.category}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {cat.transactionCount} txns
                        </Text>
                      </Group>
                      <Text size="lg" fw={700}>
                        {currencyNumberWithSymbolFormat(cat.amount)}
                      </Text>
                      <Progress
                        value={cat.percentage}
                        color={cat.type === "INFLOW" ? "green" : "red"}
                        size="sm"
                        mt="xs"
                      />
                      <Text size="xs" c="dimmed" mt={4}>
                        {cat.percentage.toFixed(1)}% of total
                      </Text>
                    </Card>
                  )
                )}
              </div>
            </div>
          )}
      </Card>

      {/* PROFIT & LOSS SECTION */}
      <Card withBorder mb="md" p="md" className="scroll-mt-6">
        <Text size="xl" fw={700} mb="md" className="flex items-center gap-2">
          <IconChartLine size={28} className="text-green-500" />
          Profit & Loss Statement
        </Text>

        {/* P&L Summary Cards */}
        {plSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card withBorder p="md" bg="blue.0">
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  Revenue
                </Text>
                <IconMoneybag size={20} className="text-blue-600" />
              </Group>
              <Text size="xl" fw={700}>
                {currencyNumberWithSymbolFormat(plSummary.totalRevenue)}
              </Text>
            </Card>

            <Card withBorder p="md" bg="orange.0">
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  COGS
                </Text>
                <IconCoin size={20} className="text-orange-600" />
              </Group>
              <Text size="xl" fw={700}>
                {currencyNumberWithSymbolFormat(plSummary.costOfGoodsSold)}
              </Text>
            </Card>

            <Card withBorder p="md" bg="teal.0">
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  Gross Profit
                </Text>
                <IconPercentage size={20} className="text-teal-600" />
              </Group>
              <Text size="xl" fw={700}>
                {currencyNumberWithSymbolFormat(plSummary.grossProfit)}
              </Text>
              <Text size="xs" c="dimmed">
                {plSummary.grossProfitMargin.toFixed(2)}% margin
              </Text>
            </Card>

            <Card withBorder p="md" bg="red.0">
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  Expenses
                </Text>
                <IconWallet size={20} className="text-red-600" />
              </Group>
              <Text size="xl" fw={700}>
                {currencyNumberWithSymbolFormat(plSummary.totalExpenses)}
              </Text>
            </Card>

            <Card
              withBorder
              p="md"
              bg={plSummary.netProfit >= 0 ? "green.0" : "red.0"}
            >
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  Net Profit
                </Text>
                {plSummary.netProfit >= 0 ? (
                  <IconTrendingUp size={20} className="text-green-600" />
                ) : (
                  <IconTrendingDown size={20} className="text-red-600" />
                )}
              </Group>
              <Text size="xl" fw={700}>
                {currencyNumberWithSymbolFormat(plSummary.netProfit)}
              </Text>
              <Text size="xs" c="dimmed">
                {plSummary.netProfitMargin.toFixed(2)}% margin
              </Text>
            </Card>
          </div>
        )}

        {/* P&L Charts */}
        {plChartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Revenue & Expenses */}
            <div>
              <Text size="lg" fw={600} mb="md">
                Revenue & Expenses Trend
              </Text>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={plChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: 12 }} />
                  <YAxis style={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) =>
                      currencyNumberWithSymbolFormat(value)
                    }
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="cogs" fill="#f59e0b" name="COGS" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Profit Trend */}
            <div>
              <Text size="lg" fw={600} mb="md">
                Profit Trend
              </Text>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={plChartData}>
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
                    dataKey="grossProfit"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Gross Profit"
                  />
                  <Line
                    type="monotone"
                    dataKey="netProfit"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Net Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Expense Breakdown */}
        {plData?.accounting__profitAndLossSummaryReport.expenseBreakdown &&
          plData.accounting__profitAndLossSummaryReport.expenseBreakdown
            .length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Text size="lg" fw={600} mb="md">
                  Expense Breakdown
                </Text>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={plData.accounting__profitAndLossSummaryReport.expenseBreakdown.map(
                        (cat) => ({
                          name: cat.category,
                          value: cat.amount,
                        })
                      )}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) =>
                        `${entry.name}: ${(entry.value || 0).toFixed(0)}`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {plData.accounting__profitAndLossSummaryReport.expenseBreakdown.map(
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

              <div>
                <Text size="lg" fw={600} mb="md">
                  Expense Categories
                </Text>
                <div className="space-y-3">
                  {plData.accounting__profitAndLossSummaryReport.expenseBreakdown.map(
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
                          size="md"
                        />
                        <Text size="xs" c="dimmed" mt={4}>
                          {cat.percentage.toFixed(1)}% of total expenses
                        </Text>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
      </Card>

      {/* Footnotes & Glossary */}
      <Card withBorder p="md" bg="gray.0">
        <Text size="lg" fw={700} mb="md">
          📖 Financial Terms & Definitions
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cash Flow Terms */}
          <div>
            <Text size="md" fw={600} mb="sm" c="blue">
              💰 Cash Flow Metrics
            </Text>
            <div className="space-y-3 text-sm">
              <div>
                <Text fw={600}>Opening Balance</Text>
                <Text c="dimmed">
                  The cash available at the beginning of the reporting period.
                  Calculated from all transactions before the start date.
                </Text>
              </div>

              <div>
                <Text fw={600}>Cash Inflows</Text>
                <Text c="dimmed">
                  Total cash received from all sources including sales, invoice
                  payments, and other receipts during the period.
                </Text>
              </div>

              <div>
                <Text fw={600}>Cash Outflows</Text>
                <Text c="dimmed">
                  Total cash paid out for expenses, purchases, refunds,
                  withdrawals, and other payments during the period.
                </Text>
              </div>

              <div>
                <Text fw={600}>Net Cash Flow</Text>
                <Text c="dimmed">
                  The difference between inflows and outflows. Formula:{" "}
                  <code className="bg-white px-1 py-0.5 rounded">
                    Total Inflows - Total Outflows
                  </code>
                  . Positive = more cash in, Negative = more cash out.
                </Text>
              </div>

              <div>
                <Text fw={600}>Closing Balance</Text>
                <Text c="dimmed">
                  Cash available at the end of the period. Formula:{" "}
                  <code className="bg-white px-1 py-0.5 rounded">
                    Opening Balance + Net Cash Flow
                  </code>
                </Text>
              </div>

              <div>
                <Text fw={600}>Running Balance</Text>
                <Text c="dimmed">
                  The cumulative cash balance at each point in time,
                  incorporating all previous periods. Helps track liquidity
                  trends.
                </Text>
              </div>
            </div>
          </div>

          {/* Profit & Loss Terms */}
          <div>
            <Text size="md" fw={600} mb="sm" c="green">
              📈 Profit & Loss Metrics
            </Text>
            <div className="space-y-3 text-sm">
              <div>
                <Text fw={600}>Revenue (Sales)</Text>
                <Text c="dimmed">
                  Total income generated from selling products or services
                  before any costs or expenses are deducted.
                </Text>
              </div>

              <div>
                <Text fw={600}>COGS (Cost of Goods Sold)</Text>
                <Text c="dimmed">
                  The direct cost of purchasing the products that were sold.
                  Includes the wholesale/purchase price of inventory items.
                </Text>
              </div>

              <div>
                <Text fw={600}>Gross Profit</Text>
                <Text c="dimmed">
                  Profit before operating expenses. Formula:{" "}
                  <code className="bg-white px-1 py-0.5 rounded">
                    Revenue - COGS
                  </code>
                  . Shows how much money is made on products after their cost.
                </Text>
              </div>

              <div>
                <Text fw={600}>Gross Profit Margin</Text>
                <Text c="dimmed">
                  Profitability as a percentage. Formula:{" "}
                  <code className="bg-white px-1 py-0.5 rounded">
                    (Gross Profit ÷ Revenue) × 100
                  </code>
                  . Higher % = better pricing or lower costs.
                </Text>
              </div>

              <div>
                <Text fw={600}>Operating Expenses</Text>
                <Text c="dimmed">
                  Costs to run the business including rent, salaries, utilities,
                  marketing, and other overhead. Does not include COGS.
                </Text>
              </div>

              <div>
                <Text fw={600}>Net Profit</Text>
                <Text c="dimmed">
                  Final profit after all costs. Formula:{" "}
                  <code className="bg-white px-1 py-0.5 rounded">
                    Gross Profit - Operating Expenses
                  </code>
                  . The actual money earned by the business.
                </Text>
              </div>

              <div>
                <Text fw={600}>Net Profit Margin</Text>
                <Text c="dimmed">
                  Overall profitability. Formula:{" "}
                  <code className="bg-white px-1 py-0.5 rounded">
                    (Net Profit ÷ Revenue) × 100
                  </code>
                  . Shows efficiency: how much profit per dollar of revenue.
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Text size="md" fw={600} mb="sm" c="blue">
            💡 Key Insights
          </Text>
          <div className="space-y-2 text-sm">
            <Text>
              <strong>Cash Flow vs. Profit:</strong> A business can be
              profitable (positive Net Profit) but have negative cash flow if
              customers haven't paid invoices yet. Conversely, positive cash
              flow with negative profit might indicate inventory liquidation.
            </Text>
            <Text>
              <strong>Healthy Margins:</strong> Retail typically targets 30-50%
              gross margin, 10-20% net margin. Service businesses often have
              higher margins due to lower COGS.
            </Text>
            <Text>
              <strong>Warning Signs:</strong> Declining gross margin may
              indicate pricing pressure or rising supplier costs. Negative net
              cash flow over multiple periods suggests liquidity problems.
            </Text>
          </div>
        </div>
      </Card>
    </>
  );
};

export default FinancialReportsPage;
