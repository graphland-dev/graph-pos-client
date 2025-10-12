import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { Badge, Button, Card, Group, Table, Text } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";
import { ProductPurchasesWithPagination } from "@/commons/graphql-models/graphql";

type Props = {
  loading: boolean;
  purchases?: ProductPurchasesWithPagination | null;
  onViewAll: () => void;
};

const computePaymentStatus = (paidAmount?: number | null, netTotal?: number | null) => {
  const paid = paidAmount || 0;
  const total = netTotal || 0;
  if (total <= 0) return { label: "N/A", color: "gray" as const };
  if (paid >= total) return { label: "PAID", color: "green" as const };
  if (paid > 0) return { label: "PARTIALLY_PAID", color: "yellow" as const };
  return { label: "UNPAID", color: "red" as const };
};

const RecentPurchases = ({ loading, purchases, onViewAll }: Props) => {
  const nodes = purchases?.nodes || [];

  return (
    <Card withBorder p="md">
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600} className="flex items-center gap-2">
          <IconShoppingCart size={20} className="text-orange-500" />
          Recent Purchases
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
            {nodes.map((purchase) => {
              const status = computePaymentStatus(purchase.paidAmount, purchase.netTotal);
              return (
                <Table.Tr key={purchase._id}>
                  <Table.Td>
                    <Text size="xs" fw={500}>
                      {purchase.purchaseUID || "N/A"}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {purchase.supplier?.name || "Unknown"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" fw={600} ta="right">
                      {currencyNumberWithSymbolFormat(purchase.netTotal || 0)}
                    </Text>
                    <Badge size="xs" color={status.color} variant="light">
                      {status.label}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      ) : (
        <Text size="sm" c="dimmed" ta="center" py="md">
          No recent purchases
        </Text>
      )}
    </Card>
  );
};

export default RecentPurchases;

