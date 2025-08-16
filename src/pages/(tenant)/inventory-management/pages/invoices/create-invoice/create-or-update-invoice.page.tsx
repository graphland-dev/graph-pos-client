import {
  Client,
  ClientsWithPagination,
  CreateProductInvoiceInput,
  UpdateProductInvoiceInput,
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
  Box,
  Button,
  Card,
  Drawer,
  Group,
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
import { IconArrowLeft, IconEye, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import * as yup from "yup";
import { INVENTORY_PRODUCTS_LIST_QUERY } from "../../products/products-list/utils/product.query";
import {
  CREATE_PRODUCT_INVOICE_MUTATION,
  UPDATE_PRODUCT_INVOICE_MUTATION,
  INVENTORY_PRODUCT_INVOICE_QUERY,
} from "../utils/query.invoices";
import {
  ClientsCardList,
  CreateClientForm,
  CreateProductForm,
  ProductsCardList,
} from "../../../shared/components";
import InvoicePrintModal from "@/commons/components/invoice/InvoicePrintModal";
import { Printer } from "lucide-react";

const invoiceSchema = yup.object({
  clientId: yup.string().required("Please select a client"),
  date: yup.date().required("Date is required"),
  note: yup.string().default(""),
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

type IFormData = yup.InferType<typeof invoiceSchema>;

const CreateOrUpdateInvoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ tenant: string; invoiceId?: string }>();

  const invoiceId = params.invoiceId;
  const isEditMode = !!invoiceId && location.pathname.includes("/edit");

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
  const [printModalOpened, { open: openPrintModal, close: closePrintModal }] =
    useDisclosure(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
    trigger,
  } = useForm<IFormData>({
    resolver: yupResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      date: new Date(),
      note: "",
      products: [],
      discountMode: ProductDiscountMode.Amount,
      discountValue: 0,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "products",
  });

  // Fetch existing invoice data if in edit mode
  useQuery(INVENTORY_PRODUCT_INVOICE_QUERY, {
    variables: {
      where: {
        key: "_id",
        operator: "eq",
        value: invoiceId,
      },
    },
    skip: !isEditMode,
    onCompleted: (data) => {
      if (data.inventory__productInvoice) {
        const invoice = data.inventory__productInvoice;
        reset({
          clientId: invoice.client?._id || "",
          date: new Date(invoice.date),
          note: invoice.note || "",
          products: invoice.products || [],
          discountMode:
            invoice.invoiceDiscountMode || ProductDiscountMode.Amount,
          discountValue:
            invoice.invoiceDiscountMode === ProductDiscountMode.Percentage
              ? invoice.invoiceDiscountPercentage || 0
              : invoice.invoiceDiscountAmount || 0,
        });
        setSelectedClient(invoice.client);
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

  const [createInvoice, { loading: creating }] = useMutation(
    CREATE_PRODUCT_INVOICE_MUTATION,
    {
      onCompleted: (data) => {
        showNotification({
          title: "Success",
          message: "Invoice created successfully",
          color: "green",
        });
        // Navigate to new invoice details page
        const newInvoiceId = data?.inventory__createProductInvoice?._id;
        if (newInvoiceId) {
          navigate(
            `/${params.tenant}/inventory-management/invoices/${newInvoiceId}`
          );
        } else {
          navigate(`/${params.tenant}/inventory-management/invoices`);
        }
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

  const [updateInvoice, { loading: updating }] = useMutation(
    UPDATE_PRODUCT_INVOICE_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Invoice updated successfully",
          color: "green",
        });
        // Navigate back to details page
        navigate(
          `/${params.tenant}/inventory-management/invoices/${invoiceId}`
        );
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

  const watchedProducts = watch("products");
  const watchedDiscountMode = watch("discountMode");
  const watchedDiscountValue = watch("discountValue");
  const watchedClientId = watch("clientId");
  const watchedDate = watch("date");
  const watchedNote = watch("note");

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
        unitPrice: product.price || 0,
        unitSellPrice: product.price || 0,
        quantity: 1,
        taxRate: 0,
      });
    }
    closeProductDrawer();
  };

  const handleQuantityChange = async (index: number, quantity: number) => {
    setValue(`products.${index}.quantity`, quantity);
    await trigger(`products.${index}.quantity`);
  };

  const handleUnitPriceChange = async (
    index: number,
    unitSellPrice: number
  ) => {
    setValue(`products.${index}.unitSellPrice`, unitSellPrice);
    await trigger(`products.${index}.unitSellPrice`);
  };

  const calculateTotals = () => {
    const products = watchedProducts || [];
    const subTotal = products.reduce((sum, product) => {
      const productTotal =
        (product.unitSellPrice || 0) * (product.quantity || 0);
      return sum + productTotal;
    }, 0);
    const discountAmount =
      watchedDiscountMode === ProductDiscountMode.Percentage
        ? (subTotal * (watchedDiscountValue || 0)) / 100
        : watchedDiscountValue || 0;
    const netTotal = subTotal - discountAmount;

    return {
      subTotal,
      discountAmount,
      netTotal,
      itemCount: products.length,
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

    const baseInput = {
      clientId: data.clientId,
      date: data.date,
      note: data.note,
      products:
        data?.products?.map((product) => ({
          referenceId: product.referenceId,
          name: product.name,
          code: product.code,
          unitPrice: product.unitPrice || 0,
          quantity: product.quantity,
          unitSellPrice: product.unitSellPrice || 0,
          taxRate: product.taxRate || 0,
        })) ?? [],
      invoiceDiscountMode: data.discountMode,
      invoiceDiscountAmount:
        data.discountMode === ProductDiscountMode.Amount
          ? data.discountValue || 0
          : totals.discountAmount,
      invoiceDiscountPercentage:
        data.discountMode === ProductDiscountMode.Percentage
          ? data.discountValue || 0
          : 0,
    };

    if (isEditMode && invoiceId) {
      // Update existing invoice
      const updateInput: UpdateProductInvoiceInput = baseInput;
      updateInvoice({
        variables: {
          invoiceId: invoiceId,
          input: updateInput,
        },
      });
    } else {
      // Create new invoice
      const createInput: CreateProductInvoiceInput = baseInput;
      createInvoice({
        variables: {
          input: createInput,
        },
      });
    }
  };

  const totals = calculateTotals();

  return (
    <Box p="md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {isEditMode && (
            <Button
              variant="subtle"
              size="sm"
              leftIcon={<IconArrowLeft size={16} />}
              onClick={() =>
                navigate(
                  `/${params.tenant}/inventory-management/invoices/${invoiceId}`
                )
              }
            >
              Back to Details
            </Button>
          )}
          <Title order={2}>
            {isEditMode ? "Edit Invoice" : "Create Invoice"}
          </Title>
        </div>
        {isEditMode && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<IconEye size={16} />}
              onClick={() =>
                navigate(
                  `/${params.tenant}/inventory-management/invoices/${invoiceId}`
                )
              }
            >
              Details View
            </Button>
            <Button
              variant="outline"
              leftIcon={<Printer size={16} />}
              onClick={openPrintModal}
            >
              Print Preview
            </Button>
          </div>
        )}
      </div>

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
                  <ActionIcon
                    color="red"
                    onClick={() => {
                      setSelectedClient(null);
                      setValue("clientId", "");
                    }}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={openClientDrawer}
                  fullWidth
                  color={errors.clientId ? "red" : undefined}
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
                Invoice Details
              </Title>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DateInput
                  label="Date"
                  value={watchedDate}
                  onChange={(date) => setValue("date", date || new Date())}
                  error={<ErrorMessage errors={errors} name="date" />}
                  required
                />
              </div>

              <Space h="md" />

              <Textarea
                label="Notes"
                placeholder="Additional notes for the invoice..."
                value={watchedNote}
                onChange={(e) => setValue("note", e.currentTarget.value)}
                rows={3}
              />
            </Card>

            {/* Products Section */}
            <Card withBorder p="md">
              <div className="flex items-center justify-between mb-4">
                <Title order={4}>Products</Title>
                <Button onClick={openProductDrawer}>Add Product</Button>
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
                              value={
                                watchedProducts?.[index]?.unitSellPrice || 0
                              }
                              onChange={(value) =>
                                handleUnitPriceChange(index, value || 0)
                              }
                              min={0}
                              precision={2}
                              size="sm"
                            />
                          </div>
                        </td>
                        <td>
                          <NumberInput
                            value={watchedProducts?.[index]?.quantity || 0}
                            onChange={(value) =>
                              handleQuantityChange(index, value || 0)
                            }
                            min={1}
                            size="sm"
                          />
                        </td>
                        <td>
                          <Text weight={500}>
                            {currencyNumberWithSymbolFormat(
                              (watchedProducts?.[index]?.unitSellPrice || 0) *
                                (watchedProducts?.[index]?.quantity || 0)
                            )}
                          </Text>
                        </td>
                        <td>
                          <ActionIcon color="red" onClick={() => remove(index)}>
                            <IconX size={16} />
                          </ActionIcon>
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
                Invoice Summary
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
                      value={watchedDiscountMode}
                      onChange={(value) =>
                        setValue("discountMode", value as ProductDiscountMode)
                      }
                      style={{ width: 80 }}
                      size="sm"
                    />
                    <NumberInput
                      value={watchedDiscountValue}
                      onChange={(value) =>
                        setValue("discountValue", value || 0)
                      }
                      min={0}
                      max={
                        watchedDiscountMode === ProductDiscountMode.Percentage
                          ? 100
                          : undefined
                      }
                      precision={
                        watchedDiscountMode === ProductDiscountMode.Amount
                          ? 2
                          : 0
                      }
                      placeholder="0"
                      style={{ flex: 1 }}
                      size="sm"
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
                <Button
                  type="submit"
                  loading={creating || updating}
                  disabled={fields.length === 0 || !watchedClientId}
                >
                  {isEditMode ? "Update Invoice" : "Create Invoice"}
                </Button>
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
          onSuccess={(client: Client) => {
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
          onSuccess={(product: Product) => {
            handleProductSelect(product);
            closeCreateProduct();
          }}
          onCancel={closeCreateProduct}
        />
      </Drawer>

      {/* Print Preview Modal */}
      {isEditMode && (
        <InvoicePrintModal
          opened={printModalOpened}
          onClose={closePrintModal}
          invoiceId={invoiceId || ""}
          tenant={params.tenant || ""}
        />
      )}
    </Box>
  );
};

export default CreateOrUpdateInvoicePage;
