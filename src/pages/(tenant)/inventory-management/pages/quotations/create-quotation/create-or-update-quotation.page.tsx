import {
  Client,
  ClientsWithPagination,
  CreateProductQuotationInput,
  MatchOperator,
  Product,
  ProductDiscountMode,
  ProductsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { PEOPLE_CLIENTS_QUERY } from "@/pages/(tenant)/people/pages/client/utils/client.query";
import { useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Drawer,
  Group,
  Modal,
  NumberInput,
  Select,
  Space,
  Table,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconEye, IconInfoCircle, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { INVENTORY_PRODUCTS_LIST_QUERY } from "../../products/products-list/utils/product.query";
import {
  CONVERT_QUOTATION_TO_INVOICE_MUTATION,
  CREATE_PRODUCT_QUOTATION_MUTATION,
  INVENTORY_PRODUCT_QUOTATION_QUERY,
} from "../utils/query.quotations";
import ClientsCardList from "./components/ClientsCardList";
import CreateClientForm from "./components/CreateClientForm";
import CreateProductForm from "./components/CreateProductForm";
import ProductsCardList from "./components/ProductsCardList";
import QuotationPrintModal from "@/commons/components/quotation/QuotationPrintModal";

const quotationSchema = yup.object({
  clientId: yup.string().required("Please select a client"),
  date: yup.date().required("Date is required"),
  validUntil: yup.date().required("Valid until date is required"),
  note: yup.string().default(""),
  terms: yup.string().default(""),
  products: yup
    .array()
    .of(
      yup.object({
        referenceId: yup.string().required("Product reference ID is required"),
        name: yup.string().required("Product name is required"),
        code: yup.string().optional(),
        quantity: yup
          .number()
          .integer()
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1"),
        taxRate: yup
          .number()
          .required("Tax rate is required")
          .min(0, "Tax rate cannot be negative"),
        unitPrice: yup
          .number()
          .required("Unit price is required")
          .min(0, "Unit price cannot be negative"),
        unitSellPrice: yup
          .number()
          .required("Unit sell price is required")
          .min(0, "Unit sell price cannot be negative"),
      })
    )
    .default([]),
  discountMode: yup
    .mixed<ProductDiscountMode>()
    .required()
    .default(ProductDiscountMode.Amount),
  discountValue: yup.number().min(0, "Discount cannot be negative").default(0),
});

type IFormData = yup.InferType<typeof quotationSchema>;

const CreateOrUpdateQuotationPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string; quotationId?: string }>();
  const [searchParams] = useSearchParams();

  const quotationIdFromQuery = searchParams.get("quotationId");
  const quotationIdFromParams = params.quotationId;
  const quotationId = quotationIdFromParams || quotationIdFromQuery;
  const isEditMode = !!quotationId;

  const [
    clientDrawerOpened,
    { open: openClientDrawer, close: closeClientDrawer },
  ] = useDisclosure(false);
  const [
    productDrawerOpened,
    { open: openProductDrawer, close: closeProductDrawer },
  ] = useDisclosure(false);
  const [
    createClientOpened,
    { open: openCreateClient, close: closeCreateClient },
  ] = useDisclosure(false);
  const [
    createProductOpened,
    { open: openCreateProduct, close: closeCreateProduct },
  ] = useDisclosure(false);
  const [
    convertModalOpened,
    { open: openConvertModal, close: closeConvertModal },
  ] = useDisclosure(false);
  const [
    printModalOpened,
    { open: openPrintModal, close: closePrintModal },
  ] = useDisclosure(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [quotationStatus, setQuotationStatus] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm<IFormData>({
    resolver: yupResolver(quotationSchema),
    defaultValues: {
      clientId: "",
      date: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      note: "",
      terms: "",
      products: [],
      discountMode: ProductDiscountMode.Amount,
      discountValue: 0,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "products",
  });

  // Fetch existing quotation data if in edit mode
  useQuery(INVENTORY_PRODUCT_QUOTATION_QUERY, {
    variables: {
      where: {
        key: "_id",
        operator: "eq",
        value: quotationId,
      },
    },
    skip: !isEditMode,
    onCompleted: (data) => {
      if (data.inventory__productQuotation) {
        const quotation = data.inventory__productQuotation;
        reset({
          clientId: quotation.client?._id || "",
          date: new Date(quotation.date),
          validUntil: new Date(quotation.validUntil),
          note: quotation.note || "",
          terms: quotation.terms || "",
          products: quotation.products || [],
          discountMode:
            quotation.quotationDiscountMode || ProductDiscountMode.Amount,
          discountValue:
            quotation.quotationDiscountMode === ProductDiscountMode.Percentage
              ? quotation.quotationDiscountPercentage || 0
              : quotation.quotationDiscountAmount || 0,
        });
        setSelectedClient(quotation.client);
        setQuotationStatus(quotation.status);
      }
    },
  });

  const { data: clientsData, loading: clientsLoading } = useQuery<{
    people__clients: ClientsWithPagination;
  }>(PEOPLE_CLIENTS_QUERY, {
    variables: {
      where: {
        limit: 100,
        page: 1,
        ...(clientSearchQuery && {
          filters: [
            {
              or: [
                {
                  key: "name",
                  operator: MatchOperator.Contains,
                  value: clientSearchQuery,
                },
                {
                  key: "email",
                  operator: MatchOperator.Contains,
                  value: clientSearchQuery,
                },
                {
                  key: "contactNumber",
                  operator: MatchOperator.Contains,
                  value: clientSearchQuery,
                },
              ],
            },
          ],
        }),
      },
    },
  });

  const { data: productsData, loading: productsLoading } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(INVENTORY_PRODUCTS_LIST_QUERY, {
    variables: {
      where: {
        limit: -1,
        page: 1,
        ...(productSearchQuery && {
          filters: [
            {
              or: [
                {
                  key: "name",
                  operator: MatchOperator.Contains,
                  value: productSearchQuery,
                },
                {
                  key: "code",
                  operator: MatchOperator.Contains,
                  value: productSearchQuery,
                },
              ],
            },
          ],
        }),
      },
    },
  });

  const [createQuotation, { loading: creating }] = useMutation(
    CREATE_PRODUCT_QUOTATION_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: `Quotation created successfully`,
          color: "green",
        });
        navigate(`/${params.tenant}/inventory-management/quotations`);
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

  const [convertToInvoice, { loading: converting }] = useMutation(
    CONVERT_QUOTATION_TO_INVOICE_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: `Quotation converted to invoice successfully!`,
          color: "green",
        });
        closeConvertModal();
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

  const formData = watch();
  const isConverted = quotationStatus === "CONVERTED";

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setValue("clientId", client._id);
    closeClientDrawer();
  };

  const handleProductSearch = (query: string) => {
    setProductSearchQuery(query);
  };

  const handleClientSearch = (query: string) => {
    setClientSearchQuery(query);
  };

  const handleProductSelect = (product: Product) => {
    const existingIndex = fields.findIndex(
      (field) => field.referenceId === product._id
    );

    if (existingIndex !== -1) {
      const existingProduct = fields[existingIndex];
      update(existingIndex, {
        ...existingProduct,
        quantity: existingProduct.quantity + 1,
      });
    } else {
      append({
        referenceId: product._id,
        name: product.name,
        code: product.code || "",
        unitPrice: product.price || 0, // Original selling price from product
        unitSellPrice: product.price || 0, // Editable selling price (starts with same value)
        quantity: 1,
        taxRate: 0,
      });
    }
    closeProductDrawer();
  };

  const handleConvertToInvoice = () => {
    if (!quotationId) return;

    convertToInvoice({
      variables: {
        quotationId: quotationId,
      },
    });
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const product = fields[index];
    update(index, {
      ...product,
      quantity,
    });
  };

  const handleUnitPriceChange = (index: number, unitSellPrice: number) => {
    const product = fields[index];
    update(index, {
      ...product,
      unitSellPrice,
    });
  };

  const calculateTotals = () => {
    const subTotal = fields.reduce((sum, product) => {
      const productTotal =
        (product.unitSellPrice || 0) * (product.quantity || 0);
      return sum + productTotal;
    }, 0);
    const discountAmount =
      formData.discountMode === ProductDiscountMode.Percentage
        ? (subTotal * (formData.discountValue || 0)) / 100
        : formData.discountValue || 0;
    const netTotal = subTotal - discountAmount;

    return {
      subTotal,
      discountAmount,
      netTotal,
      itemCount: fields.length,
    };
  };

  const onSubmit = async (data: IFormData) => {
    if (!data.clientId) {
      showNotification({
        title: "Error",
        message: "Please select a client",
        color: "red",
      });
      return;
    }

    if (fields.length === 0) {
      showNotification({
        title: "Error",
        message: "Please add at least one product",
        color: "red",
      });
      return;
    }

    const totals = calculateTotals();

    const quotationInput: CreateProductQuotationInput = {
      clientId: data.clientId,
      date: data.date,
      validUntil: data.validUntil,
      note: data.note,
      terms: data.terms,
      products: fields.map((product) => ({
        referenceId: product.referenceId,
        name: product.name,
        code: product.code,
        unitPrice: product.unitPrice || 0,
        quantity: product.quantity,
        unitSellPrice: product.unitSellPrice || 0,
        taxRate: product.taxRate || 0,
      })),
      quotationDiscountMode: data.discountMode,
      quotationDiscountAmount:
        data.discountMode === ProductDiscountMode.Amount
          ? data.discountValue || 0
          : totals.discountAmount,
      quotationDiscountPercentage:
        data.discountMode === ProductDiscountMode.Percentage
          ? data.discountValue || 0
          : 0,
    };

    createQuotation({
      variables: {
        input: quotationInput,
      },
    });
  };

  const totals = calculateTotals();

  return (
    <Box p="md">
      <div className="flex items-center justify-between mb-6">
        <Title order={2}>
          {isEditMode ? "Edit Quotation" : "Create Quotation"}
        </Title>
        {isEditMode && (
          <Button
            variant="outline"
            leftIcon={<IconEye size={16} />}
            onClick={openPrintModal}
          >
            Print Preview
          </Button>
        )}
      </div>

      {isConverted && (
        <Alert
          icon={<IconInfoCircle size={16} />}
          title="Quotation Already Converted"
          color="blue"
          mb="lg"
        >
          <div className="flex items-center justify-between">
            <Text size="sm">
              This quotation has already been converted to an invoice. You
              cannot edit this quotation.
            </Text>
            <Button
              size="xs"
              variant="light"
              leftIcon={<IconEye size={14} />}
              onClick={() =>
                navigate(`/${params.tenant}/inventory-management/invoices`)
              }
            >
              View Invoice
            </Button>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Main Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Client Selection */}
            <Card withBorder p="md">
              <Title order={4} mb="md">
                Client Information <span style={{ color: "red" }}>*</span>
              </Title>

              {selectedClient ? (
                <div className="flex items-center justify-between p-3 rounded bg-gray-50">
                  <div>
                    <Text weight={500}>{selectedClient.name}</Text>
                    <Text size="sm" color="dimmed">
                      {selectedClient.email}
                    </Text>
                  </div>
                  {!isConverted && (
                    <ActionIcon
                      color="red"
                      onClick={() => {
                        setSelectedClient(null);
                        setValue("clientId", "");
                      }}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={openClientDrawer}
                  fullWidth
                  color={errors.clientId ? "red" : undefined}
                  disabled={isConverted}
                >
                  Select Client *
                </Button>
              )}

              {errors.clientId && (
                <Text size="sm" color="red" mt="xs">
                  {errors.clientId.message}
                </Text>
              )}
            </Card>

            {/* Date Information */}
            <Card withBorder p="md" className="overflow-visible">
              <Title order={4} mb="md">
                Quotation Details
              </Title>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DateInput
                  label="Date"
                  value={formData.date}
                  onChange={(date) => setValue("date", date || new Date())}
                  error={<ErrorMessage errors={errors} name="date" />}
                  required
                  readOnly={isConverted}
                />

                <DateInput
                  label="Valid Until"
                  value={formData.validUntil}
                  onChange={(date) =>
                    setValue("validUntil", date || new Date())
                  }
                  error={<ErrorMessage errors={errors} name="validUntil" />}
                  required
                  readOnly={isConverted}
                />
              </div>

              <Space h="md" />

              <Textarea
                label="Notes"
                placeholder="Additional notes for the quotation..."
                value={formData.note}
                onChange={(e) => setValue("note", e.currentTarget.value)}
                rows={3}
                readOnly={isConverted}
              />

              <Space h="md" />

              <Textarea
                label="Terms & Conditions"
                placeholder="Terms and conditions for the quotation..."
                value={formData.terms}
                onChange={(e) => setValue("terms", e.currentTarget.value)}
                rows={3}
                readOnly={isConverted}
              />
            </Card>

            {/* Products Section */}
            <Card withBorder p="md">
              <div className="flex items-center justify-between mb-4">
                <Title order={4}>Products</Title>
                {!isConverted && (
                  <Button onClick={openProductDrawer}>Add Product</Button>
                )}
              </div>

              {fields.length > 0 ? (
                <Table striped>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="w-[120px]">Unit Price</th>
                      <th className="w-[120px]">Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((product, index) => (
                      <tr key={product.id}>
                        <td>
                          <div>
                            <Text weight={500}>{product.name}</Text>
                            <Text size="sm" color="dimmed">
                              {product.code}
                            </Text>
                          </div>
                        </td>
                        <td>
                          <div>
                            <NumberInput
                              value={product.unitSellPrice || 0}
                              onChange={(value) =>
                                handleUnitPriceChange(index, value || 0)
                              }
                              min={0}
                              precision={2}
                              size="sm"
                              readOnly={isConverted}
                            />
                          </div>
                        </td>
                        <td>
                          <NumberInput
                            value={product.quantity}
                            onChange={(value) =>
                              handleQuantityChange(index, value || 0)
                            }
                            min={1}
                            size="sm"
                            readOnly={isConverted}
                          />
                        </td>
                        <td>
                          <Text weight={500}>
                            {currencyNumberWithSymbolFormat(
                              (product.unitSellPrice || 0) *
                                (product.quantity || 0)
                            )}
                          </Text>
                        </td>
                        <td>
                          {!isConverted && (
                            <ActionIcon
                              color="red"
                              onClick={() => remove(index)}
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Text color="dimmed" align="center" py="xl">
                  No products added yet. Click "Add Product" to get started.
                </Text>
              )}
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card withBorder p="md" style={{ position: "sticky", top: "20px" }}>
              <Title order={4} mb="md">
                Quotation Summary
              </Title>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Items:</Text>
                  <Text weight={500}>{totals.itemCount}</Text>
                </div>

                <div className="flex justify-between">
                  <Text>Subtotal:</Text>
                  <Text weight={500}>
                    {currencyNumberWithSymbolFormat(totals.subTotal)}
                  </Text>
                </div>

                {/* Discount Controls */}
                <div className="py-2 space-y-2 border-t border-gray-100">
                  <Text size="sm" weight={500}>
                    Discount
                  </Text>

                  <div className="flex gap-2">
                    <Select
                      data={[
                        { value: ProductDiscountMode.Amount, label: "BDT" },
                        { value: ProductDiscountMode.Percentage, label: "%" },
                      ]}
                      value={formData.discountMode}
                      onChange={(value) =>
                        setValue("discountMode", value as ProductDiscountMode)
                      }
                      style={{ width: 80 }}
                      size="sm"
                      readOnly={isConverted}
                    />
                    <NumberInput
                      value={formData.discountValue}
                      onChange={(value) =>
                        setValue("discountValue", value || 0)
                      }
                      min={0}
                      max={
                        formData.discountMode === ProductDiscountMode.Percentage
                          ? 100
                          : undefined
                      }
                      precision={
                        formData.discountMode === ProductDiscountMode.Amount
                          ? 2
                          : 0
                      }
                      placeholder="0"
                      style={{ flex: 1 }}
                      size="sm"
                      readOnly={isConverted}
                    />
                  </div>
                </div>

                {totals.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <Text>Discount Applied:</Text>
                    <Text weight={500} color="red">
                      -{currencyNumberWithSymbolFormat(totals.discountAmount)}{" "}
                    </Text>
                  </div>
                )}

                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <Text size="lg" weight={700}>
                      Net Total:
                    </Text>
                    <Text size="lg" weight={700}>
                      {currencyNumberWithSymbolFormat(totals.netTotal)}
                    </Text>
                  </div>
                </div>
              </div>

              <Space h="xl" />

              <Group>
                {isEditMode && !isConverted && (
                  <Button
                    variant="filled"
                    color="green"
                    onClick={openConvertModal}
                    disabled={fields.length === 0 || !formData.clientId}
                  >
                    Convert to Invoice
                  </Button>
                )}
                {!isConverted && (
                  <Button
                    type="submit"
                    loading={creating}
                    disabled={fields.length === 0 || !formData.clientId}
                  >
                    {isEditMode ? "Update Quotation" : "Create Quotation"}
                  </Button>
                )}
              </Group>
            </Card>
          </div>
        </div>
      </form>

      {/* Client Selection Drawer */}
      <Drawer
        opened={clientDrawerOpened}
        onClose={closeClientDrawer}
        title="Select Client"
        size="lg"
      >
        <div className="space-y-4">
          <Button onClick={openCreateClient} fullWidth variant="outline">
            Create New Client
          </Button>

          <ClientsCardList
            clients={clientsData?.people__clients.nodes || []}
            onClientSelect={handleClientSelect}
            onSearch={handleClientSearch}
            loading={clientsLoading}
            totalCount={clientsData?.people__clients?.meta?.totalCount || 0}
          />
        </div>
      </Drawer>

      {/* Product Selection Drawer */}
      <Drawer
        opened={productDrawerOpened}
        onClose={closeProductDrawer}
        title="Select Products"
        size="lg"
      >
        <div className="space-y-4">
          <Button onClick={openCreateProduct} fullWidth variant="outline">
            Create New Product
          </Button>

          <ProductsCardList
            products={productsData?.inventory__products.nodes || []}
            onProductSelect={handleProductSelect}
            onSearch={handleProductSearch}
            loading={productsLoading}
            totalCount={
              productsData?.inventory__products?.meta?.totalCount || 0
            }
          />
        </div>
      </Drawer>

      {/* Create Client Modal */}
      <Drawer
        opened={createClientOpened}
        onClose={closeCreateClient}
        title="Create New Client"
        size="lg"
      >
        <CreateClientForm
          onSuccess={(client) => {
            handleClientSelect(client);
            closeCreateClient();
          }}
          onCancel={closeCreateClient}
        />
      </Drawer>

      {/* Create Product Modal */}
      <Drawer
        opened={createProductOpened}
        onClose={closeCreateProduct}
        title="Create New Product"
        size="lg"
      >
        <CreateProductForm
          onSuccess={(product) => {
            handleProductSelect(product);
            closeCreateProduct();
          }}
          onCancel={closeCreateProduct}
        />
      </Drawer>

      {/* Convert to Invoice Confirmation Modal */}
      <Modal
        opened={convertModalOpened}
        onClose={closeConvertModal}
        title="Convert Quotation to Invoice"
        centered
      >
        <Text mb="md">
          Are you sure you want to convert this quotation to an invoice? This
          action cannot be undone.
        </Text>
        <Text size="sm" color="dimmed" mb="lg">
          The quotation will be converted to an invoice and you will be
          redirected to the invoices page.
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={closeConvertModal}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleConvertToInvoice}
            loading={converting}
          >
            Convert to Invoice
          </Button>
        </Group>
      </Modal>

      {/* Print Preview Modal */}
      <QuotationPrintModal
        opened={printModalOpened}
        onClose={closePrintModal}
        quotationId={quotationId || ""}
        tenant={params.tenant || ""}
      />
    </Box>
  );
};

export default CreateOrUpdateQuotationPage;
