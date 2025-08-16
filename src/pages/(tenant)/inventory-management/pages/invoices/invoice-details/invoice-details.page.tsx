import InvoicePrintModal from "@/commons/components/invoice/InvoicePrintModal";
import { Button, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPrinter } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import ProductInvoiceDetails from "../components/ProductInvoiceDetails";

const InvoiceDetailsPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string; invoiceId: string }>();
  const [printModalOpened, { open: openPrintModal, close: closePrintModal }] =
    useDisclosure(false);

  const invoiceId = params.invoiceId || "";

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <Title order={2}>Invoice Details</Title>
        <Group>
          <Button
            variant="outline"
            leftIcon={<IconPrinter size={16} />}
            onClick={openPrintModal}
          >
            Print Preview
          </Button>
          <Button
            leftIcon={<IconEdit size={16} />}
            onClick={() =>
              navigate(
                `/${params.tenant}/inventory-management/invoices/${invoiceId}/edit`
              )
            }
          >
            Edit Invoice
          </Button>
        </Group>
      </div>

      <ProductInvoiceDetails invoiceId={invoiceId} />

      <InvoicePrintModal
        opened={printModalOpened}
        onClose={closePrintModal}
        invoiceId={invoiceId}
        tenant={params.tenant || ""}
      />
    </div>
  );
};

export default InvoiceDetailsPage;