import PrintableFullQuotation from "@/commons/components/quotation/PrintableFullQuotation";
import { Modal, Text } from "@mantine/core";

interface QuotationPrintModalProps {
  opened: boolean;
  onClose: () => void;
  quotationId: string;
  tenant: string;
}

const QuotationPrintModal = ({
  opened,
  onClose,
  quotationId,
  tenant,
}: QuotationPrintModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text className="text-2xl font-semibold">Quotation Print Preview</Text>
      }
      size="100%"
      padding="md"
    >
      {quotationId && (
        <PrintableFullQuotation quotationId={quotationId} tenant={tenant} />
      )}
    </Modal>
  );
};

export default QuotationPrintModal;
