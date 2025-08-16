import PrintableFullInvoice from "@/commons/components/invoice/PrintableFullInvoice";
import { Modal, Text } from "@mantine/core";

interface InvoicePrintModalProps {
  opened: boolean;
  onClose: () => void;
  invoiceId: string;
  tenant: string;
}

const InvoicePrintModal = ({
  opened,
  onClose,
  invoiceId,
  tenant,
}: InvoicePrintModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text className="text-2xl font-semibold">Invoice Print Preview</Text>
      }
      size="100%"
      padding="md"
    >
      {invoiceId && (
        <PrintableFullInvoice invoiceId={invoiceId} tenant={tenant} />
      )}
    </Modal>
  );
};

export default InvoicePrintModal;