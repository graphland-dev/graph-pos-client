import { INVENTORY_PRODUCT_QUOTATION_QUERY } from "@/pages/(tenant)/inventory-management/pages/quotations/utils/query.quotations";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import dateFormat from "@/commons/utils/dateFormat";
import { useQuery } from "@apollo/client";
import { Button, Card, Group, Stack, Table, Text, Title } from "@mantine/core";
import { PrinterIcon } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

interface PrintableFullQuotationProps {
  quotationId: string;
  tenant: string;
}

const PrintableFullQuotation = ({ quotationId }: PrintableFullQuotationProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  
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

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Quotation-${data?.inventory__productQuotation?.quotationUID}`,
  });

  const quotation = data?.inventory__productQuotation;

  if (loading) {
    return <Text>Loading quotation...</Text>;
  }

  if (!quotation) {
    return <Text>Quotation not found</Text>;
  }

  return (
    <div>
      <Group position="right" mb="md">
        <Button
          leftIcon={<PrinterIcon size={16} />}
          onClick={handlePrint}
          variant="filled"
        >
          Print Quotation
        </Button>
      </Group>

      <div ref={printRef} style={{ padding: "20px", backgroundColor: "white" }}>
        <Card withBorder p="xl" style={{ minHeight: "297mm" }}>
          {/* Header */}
          <Group position="apart" mb="xl">
            <div>
              <Title order={2} color="blue">QUOTATION</Title>
              <Text size="lg" weight={600}>#{quotation.quotationUID}</Text>
            </div>
            <div style={{ textAlign: "right" }}>
              <Text size="sm" color="dimmed">Date</Text>
              <Text weight={500}>{dateFormat(quotation.date)}</Text>
              {quotation.validUntil && (
                <>
                  <Text size="sm" color="dimmed" mt="xs">Valid Until</Text>
                  <Text weight={500}>{dateFormat(quotation.validUntil)}</Text>
                </>
              )}
            </div>
          </Group>

          {/* Client Information */}
          <Card withBorder p="md" mb="lg">
            <Title order={4} mb="sm">Quote To:</Title>
            <Text weight={600}>{quotation.client?.name || "No Client"}</Text>
            {quotation.client?.email && (
              <Text size="sm">{quotation.client.email}</Text>
            )}
            {quotation.client?.contactNumber && (
              <Text size="sm">{quotation.client.contactNumber}</Text>
            )}
            {quotation.client?.address && (
              <Text size="sm">{quotation.client.address}</Text>
            )}
          </Card>

          {/* Products Table */}
          <Table striped withBorder mb="lg">
            <thead>
              <tr>
                <th>Item</th>
                <th>Code</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {quotation.products?.map((product: any, index: number) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.code}</td>
                  <td>{product.quantity}</td>
                  <td>{currencyNumberWithSymbolFormat(product.unitSellPrice || 0)} BDT</td>
                  <td>{currencyNumberWithSymbolFormat(product.discountAmount || 0)} BDT</td>
                  <td>{currencyNumberWithSymbolFormat(product.taxAmount || 0)} BDT</td>
                  <td>{currencyNumberWithSymbolFormat(product.netAmount || 0)} BDT</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Summary */}
          <Group position="right">
            <div style={{ width: "300px" }}>
              <Stack spacing="xs">
                <Group position="apart">
                  <Text>Subtotal:</Text>
                  <Text>{currencyNumberWithSymbolFormat(quotation.subTotal || 0)} BDT</Text>
                </Group>
                
                {quotation.netDiscountAmount > 0 && (
                  <Group position="apart">
                    <Text>Discount:</Text>
                    <Text>-{currencyNumberWithSymbolFormat(quotation.netDiscountAmount)} BDT</Text>
                  </Group>
                )}
                
                {quotation.netTaxAmount > 0 && (
                  <Group position="apart">
                    <Text>Tax:</Text>
                    <Text>{currencyNumberWithSymbolFormat(quotation.netTaxAmount)} BDT</Text>
                  </Group>
                )}
                
                <Group 
                  position="apart" 
                  style={{ 
                    borderTop: "2px solid #000", 
                    paddingTop: "8px",
                    marginTop: "8px"
                  }}
                >
                  <Text weight={700} size="lg">Total:</Text>
                  <Text weight={700} size="lg">
                    {currencyNumberWithSymbolFormat(quotation.netTotal || 0)} BDT
                  </Text>
                </Group>
              </Stack>
            </div>
          </Group>

          {/* Notes */}
          {quotation.note && (
            <Card withBorder p="md" mt="lg">
              <Title order={5} mb="xs">Notes:</Title>
              <Text>{quotation.note}</Text>
            </Card>
          )}

          {/* Terms & Conditions */}
          <Card withBorder p="md" mt="lg">
            <Title order={5} mb="xs">Terms & Conditions:</Title>
            <Text size="sm">
              1. This quotation is valid until the date specified above.
            </Text>
            <Text size="sm">
              2. Prices are subject to change without prior notice.
            </Text>
            <Text size="sm">
              3. All prices include applicable taxes unless otherwise specified.
            </Text>
            <Text size="sm">
              4. Payment terms and conditions apply as per company policy.
            </Text>
          </Card>

          {/* Footer */}
          <Group position="center" mt="xl" pt="md" style={{ borderTop: "1px solid #e0e0e0" }}>
            <Text size="sm" color="dimmed">
              Thank you for your business!
            </Text>
          </Group>
        </Card>
      </div>
    </div>
  );
};

export default PrintableFullQuotation;