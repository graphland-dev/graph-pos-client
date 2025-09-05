import InvoicePrintModal from "@/commons/components/invoice/InvoicePrintModal";
import { Badge, Button, Group, Title, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { IconEdit, IconPrinter, IconCheck, IconTrash } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { 
  ProductInvoice, 
  Invoice_Status, 
  MatchOperator 
} from "@/commons/graphql-models/graphql";
import ProductInvoiceDetails from "../components/ProductInvoiceDetails";
import { 
  INVENTORY_PRODUCT_INVOICE_QUERY, 
  UPDATE_PRODUCT_INVOICE_MUTATION,
  DELETE_PRODUCT_INVOICE_MUTATION 
} from "../utils/query.invoices";

const InvoiceDetailsPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string; invoiceId: string }>();
  const [printModalOpened, { open: openPrintModal, close: closePrintModal }] =
    useDisclosure(false);

  const invoiceId = params.invoiceId || "";

  // Fetch invoice data to check lifecycle status
  const { data: invoiceData, loading, refetch } = useQuery<{
    inventory__productInvoice: ProductInvoice;
  }>(INVENTORY_PRODUCT_INVOICE_QUERY, {
    variables: {
      where: {
        key: "_id",
        operator: MatchOperator.Eq,
        value: invoiceId,
      },
    },
    skip: !invoiceId,
  });

  // Mutation for updating invoice (including lifecycle status)
  const [updateInvoice, { loading: updating }] = useMutation(
    UPDATE_PRODUCT_INVOICE_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Invoice status updated successfully",
          color: "green",
        });
        refetch(); // Refresh invoice data
      },
      onError: (error) => {
        showNotification({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    }
  );

  // Mutation for deleting invoice
  const [deleteInvoice, { loading: deleting }] = useMutation(
    DELETE_PRODUCT_INVOICE_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Invoice deleted successfully",
          color: "green",
        });
        // Navigate back to invoices list
        navigate(`/${params.tenant}/inventory-management/invoices`);
      },
      onError: (error) => {
        showNotification({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    }
  );

  const invoice = invoiceData?.inventory__productInvoice;
  const isFinalized = invoice?.lifecycleStatus === Invoice_Status.Finalized;
  const isDraft = invoice?.lifecycleStatus === Invoice_Status.Draft;

  const handleStatusUpdate = (newStatus: Invoice_Status) => {
    updateInvoice({
      variables: {
        invoiceId,
        input: {
          lifecycleStatus: newStatus,
        },
      },
    });
  };

  const handleDeleteInvoice = () => {
    modals.openConfirmModal({
      title: "Delete Invoice",
      children: (
        <Text size="sm">
          Are you sure you want to delete invoice{" "}
          <strong>{invoice?.invoiceUID}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleting },
      onConfirm: () =>
        deleteInvoice({
          variables: {
            where: {
              key: "_id",
              operator: MatchOperator.Eq,
              value: invoiceId,
            },
          },
        }),
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Title order={2}>Invoice Details</Title>
          {invoice && (
            <Badge 
              color={isFinalized ? "green" : "orange"} 
              variant="filled"
              size="lg"
            >
              {invoice.lifecycleStatus || "DRAFT"}
            </Badge>
          )}
        </div>
        <Group>
          <Button
            variant="outline"
            leftIcon={<IconPrinter size={16} />}
            onClick={openPrintModal}
            disabled={loading}
          >
            Print Preview
          </Button>
          
          {/* Lifecycle Status Update Buttons */}
          {isDraft && (
            <Button
              color="green"
              leftIcon={<IconCheck size={16} />}
              onClick={() => handleStatusUpdate(Invoice_Status.Finalized)}
              loading={updating}
            >
              Finalize Invoice
            </Button>
          )}
          
          {/* Edit Button - Only show if not finalized */}
          {!isFinalized && (
            <Button
              leftIcon={<IconEdit size={16} />}
              onClick={() =>
                navigate(
                  `/${params.tenant}/inventory-management/invoices/${invoiceId}/edit`
                )
              }
              disabled={loading}
            >
              Edit Invoice
            </Button>
          )}
          
          {/* Delete Button - Available for both draft and finalized invoices */}
          <Button
            color="red"
            variant="outline"
            leftIcon={<IconTrash size={16} />}
            onClick={handleDeleteInvoice}
            loading={deleting}
            disabled={loading}
          >
            Delete Invoice
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