import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { Card, Group, SimpleGrid, Text } from "@mantine/core";
import { IconChartLine, IconReceipt, IconTrendingUp } from "@tabler/icons-react";
import { CurrentStockResponse, SalesSummaryResponse } from "@/commons/graphql-models/graphql";

type Props = {
  summaryLoading: boolean;
  salesSummary?: SalesSummaryResponse | null;
  stockSummary?: CurrentStockResponse | null;
};

const QuickStatsRow = ({ summaryLoading, salesSummary, stockSummary }: Props) => {
  const grossProfit = salesSummary?.totalProfit || 0;
  const avgSaleValue = salesSummary?.averageSaleValue || 0;
  const potentialProfit = stockSummary?.summary?.netProfitableAmount || 0;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mb="xl">
      <Card withBorder p="md">
        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed" mb={4}>
              Gross Profit
            </Text>
            <Text size="lg" fw={600}>
              {summaryLoading ? "..." : currencyNumberWithSymbolFormat(grossProfit)}
            </Text>
          </div>
          <IconChartLine size={32} className="text-green-500" />
        </Group>
      </Card>

      <Card withBorder p="md">
        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed" mb={4}>
              Avg Sale Value
            </Text>
            <Text size="lg" fw={600}>
              {summaryLoading ? "..." : currencyNumberWithSymbolFormat(avgSaleValue)}
            </Text>
          </div>
          <IconReceipt size={32} className="text-blue-500" />
        </Group>
      </Card>

      <Card withBorder p="md">
        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed" mb={4}>
              Potential Profit
            </Text>
            <Text size="lg" fw={600}>
              {summaryLoading ? "..." : currencyNumberWithSymbolFormat(potentialProfit)}
            </Text>
          </div>
          <IconTrendingUp size={32} className="text-orange-500" />
        </Group>
      </Card>
    </SimpleGrid>
  );
};

export default QuickStatsRow;

