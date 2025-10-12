import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { Badge, Button, Card, Group, Table, Text } from "@mantine/core";
import { IconFileInvoice } from "@tabler/icons-react";
import { ProductInvoicesWithPagination } from "@/commons/graphql-models/graphql";

type Props = {
  loading: boolean;
  sales?: ProductInvoicesWithPagination | null;
  onViewAll: () => void;
};

const RecentSales = ({ loading, sales, onViewAll }: Props) => {
  const nodes = sales?.nodes || [];

  return (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600} className="flex items-center gap-2">
          <IconFileInvoice size={20} className="text-green-500" />
          Recent Sales
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
            {nodes.map((invoice) => (
              <Table.Tr key={invoice._id}>
                <Table.Td>
                  <Text size="xs" fw={500}>
                    {invoice.invoiceUID || "N/A"}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {invoice.client?.name || "Walk-in"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" fw={600} ta="right">
                    {currencyNumberWithSymbolFormat(invoice.netTotal || 0)}
                  </Text>
                  <Badge
                    size="xs"
                    color={
                      invoice.paymentStatus === "PAID"
                        ? "green"
                        : invoice.paymentStatus === "PARTIALLY_PAID"
                        ? "yellow"
                        : "red"
                    }
                    variant="light"
                  >
                    {invoice.paymentStatus}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text size="sm" c="dimmed" ta="center" py="md">
          No recent sales
        </Text>
      )}
    </Card>
  );
};

export default RecentSales;

