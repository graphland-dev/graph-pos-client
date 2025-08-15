import { Button, Menu } from "@mantine/core";
import { useMutation } from "@apollo/client";
import { notifications } from "@mantine/notifications";
import { 
  UPDATE_QUOTATION_STATUS_MUTATION,
  CONVERT_QUOTATION_TO_INVOICE_MUTATION,
  INVENTORY_PRODUCT_QUOTATIONS_QUERY 
} from "../utils/query.quotations";
import { IconChevronDown, IconCheck, IconX, IconFileInvoice } from "@tabler/icons-react";

interface QuotationStatusActionsProps {
  quotationId: string;
  currentStatus: string;
  onStatusChange?: () => void;
}

const QuotationStatusActions = ({ quotationId, currentStatus, onStatusChange }: QuotationStatusActionsProps) => {
  const [updateStatus] = useMutation(UPDATE_QUOTATION_STATUS_MUTATION, {
    refetchQueries: [{ query: INVENTORY_PRODUCT_QUOTATIONS_QUERY }],
    onCompleted: () => {
      notifications.show({
        title: "Success",
        message: "Quotation status updated successfully",
        color: "green",
      });
      onStatusChange?.();
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const [convertToInvoice] = useMutation(CONVERT_QUOTATION_TO_INVOICE_MUTATION, {
    refetchQueries: [{ query: INVENTORY_PRODUCT_QUOTATIONS_QUERY }],
    onCompleted: (data) => {
      notifications.show({
        title: "Success",
        message: `Quotation converted to invoice #${data.inventory__convertQuotationToInvoice.invoiceUID}`,
        color: "green",
      });
      onStatusChange?.();
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const handleStatusChange = (newStatus: string) => {
    updateStatus({
      variables: {
        where: {
          filters: [{ key: "_id", operator: "EQ", value: quotationId }]
        },
        body: {
          status: newStatus
        }
      }
    });
  };

  const handleConvertToInvoice = () => {
    convertToInvoice({
      variables: {
        where: {
          filters: [{ key: "_id", operator: "EQ", value: quotationId }]
        }
      }
    });
  };

  const getAvailableActions = () => {
    switch (currentStatus) {
      case "DRAFT":
        return (
          <>
            <Menu.Item
              icon={<IconCheck size={16} />}
              onClick={() => handleStatusChange("SENT")}
            >
              Mark as Sent
            </Menu.Item>
          </>
        );
      
      case "SENT":
        return (
          <>
            <Menu.Item
              icon={<IconCheck size={16} />}
              onClick={() => handleStatusChange("ACCEPTED")}
              color="green"
            >
              Mark as Accepted
            </Menu.Item>
            <Menu.Item
              icon={<IconX size={16} />}
              onClick={() => handleStatusChange("REJECTED")}
              color="red"
            >
              Mark as Rejected
            </Menu.Item>
          </>
        );
      
      case "ACCEPTED":
        return (
          <>
            <Menu.Item
              icon={<IconFileInvoice size={16} />}
              onClick={handleConvertToInvoice}
              color="blue"
            >
              Convert to Invoice
            </Menu.Item>
          </>
        );
      
      default:
        return null;
    }
  };

  const availableActions = getAvailableActions();

  if (!availableActions) {
    return null;
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          variant="light"
          rightIcon={<IconChevronDown size={16} />}
          size="sm"
        >
          Actions
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Status Actions</Menu.Label>
        {availableActions}
      </Menu.Dropdown>
    </Menu>
  );
};

export default QuotationStatusActions;