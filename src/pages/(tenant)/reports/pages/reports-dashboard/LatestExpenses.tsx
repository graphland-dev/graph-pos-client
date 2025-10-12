import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { Button, Card, Group, Table, Text } from "@mantine/core";
import { IconWallet } from "@tabler/icons-react";
import { ExpensesWithPagination } from "@/commons/graphql-models/graphql";

type Props = {
  loading: boolean;
  expenses?: ExpensesWithPagination | null;
  onViewAll: () => void;
};

const LatestExpenses = ({ loading, expenses, onViewAll }: Props) => {
  const nodes = expenses?.nodes || [];

  return (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600} className="flex items-center gap-2">
          <IconWallet size={20} className="text-red-500" />
          Latest Expenses
        </Text>
        <Button variant="subtle" size="xs" onClick={onViewAll}>
          View All
        </Button>
      </Group>

      {loading ? (
        <Text size="sm" c="dimmed" ta="center" py="md">
          Loading...
        </Text>
      ) : nodes.length > 0 ? (
        <Table verticalSpacing="xs">
          <Table.Tbody>
            {nodes.map((expense) => (
              <Table.Tr key={expense._id}>
                <Table.Td>
                  <Text size="xs" fw={500} lineClamp={1}>
                    {expense.purpose}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {expense.category?.name || "Uncategorized"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" fw={600} ta="right">
                    {currencyNumberWithSymbolFormat(expense.amount || 0)}
                  </Text>
                  <Text size="xs" c="dimmed" ta="right">
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text size="sm" c="dimmed" ta="center" py="md">
          No recent expenses
        </Text>
      )}
    </Card>
  );
};

export default LatestExpenses;
