import { Button, Card, SimpleGrid, Text } from "@mantine/core";
import { IconArrowUpRight, IconChartLine, IconPackage, IconWallet } from "@tabler/icons-react";

type Props = {
  onSalesAnalytics: () => void;
  onExpenseReport: () => void;
  onCurrentStock: () => void;
  onFinancialReports: () => void;
};

const QuickAccessReports = ({
  onSalesAnalytics,
  onExpenseReport,
  onCurrentStock,
  onFinancialReports,
}: Props) => {
  return (
    <Card withBorder p="lg" mt="xl">
      <Text size="lg" fw={700} mb="md">
        Quick Access to Reports
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <Button
          variant="light"
          size="md"
          leftSection={<IconChartLine size={24} />}
          onClick={onSalesAnalytics}
          fullWidth
          className="h-14 text-base"
        >
          Sales Analytics
        </Button>
        <Button
          variant="light"
          size="md"
          leftSection={<IconWallet size={24} />}
          onClick={onExpenseReport}
          fullWidth
          className="h-14 text-base"
        >
          Expense Report
        </Button>
        <Button
          variant="light"
          size="md"
          leftSection={<IconPackage size={24} />}
          onClick={onCurrentStock}
          fullWidth
          className="h-14 text-base"
        >
          Current Stock
        </Button>
        <Button
          variant="light"
          size="md"
          leftSection={<IconArrowUpRight size={24} />}
          onClick={onFinancialReports}
          fullWidth
          className="h-14 text-base"
        >
          Financial Reports
        </Button>
      </SimpleGrid>
    </Card>
  );
};

export default QuickAccessReports;
