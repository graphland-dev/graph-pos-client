import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { dateTimeFormatter } from "@/commons/utils/dateFormat";
import { useQuery } from "@apollo/client";
import { Badge, Card, Group, Stack, Table, Text, Title } from "@mantine/core";
import { INVENTORY_PRODUCT_QUOTATION_QUERY } from "../utils/query.quotations";

interface ProductQuotationDetailsProps {
  quotationId: string;
}

const ProductQuotationDetails = ({ quotationId }: ProductQuotationDetailsProps) => {
  const { data, loading } = useQuery(INVENTORY_PRODUCT_QUOTATION_QUERY, {
    variables: {
      where: {
        filters: [
          {
            key: "_id",
            operator: "EQ",
            value: quotationId,
          },
        ],
      },
    },
    skip: !quotationId,
  });

  const quotation = data?.inventory__productQuotation;

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!quotation) {
    return <Text>Quotation not found</Text>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SENT": return "blue";
      case "ACCEPTED": return "green";
      case "REJECTED": return "red";
      case "CONVERTED": return "violet";
      case "EXPIRED": return "orange";
      default: return "gray";
    }
  };

  return (
    <Stack gap="md">
      <Card withBorder p="lg">
        <Group justify="space-between" mb="md">
          <Title order={3}>Quotation #{quotation.quotationUID}</Title>
          <Badge color={getStatusColor(quotation.status || "DRAFT")}>
            {quotation.status || "DRAFT"}
          </Badge>
        </Group>
        
        <Group grow>
          <div>
            <Text size="sm" color="dimmed">Client</Text>
            <Text fw={500}>{quotation.client?.name || "No Client"}</Text>
          </div>
          <div>
            <Text size="sm" color="dimmed">Date</Text>
            <Text fw={500}>{dateTimeFormatter.displayDate(quotation.date)}</Text>
          </div>
          <div>
            <Text size="sm" color="dimmed">Valid Until</Text>
            <Text fw={500}>{quotation.validUntil ? dateTimeFormatter.displayDate(quotation.validUntil) : "N/A"}</Text>
          </div>
        </Group>

        {quotation.note && (
          <div style={{ marginTop: 16 }}>
            <Text size="sm" color="dimmed">Notes</Text>
            <Text>{quotation.note}</Text>
          </div>
        )}
      </Card>

      <Card withBorder p="lg">
        <Title order={4} mb="md">Products</Title>
        <Table striped withTableBorder>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Code</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {quotation.products?.map((product: any, index: number) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.code}</td>
                <td>{product.quantity}</td>
                <td>{currencyNumberWithSymbolFormat(product.unitSellPrice || 0)}</td>
                <td>{currencyNumberWithSymbolFormat(product.netAmount || 0)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card withBorder p="lg">
        <Title order={4} mb="md">Summary</Title>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text>Subtotal:</Text>
            <Text>{currencyNumberWithSymbolFormat(quotation.subTotal || 0)}</Text>
          </Group>
          
          {quotation.netDiscountAmount > 0 && (
            <Group justify="space-between">
              <Text>Discount:</Text>
              <Text>-{currencyNumberWithSymbolFormat(quotation.netDiscountAmount)}</Text>
            </Group>
          )}
          
          {quotation.netTaxAmount > 0 && (
            <Group justify="space-between">
              <Text>Tax:</Text>
              <Text>{currencyNumberWithSymbolFormat(quotation.netTaxAmount)}</Text>
            </Group>
          )}
          
          <Group justify="space-between" style={{ borderTop: "1px solid #e0e0e0", paddingTop: 8 }}>
            <Text fw={700}>Net Total:</Text>
            <Text fw={700}>{currencyNumberWithSymbolFormat(quotation.netTotal || 0)}</Text>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProductQuotationDetails;
