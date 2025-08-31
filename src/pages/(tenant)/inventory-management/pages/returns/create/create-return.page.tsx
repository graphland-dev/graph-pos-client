import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Paper,
  Title,
  Button,
  Text,
  Select,
  Textarea,
  NumberInput,
  Checkbox,
  Card,
  Badge,
  Divider,
  Alert,
  Loader,
  ActionIcon,
  Grid,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import PageTitle from "@/commons/components/PageTitle";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { formatTableColumnDate } from "@/commons/utils/dateFormat";
import {
  CREATE_PRODUCT_RETURN,
  GET_INVOICE_FOR_RETURN,
} from "../utils/returns.query";
import { createReturnValidationSchema } from "../utils/returns.validation";
import {
  MatchOperator,
  ProductInvoice,
} from "@/commons/graphql-models/graphql";

// Enums based on the API documentation
const RETURN_REASONS = [
  { value: "DAMAGED", label: "Damaged" },
  { value: "DEFECTIVE", label: "Defective" },
  { value: "WRONG_ITEM", label: "Wrong Item" },
  { value: "NOT_AS_DESCRIBED", label: "Not as Described" },
  { value: "CUSTOMER_CHANGED_MIND", label: "Customer Changed Mind" },
  { value: "SIZE_ISSUE", label: "Size Issue" },
  { value: "QUALITY_ISSUE", label: "Quality Issue" },
  { value: "OTHER", label: "Other" },
];

const RETURN_TYPES = [
  { value: "FULL_REFUND", label: "Full Refund" },
  { value: "PARTIAL_REFUND", label: "Partial Refund" },
  { value: "STORE_CREDIT", label: "Store Credit" },
  { value: "EXCHANGE", label: "Exchange" },
];

const PRODUCT_CONDITIONS = [
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" },
  { value: "Damaged", label: "Damaged" },
];

const CreateReturnPage = () => {
  const { invoiceId, returnId } = useParams<{
    invoiceId?: string;
    returnId?: string;
  }>();
  const { tenant } = useParams<{ tenant: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<ProductInvoice | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(createReturnValidationSchema),
    defaultValues: {
      returnItems: [],
      reason: "",
      returnType: "FULL_REFUND",
      restockingFee: 0,
      returnDate: new Date(),
    },
  });

  // Watch for changes in form values
  const watchedReturnItems = watch("returnItems");

  // GraphQL operations
  const [getInvoice, { loading: invoiceLoading }] = useLazyQuery(
    GET_INVOICE_FOR_RETURN,
    {
      onCompleted: (data) => {
        if (data?.inventory__productInvoice) {
          setInvoice(data.inventory__productInvoice);
          setValue("invoiceId", data.inventory__productInvoice._id);
        }
      },
      onError: (error) => {
        showNotification({
          title: "Error",
          message: "Failed to load invoice details",
          color: "red",
        });
        console.error("Invoice loading error:", error);
      },
    }
  );

  const [createReturn] = useMutation(CREATE_PRODUCT_RETURN, {
    onCompleted: (data) => {
      if (data.inventory__createProductReturn._id) {
        showNotification({
          title: "Success",
          message: "Product return created successfully",
          color: "green",
        });
        navigate(`/${tenant}/inventory-management/returns`);
      } else {
        showNotification({
          title: "Error",
          message: "Failed to create return",
          color: "red",
        });
      }
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: "Failed to create product return",
        color: "red",
      });
      console.error("Return creation error:", error);
    },
  });

  // Load invoice on component mount or when invoiceId changes
  useEffect(() => {
    if (invoiceId && !returnId) {
      getInvoice({
        variables: {
          where: {
            key: "_id",
            operator: MatchOperator.Eq,
            value: invoiceId,
          },
        },
      });
    }
  }, [invoiceId, returnId, getInvoice]);

  // Handle product selection
  const handleProductSelect = (referenceId: string, selected: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [referenceId]: selected,
    }));

    if (selected && invoice?.products) {
      // Add item to return items
      const product = invoice.products.find(
        (p) => p.referenceId === referenceId
      );
      if (product) {
        const currentItems = watchedReturnItems || [];
        const newItem = {
          referenceId,
          returnQuantity: 1,
          condition: "Good",
          canRestock: true,
          itemNotes: "",
        };
        setValue("returnItems", [...currentItems, newItem]);
      }
    } else {
      // Remove item from return items
      const currentItems = watchedReturnItems || [];
      const filteredItems = currentItems.filter(
        (item) => item.referenceId !== referenceId
      );
      setValue("returnItems", filteredItems);
    }
  };

  // Handle quantity change for return items
  const handleQuantityChange = (referenceId: string, quantity: number) => {
    const currentItems = watchedReturnItems || [];
    const updatedItems = currentItems.map((item) =>
      item.referenceId === referenceId
        ? { ...item, returnQuantity: quantity }
        : item
    );
    setValue("returnItems", updatedItems);
  };

  // Calculate totals
  const { totalAmount, refundAmount } = useMemo(() => {
    if (!invoice?.products || !watchedReturnItems)
      return { totalAmount: 0, refundAmount: 0 };

    const totalAmount = watchedReturnItems.reduce((sum, returnItem) => {
      const product = invoice.products?.find(
        (p) => p.referenceId === returnItem.referenceId
      );
      if (product?.unitSellPrice) {
        return sum + product.unitSellPrice * returnItem.returnQuantity;
      }
      return sum;
    }, 0);

    const restockingFee = watch("restockingFee") || 0;
    const refundAmount = Math.max(0, totalAmount - restockingFee);

    return { totalAmount, refundAmount };
  }, [invoice?.products, watchedReturnItems, watch]);

  // Submit form
  const onSubmit = async (
    data: yup.InferType<typeof createReturnValidationSchema>
  ) => {
    if (!invoice) {
      showNotification({
        title: "Error",
        message: "Invoice not loaded",
        color: "red",
      });
      return;
    }

    try {
      await createReturn({
        variables: {
          input: {
            ...data,
            returnDate: data.returnDate?.toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  if (invoiceLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-96">
        <Loader size="lg" />
        <Text>Loading invoice details...</Text>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <ActionIcon
          variant="light"
          onClick={() => navigate(`/${tenant}/inventory-management/returns`)}
        >
          <IconArrowLeft size={18} />
        </ActionIcon>
        <PageTitle title={returnId ? "Edit Return" : "Create Return"} />
      </div>

      {/* Debug: Show form errors */}
      {Object.keys(errors).length > 0 && (
        <Alert color="red" mb="md" icon={<IconAlertCircle size={16} />}>
          <Text fw={600} mb="xs">Form Errors:</Text>
          <ul>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <strong>{field}:</strong> {error?.message}
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Debug: Show current form values */}
      <Alert color="blue" mb="md">
        <Text fw={600} mb="xs">Debug Info:</Text>
        <Text size="sm">Selected Items: {JSON.stringify(selectedItems)}</Text>
        <Text size="sm">Return Items Count: {watchedReturnItems?.length || 0}</Text>
        <Text size="sm">Return Items: {JSON.stringify(watchedReturnItems)}</Text>
      </Alert>

      {invoice && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid>
            <Grid.Col span={8}>
              {/* Invoice Information */}
              <Paper p="md" mb="md" withBorder>
                <Title order={4} mb="md">
                  Invoice Information
                </Title>
                <div className="flex items-center gap-3 mb-3">
                  <Text>
                    <strong>Invoice #:</strong> {invoice.invoiceUID}
                  </Text>
                  <Badge color={invoice.status === "PAID" ? "green" : "orange"}>
                    {invoice.status}
                  </Badge>
                </div>
                <Text mb="sm">
                  <strong>Date:</strong> {formatTableColumnDate(invoice.date)}
                </Text>
                <Text mb="sm">
                  <strong>Total:</strong>{" "}
                  {currencyNumberWithSymbolFormat(invoice.netTotal || 0)}
                </Text>
                {invoice.client && (
                  <>
                    <Text mb="sm">
                      <strong>Client:</strong> {invoice.client.name}
                    </Text>
                    {invoice.client.contactNumber && (
                      <Text mb="sm">
                        <strong>Contact:</strong> {invoice.client.contactNumber}
                      </Text>
                    )}
                  </>
                )}
              </Paper>

              {/* Product Selection */}
              <Paper p="md" mb="md" withBorder>
                <Title order={4} mb="md">
                  Select Products to Return
                </Title>
                {!invoice.products || invoice.products.length === 0 ? (
                  <Alert icon={<IconAlertCircle size={16} />} color="blue">
                    No products found in this invoice
                  </Alert>
                ) : (
                  <div className="flex flex-col gap-4">
                    {invoice.products.map((product) => {
                      const isSelected = selectedItems[product.referenceId];
                      const returnItem = watchedReturnItems?.find(
                        (item) => item.referenceId === product.referenceId
                      );

                      return (
                        <Card key={product.referenceId} withBorder p="sm">
                          <div className="flex items-center gap-3 mb-3">
                            <Checkbox
                              checked={isSelected || false}
                              onChange={(event) =>
                                handleProductSelect(
                                  product.referenceId,
                                  event.currentTarget.checked
                                )
                              }
                            />
                            <div>
                              <Text fw={500}>{product.name}</Text>
                              <Text size="sm" c="dimmed">
                                Code: {product.code}
                              </Text>
                            </div>
                            <div
                              style={{ textAlign: "right", marginLeft: "auto" }}
                            >
                              <Text size="sm">
                                Qty: {product.quantity} ×{" "}
                                {currencyNumberWithSymbolFormat(
                                  product.unitSellPrice || 0
                                )}
                              </Text>
                              <Text fw={500}>
                                {currencyNumberWithSymbolFormat(
                                  product.netAmount || 0
                                )}
                              </Text>
                            </div>
                          </div>

                          {isSelected && returnItem && (
                            <div
                              className="pt-3 mt-3"
                              style={{ borderTop: "1px solid #e9ecef" }}
                            >
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <NumberInput
                                  label="Return Quantity"
                                  min={1}
                                  max={product.quantity || 1}
                                  value={returnItem?.returnQuantity}
                                  onChange={(value) =>
                                    handleQuantityChange(
                                      product.referenceId,
                                      Number(value || 1)
                                    )
                                  }
                                />
                                <Select
                                  label="Condition"
                                  data={PRODUCT_CONDITIONS}
                                  value={returnItem.condition}
                                  onChange={(value) => {
                                    const currentItems =
                                      watchedReturnItems || [];
                                    const updatedItems = currentItems.map(
                                      (item) =>
                                        item.referenceId === product.referenceId
                                          ? {
                                              ...item,
                                              condition: value || "Good",
                                            }
                                          : item
                                    );
                                    setValue("returnItems", updatedItems);
                                  }}
                                />
                              </div>
                              <Checkbox
                                label="Can be restocked"
                                checked={returnItem.canRestock}
                                onChange={(event) => {
                                  const currentItems = watchedReturnItems || [];
                                  const updatedItems = currentItems.map(
                                    (item) =>
                                      item.referenceId === product.referenceId
                                        ? {
                                            ...item,
                                            canRestock:
                                              event.currentTarget.checked,
                                          }
                                        : item
                                  );
                                  setValue("returnItems", updatedItems);
                                }}
                              />
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </Paper>
            </Grid.Col>

            <Grid.Col span={4}>
              {/* Return Details */}
              <Paper p="md" mb="md" withBorder>
                <Title order={4} mb="md">
                  Return Details
                </Title>
                <div className="space-y-4">
                  <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Return Reason"
                        placeholder="Select reason for return"
                        data={RETURN_REASONS}
                        error={errors.reason?.message}
                        withAsterisk
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="returnType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Return Type"
                        placeholder="Select return type"
                        data={RETURN_TYPES}
                        error={errors.returnType?.message}
                        withAsterisk
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="returnDate"
                    control={control}
                    render={({ field }) => (
                      <DatePickerInput
                        label="Return Date"
                        maxDate={new Date()}
                        error={errors.returnDate?.message}
                        withAsterisk
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="restockingFee"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        label="Restocking Fee"
                        placeholder="0.00"
                        min={0}
                        precision={2}
                        error={errors.restockingFee?.message}
                        {...field}
                        value={field.value || 0}
                      />
                    )}
                  />

                  <Controller
                    name="customerNotes"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        label="Customer Notes (Optional)"
                        placeholder="Any notes from or for the customer..."
                        error={errors.customerNotes?.message}
                        maxLength={1000}
                        {...field}
                      />
                    )}
                  />
                </div>
              </Paper>

              {/* Return Summary */}
              {watchedReturnItems && watchedReturnItems.length > 0 && (
                <Paper p="md" withBorder>
                  <Title order={4} mb="md">
                    Return Summary
                  </Title>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Text>Items Selected:</Text>
                      <Text fw={500}>{watchedReturnItems.length}</Text>
                    </div>
                    <div className="flex items-center justify-between">
                      <Text>Total Value:</Text>
                      <Text fw={500}>
                        {currencyNumberWithSymbolFormat(totalAmount)}
                      </Text>
                    </div>
                    <div className="flex items-center justify-between">
                      <Text>Restocking Fee:</Text>
                      <Text fw={500}>
                        -
                        {currencyNumberWithSymbolFormat(
                          watch("restockingFee") || 0
                        )}
                      </Text>
                    </div>
                    <Divider />
                    <div className="flex items-center justify-between">
                      <Text fw={600}>Net Refund Amount:</Text>
                      <Text fw={600} size="lg" c="green">
                        {currencyNumberWithSymbolFormat(refundAmount)}
                      </Text>
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={!watchedReturnItems.length}
                      fullWidth
                      mt="md"
                    >
                      {returnId ? "Update Return" : "Create Return"}
                    </Button>
                  </div>
                </Paper>
              )}
            </Grid.Col>
          </Grid>
        </form>
      )}
    </div>
  );
};

export default CreateReturnPage;
