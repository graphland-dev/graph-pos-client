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

// Payment method removed in simplified model

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
      // Debt reduction removed
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

  // Quota validation
  const returnQuota = invoice?.returnQuota;
  const availableItems = useMemo(() => {
    if (!returnQuota?.itemAvailability) return [];
    return returnQuota.itemAvailability.filter(
      (item) => item.availableForReturnQuantity > 0
    );
  }, [returnQuota]);

  // Real-time validation with debt reduction support
  const validation = useMemo(() => {
    const errors: string[] = [];
    let totalValue = 0;

    if (!watchedReturnItems || !returnQuota) {
      return { isValid: false, errors: [], totalValue: 0, netRefund: 0 } as any;
    }
    const restockingFee = watch("restockingFee") || 0;

    // Validate each selected item
    watchedReturnItems.forEach((selectedItem) => {
      const availability = returnQuota.itemAvailability?.find(
        (item) => item.referenceId === selectedItem.referenceId
      );

      if (!availability) {
        errors.push(`Item not found in invoice: ${selectedItem.referenceId}`);
        return;
      }

      // Check quantity limits
      if (
        selectedItem.returnQuantity > availability.availableForReturnQuantity
      ) {
        errors.push(
          `${availability.name}: Only ${availability.availableForReturnQuantity} available (requested ${selectedItem.returnQuantity})`
        );
        return;
      }

      totalValue += selectedItem.returnQuantity * availability.unitPrice;
    });

    const netRefundAfterFee = Math.max(0, totalValue - restockingFee);

    return {
      isValid: errors.length === 0 && totalValue > 0,
      errors,
      totalValue,
      netRefund: netRefundAfterFee,
    };
  }, [watchedReturnItems, returnQuota, watch]);

  const [createReturn] = useMutation(CREATE_PRODUCT_RETURN, {
    onCompleted: (data) => {
      const createdId = data?.inventory__createProductReturn?._id;
      if (createdId) {
        showNotification({
          title: "Success",
          message: "Product return created successfully",
          color: "green",
        });
        // Redirect to return details page
        navigate(`/${tenant}/inventory-management/returns/${createdId}`);
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

    if (selected && availableItems.length > 0) {
      // Add item to return items using quota data
      const availableItem = availableItems.find(
        (item) => item.referenceId === referenceId
      );
      if (availableItem) {
        const currentItems = watchedReturnItems || [];
        const newItem = {
          referenceId,
          returnQuantity: 1, // Start with 1, user can increase up to availableForReturnQuantity
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

  // This calculation is now handled by the validation system

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
      // Prepare submission data with debt reduction fields
      const submissionData = {
        ...data,
        returnDate: data.returnDate?.toISOString(),
        // Debt reduction removed: only core fields are submitted
      };

      await createReturn({
        variables: {
          input: submissionData,
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
          <Text fw={600} mb="xs">
            Form Errors:
          </Text>
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
      {/* <Alert color="blue" mb="md">
        <Text fw={600} mb="xs">
          Debug Info:
        </Text>
        <Text size="sm">Selected Items: {JSON.stringify(selectedItems)}</Text>
        <Text size="sm">
          Return Items Count: {watchedReturnItems?.length || 0}
        </Text>
        <Text size="sm">
          Return Items: {JSON.stringify(watchedReturnItems)}
        </Text>
      </Alert> */}

      {/* Quota Validation Messages */}
      {/* Removed blocking alert based on canCreateNewReturn */}

      {invoice && returnQuota && availableItems.length === 0 && (
        <Alert color="blue" mb="md" icon={<IconAlertCircle size={16} />}>
          <Title order={5} mb="xs">
            📦 No Items Available for Return
          </Title>
          <Text mb="sm">
            All items from this invoice have already been returned.
          </Text>
          <div className="space-y-1">
            <Text size="sm">No physical items remain to return.</Text>
          </div>
        </Alert>
      )}

      {/* Real-time Validation Feedback */}
      {/* {validation.errors.length > 0 && (
        <Alert color="red" mb="md" icon={<IconAlertCircle size={16} />}>
          <Title order={5} mb="xs">
            ❌ Issues Found:
          </Title>
          <ul>
            {validation.errors?.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )} */}

      {invoice && availableItems.length > 0 && (
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
                  <Badge color={invoice.paymentStatus === "PAID" ? "green" : "orange"}>
                    {invoice.paymentStatus || invoice.lifecycleStatus}
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

              {/* Return Quota Summary */}
              {returnQuota && (
                <Paper p="md" mb="md" withBorder>
                  <Title order={4} mb="md">
                    Return Budget Summary
                  </Title>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Text size="sm" c="dimmed">
                        Invoice Total:
                      </Text>
                      <Text fw={500}>
                        {currencyNumberWithSymbolFormat(
                          returnQuota.invoiceTotal
                        )}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">
                        Customer Paid:
                      </Text>
                      <Text fw={500}>
                        {currencyNumberWithSymbolFormat(returnQuota.totalPaid)}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" c="dimmed">
                        Already Returned:
                      </Text>
                      <Text fw={500}>
                        {currencyNumberWithSymbolFormat(
                          returnQuota.totalReturned
                        )}
                      </Text>
                    </div>
                  
                  </div>

                  {/* Simplified: single available amount for refund (cash) */}

                  {/* Progress Bar */}
                  <div className="h-2 mb-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{
                        width: `${Math.min(
                          (returnQuota.totalReturned /
                            returnQuota.invoiceTotal) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <Text size="xs" c="dimmed" className="text-center">
                    {currencyNumberWithSymbolFormat(returnQuota.totalReturned)}{" "}
                    of{" "}
                    {currencyNumberWithSymbolFormat(returnQuota.invoiceTotal)}{" "}
                    returned
                  </Text>
                </Paper>
              )}

              {/* Product Selection */}
              <Paper p="md" mb="md" withBorder>
                <Title order={4} mb="md">
                  Items Available for Return
                </Title>
                {availableItems.length === 0 ? (
                  <Alert icon={<IconAlertCircle size={16} />} color="blue">
                    No items available for return
                  </Alert>
                ) : (
                  <div className="flex flex-col gap-4">
                    {availableItems.map((item) => {
                      const isSelected = selectedItems[item.referenceId];
                      const returnItem = watchedReturnItems?.find(
                        (returnItemData) =>
                          returnItemData.referenceId === item.referenceId
                      );

                      return (
                        <Card key={item.referenceId} withBorder p="sm">
                          <div className="flex items-center gap-3 mb-3">
                            <Checkbox
                              checked={isSelected || false}
                              onChange={(event) =>
                                handleProductSelect(
                                  item.referenceId,
                                  event.currentTarget.checked
                                )
                              }
                            />
                            <div className="flex-1">
                              <Text fw={500}>{item.name}</Text>
                              <div className="flex items-center gap-4 mt-1">
                                <Text size="sm" c="dimmed">
                                  Purchased: {item.purchasedQuantity}
                                </Text>
                                <Text size="sm" c="dimmed">
                                  Returned: {item.alreadyReturnedQuantity}
                                </Text>
                                <Text size="sm" fw={500} c="green">
                                  Available: {item.availableForReturnQuantity}
                                </Text>
                              </div>
                            </div>
                            <div className="text-right">
                              <Text size="sm" c="dimmed">
                                Unit Price:{" "}
                                {currencyNumberWithSymbolFormat(item.unitPrice)}
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
                                  max={item.availableForReturnQuantity}
                                  value={returnItem?.returnQuantity}
                                  onChange={(value) =>
                                    handleQuantityChange(
                                      item.referenceId,
                                      Number(value || 1)
                                    )
                                  }
                                  description={`Max: ${item.availableForReturnQuantity} available`}
                                />
                                <Select
                                  label="Condition"
                                  data={PRODUCT_CONDITIONS}
                                  value={returnItem.condition}
                                  onChange={(value) => {
                                    const currentItems =
                                      watchedReturnItems || [];
                                    const updatedItems = currentItems.map(
                                      (updateItem) =>
                                        updateItem.referenceId ===
                                        item.referenceId
                                          ? {
                                              ...updateItem,
                                              condition: value || "Good",
                                            }
                                          : updateItem
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
                                    (updateItem) =>
                                      updateItem.referenceId ===
                                      item.referenceId
                                        ? {
                                            ...updateItem,
                                            canRestock:
                                              event.currentTarget.checked,
                                          }
                                        : updateItem
                                  );
                                  setValue("returnItems", updatedItems);
                                }}
                              />

                              {/* Show current value calculation */}
                              <div className="p-2 mt-3 rounded bg-blue-50">
                                <Text size="sm" fw={500}>
                                  Return Value:{" "}
                                  {currencyNumberWithSymbolFormat(
                                    returnItem.returnQuantity * item.unitPrice
                                  )}
                                </Text>
                              </div>
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

                  {/* Payment method and debt reduction removed */}

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
                        {currencyNumberWithSymbolFormat(validation.totalValue)}
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
                        {currencyNumberWithSymbolFormat(validation.netRefund)}
                      </Text>
                    </div>

                    {/* Payment breakdown removed in simplified model */}

                    {/* Validation Status */}
                    {validation.isValid ? (
                      <div className="p-2 border border-green-200 rounded bg-green-50">
                        <Text size="sm" c="green" fw={500}>
                          ✅ Return request is valid
                        </Text>
                      </div>
                    ) : (
                      validation.errors.length > 0 && (
                        <div className="p-2 border border-red-200 rounded bg-red-50">
                          <Text size="sm" c="red" fw={500} mb="xs">
                            ❌ Issues found:
                          </Text>
                          <ul className="text-sm text-red-600">
                            {validation.errors.map((error: string, index: number) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={!validation.isValid}
                      fullWidth
                      mt="md"
                    >
                      {returnId
                        ? "Update Return"
                        : `Create Return (${currencyNumberWithSymbolFormat(
                            validation.totalValue
                          )})`}
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
