import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { Card, Group, SimpleGrid, Text } from "@mantine/core";
import { IconCash, IconPackage, IconTrendingDown, IconTrendingUp, IconWallet } from "@tabler/icons-react";
import { CurrentStockResponse, ExpenseReportResponse, SalesSummaryResponse } from "@/commons/graphql-models/graphql";

type Props = {
  summaryLoading: boolean;
  salesSummary?: SalesSummaryResponse | null;
  expenseSummary?: ExpenseReportResponse | null;
  stockSummary?: CurrentStockResponse | null;
};

const ExecutiveKpiCards = ({ summaryLoading, salesSummary, expenseSummary, stockSummary }: Props) => {
  const totalRevenue = salesSummary?.totalRevenue || 0;
  const totalExpenses = expenseSummary?.summary?.totalExpenses || 0;
  const totalTransactions = salesSummary?.totalTransactions || 0;
  const stockValue = stockSummary?.summary?.netStockPurchasePrice || 0;
  const lowStockCount = stockSummary?.summary?.lowStockCount || 0;
  const netProfit = (salesSummary?.totalProfit || 0) - totalExpenses;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
      <Card withBorder p="md" className="hover:shadow-lg transition-shadow">
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">
            Total Revenue
          </Text>
          <IconCash size={20} className="text-blue-500" />
        </Group>
        <Text size="xl" fw={700}>
          {summaryLoading ? "..." : currencyNumberWithSymbolFormat(totalRevenue)}
        </Text>
        <Text size="xs" c="dimmed">
          {totalTransactions} transactions
        </Text>
      </Card>

      <Card withBorder p="md" className="hover:shadow-lg transition-shadow">
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">
            Total Expenses
          </Text>
          <IconWallet size={20} className="text-red-500" />
        </Group>
        <Text size="xl" fw={700}>
          {summaryLoading ? "..." : currencyNumberWithSymbolFormat(totalExpenses)}
        </Text>
        <Text size="xs" c="dimmed">
          {expenseSummary?.summary?.transactionCount || 0} entries
        </Text>
      </Card>

      <Card
        withBorder
        p="md"
        className="hover:shadow-lg transition-shadow"
        bg={netProfit >= 0 ? "green.0" : "red.0"}
      >
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">
            Net Profit
          </Text>
          {netProfit >= 0 ? (
            <IconTrendingUp size={20} className="text-green-600" />
          ) : (
            <IconTrendingDown size={20} className="text-red-600" />
          )}
        </Group>
        <Text size="xl" fw={700} c={netProfit >= 0 ? "green" : "red"}>
          {summaryLoading ? "..." : currencyNumberWithSymbolFormat(netProfit)}
        </Text>
        <Text size="xs" c="dimmed">
          Revenue - Expenses
        </Text>
      </Card>

      <Card withBorder p="md" className="hover:shadow-lg transition-shadow">
        <Group justify="space-between" mb="xs">
          <Text size="sm" c="dimmed">
            Stock Value
          </Text>
          <IconPackage size={20} className="text-purple-500" />
        </Group>
        <Text size="xl" fw={700}>
          {summaryLoading ? "..." : currencyNumberWithSymbolFormat(stockValue)}
        </Text>
        <Text size="xs" c="dimmed">
          {lowStockCount} low stock
        </Text>
      </Card>
    </SimpleGrid>
  );
};

export default ExecutiveKpiCards;

