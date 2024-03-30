import currencyNumberFormat from "@/_app/common/utils/commaNumber";
import {
  MatchOperator,
  ProductDiscountMode,
  ProductInvoice,
  ProductInvoicesWithPagination,
  ProductItemReference,
  Vat,
  VatsWithPagination,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
  Button,
  Drawer,
  Flex,
  Group,
  Input,
  Modal,
  NumberInput,
  Paper,
  Select,
  Space,
  Table,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowsMaximize,
  IconBox,
  IconCalculator,
  IconCreditCard,
  IconDashboard,
  IconList,
  IconRefresh,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  calculateTaxAmount,
  getTotalProductsPrice,
  getTotalTaxAmount,
  getVatProfileSelectInputData,
} from "../purchases/create-purchase/utils/helpers";
import { SETTINGS_VAT_QUERY } from "../settings/pages/vat/utils/query";
import ClientSearchAutocomplete from "./components/ClientSearchAutocomplete";
import POSProductGlary from "./components/POSProductGalary";
import ProductSearchAutocomplete from "./components/ProductSearchAutocomplete";
import HoldAction from "./components/form-actions/HoldAction";
import PaymentForm from "./components/form-actions/PaymentForm";
import HoldList from "./components/pos-header/HoldList";
import { Pos_Hold_List } from "./utils/query.pos";
import { getDiscount, getSalesVat } from "./utils/utils.calc";
import { ProductItemReferenceWithStockQuantity } from "./utils/pos.types";
import { showNotification } from "@mantine/notifications";

const PosPage = () => {
  const [openedHoldModal, holdModalHandler] = useDisclosure();
  const [openedPaymentModal, paymentModalHandler] = useDisclosure();
  const [action, setAction] = useState<"ADD_TO_HOLD_LIST" | "PAYMENT">();
  const [selectedInvoice, setSelectedInvoice] = useState<ProductInvoice>();
  const params = useParams<{ tenant: string }>();

  // hold list data API
  const { data: holdList, refetch: refetchHoldList } = useQuery<{
    inventory__productInvoices: ProductInvoicesWithPagination;
  }>(Pos_Hold_List, {
    variables: {
      where: {
        limit: -1,
        filters: {
          key: "status",
          operator: MatchOperator.Eq,
          value: "HOLD",
        },
      },
    },
  });

  // fetch vat profiles
  const { data: vatProfile, loading: vatProfileLoading } = useQuery<{
    setup__vats: VatsWithPagination;
  }>(SETTINGS_VAT_QUERY, {
    variables: {
      where: { limit: -1 },
    },
  });

  const form = useForm<IPosFormType>({
    defaultValues: {
      discountMode: ProductDiscountMode.Amount,
      costAmount: 0,
    },
    resolver: yupResolver(Pos_Form_Validation_Schema),
    mode: "onChange",
  });

  const {
    control,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
    watch,
  } = form;

  const {
    append: appendProduct,
    fields: productFields,
    remove: removeProduct,
  } = useFieldArray({
    control,
    name: "products",
  });

  // handle add product to list
  function handleAddProductToList(
    productReference: ProductItemReferenceWithStockQuantity
  ) {
    // console.log({ productReference: watch('products') });
    const productCart: ProductItemReference[] = watch("products");
    const index = productCart?.findIndex(
      (item) => item.referenceId == productReference.referenceId
    );

    if (index == -1) {
      appendProduct({
        ...productReference,
        subAmount: productReference?.unitPrice * productReference?.quantity,
      });
    } else {
      const existingStock = watch(`products.${index}.quantity`);
      const newStock = productReference.stock || 0;
      if (existingStock >= newStock) {
        showNotification({
          message: "You can not add more of this item",
          color: "red",
        });
      } else {
        setValue(
          `products.${index}.quantity`,
          watch(`products.${index}.quantity`) + 1
        );
      }
    }
  }
  const discountMode = watch("discountMode") || ProductDiscountMode.Amount;
  const discountValue = watch("discountValue") || 0;
  const products = watch("products") || [];
  const costAmount = watch("costAmount") || 0;
  const taxRate = watch("taxRate") || 0;

  const productsPrice = getTotalProductsPrice(products);
  const discountAmount = getDiscount(
    discountMode,
    discountValue,
    productsPrice
  );
  const salesVatAmount = getSalesVat(
    costAmount + productsPrice - discountAmount,
    taxRate
  );

  const getNetAmount = () => {
    const sum = productsPrice - discountAmount + costAmount + salesVatAmount;

    return sum;
  };

  // prefill form
  useEffect(() => {
    if (selectedInvoice) {
      setValue("clientId", selectedInvoice?.client?._id as string);
      setValue("discountMode", selectedInvoice?.discountMode as string);
      setValue("discountValue", selectedInvoice?.discountAmount as number);
      setValue("costAmount", selectedInvoice?.costAmount as number);
      setValue("taxRate", selectedInvoice?.taxAmount ?? (0 as number));
      setValue("products", selectedInvoice?.products as ProductItemReference[]);
    }
  }, [selectedInvoice]);

  // submit pos form
  const onSubmitPOS = () => {
    if (action === "ADD_TO_HOLD_LIST") {
      holdModalHandler.open();
    } else {
      paymentModalHandler.open();
    }
  };

  return (
    <div>
      {/* Header */}
      <Flex
        className="px-3 pb-0 bg-white h-[70px] border-b-slate-100 border-b-[1px]"
        justify={"space-between"}
        align={"center"}
      >
        <div className="font-bold">
          <Flex>
            <Button
              variant="subtle"
              size="xs"
              component={Link}
              to={"/"}
              leftIcon={<IconDashboard size={16} />}
            >
              Dashboard
            </Button>
            <Button
              variant="subtle"
              size="xs"
              leftIcon={<IconList size={16} />}
              component={Link}
              to={`/${params?.tenant}/inventory-management/invoices`}
            >
              Sales List
            </Button>
            <Button
              variant="subtle"
              size="xs"
              leftIcon={<IconUsers size={16} />}
              component={Link}
              to={`/${params?.tenant}/people/client`}
            >
              Customer List
            </Button>
            <Button
              variant="subtle"
              size="xs"
              leftIcon={<IconBox size={16} />}
              component={Link}
              to={`/${params?.tenant}/inventory-management/products/products-list
						`}
            >
              Items List
            </Button>
            <Button
              variant="subtle"
              size="xs"
              leftIcon={<IconCalculator size={16} />}
              onClick={() =>
                reset({
                  clientId: "",
                  discountValue: 0,
                  discountMode: ProductDiscountMode.Amount,
                  taxRate: 0,
                  taxAmount: 0,
                  products: [],
                  costAmount: 0,
                })
              }
            >
              New Invoice
            </Button>
          </Flex>
        </div>
        <div className="flex items-center gap-3">
          <HoldList
            onSelectInvoice={setSelectedInvoice}
            holdList={holdList?.inventory__productInvoices?.nodes ?? []}
            onRefetchHoldList={refetchHoldList}
          />
          <IconArrowsMaximize
            onClick={() => {
              const elem = document.documentElement;
              elem?.requestFullscreen();
            }}
            color="grey"
            className="cursor-pointer"
          />
        </div>
      </Flex>
      <form onSubmit={handleSubmit(onSubmitPOS)} className="p-3">
        <div className="flex items-start gap-3">
          {/* Left Side */}
          <div className="lg:w-7/12">
            <Paper p={15} withBorder>
              <div className="grid grid-cols-2 gap-3 place-content-center">
                <ClientSearchAutocomplete
                  prefilledClientId={
                    watch("clientId") ?? selectedInvoice?.client?._id
                  }
                  onSelectClientId={(_id) => setValue("clientId", _id)}
                />

                <ProductSearchAutocomplete
                  formInstance={form}
                  onSelectProduct={handleAddProductToList}
                />
              </div>
              <Space h={20} />

              <Title order={5}>Product Items</Title>
              <Space h={5} />

              {Boolean(productFields?.length) && (
                <>
                  <Table withBorder withColumnBorders>
                    <thead className="bg-card-header">
                      <tr className="!p-2 rounded-md">
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Unit cost</th>
                        <th>Tax %</th>
                        <th>Tax Amount</th>
                        <th>Total cost</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {productFields?.map(
                        (product: ProductItemReference, idx: number) => (
                          <tr key={idx}>
                            <td className="font-medium">{product?.name}</td>
                            <td className="font-medium">
                              <NumberInput
                                w={100}
                                onChange={(v) =>
                                  setValue(
                                    `products.${idx}.quantity`,
                                    parseInt(v as string)
                                  )
                                }
                                min={1}
                                value={watch(`products.${idx}.quantity`)}
                              />
                            </td>
                            <td className="font-medium">
                              <NumberInput
                                w={100}
                                onChange={(v) =>
                                  setValue(
                                    `products.${idx}.unitPrice`,
                                    parseInt(v as string)
                                  )
                                }
                                min={1}
                                value={watch(`products.${idx}.unitPrice`)}
                              />
                            </td>
                            <td className="font-medium text-center">
                              {currencyNumberFormat(
                                watch(`products.${idx}.quantity`) *
                                  watch(`products.${idx}.unitPrice`)
                              )}
                            </td>
                            <td className="font-medium">
                              {product?.taxRate || 0}
                            </td>
                            <td className="font-medium">
                              {currencyNumberFormat(
                                calculateTaxAmount(watch(`products.${idx}`))
                              )}
                            </td>
                            <td className="font-medium">
                              {currencyNumberFormat(
                                calculateTaxAmount(watch(`products.${idx}`)) +
                                  watch(`products.${idx}.quantity`) *
                                    watch(`products.${idx}.unitPrice`)
                              )}
                            </td>
                            <td className="font-medium">
                              <ActionIcon
                                variant="filled"
                                color="red"
                                size={"sm"}
                                onClick={() => {
                                  removeProduct(idx);
                                }}
                              >
                                <IconX size={14} />
                              </ActionIcon>
                            </td>
                          </tr>
                        )
                      )}

                      <tr>
                        <td colSpan={5} className="font-semibold text-right">
                          Total
                        </td>
                        <td>{getTotalTaxAmount(watch("products") || [])}</td>
                        <td>
                          {currencyNumberFormat(
                            getTotalProductsPrice(watch("products")!)
                          )}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                  <Space h={50} />
                </>
              )}
            </Paper>

            <Space h={20} />

            <Paper p={15} withBorder>
              <div className="grid grid-cols-2 gap-3">
                {/* {JSON.stringify(errors, null, 2)} */}
                <div>
                  <Input.Wrapper
                    size="md"
                    error={<ErrorMessage name="discountType" errors={errors} />}
                  >
                    <Select
                      label="Discount Mode"
                      placeholder="Discount Mode"
                      size="md"
                      onChange={(e) => setValue("discountMode", e!)}
                      radius={0}
                      value={watch("discountMode")}
                      data={[
                        {
                          label: "Fixed",
                          value: ProductDiscountMode.Amount,
                        },
                        {
                          label: "Percentage (%)",
                          value: ProductDiscountMode.Percentage,
                        },
                      ]}
                    />
                  </Input.Wrapper>

                  <Space h={"sm"} />

                  <Input.Wrapper
                    size="md"
                    error={
                      <ErrorMessage name="transportCost" errors={errors} />
                    }
                  >
                    <NumberInput
                      label="Transport Cost"
                      size="md"
                      onChange={(e) =>
                        setValue("costAmount", parseInt(e as string))
                      }
                      defaultValue={watch("costAmount")}
                      min={0}
                      radius={0}
                      placeholder="Enter transport cost"
                    />
                  </Input.Wrapper>
                </div>
                <div>
                  <Input.Wrapper
                    size="md"
                    error={
                      <ErrorMessage name="discountAmount" errors={errors} />
                    }
                  >
                    <NumberInput
                      label="Discount"
                      radius={0}
                      size="md"
                      min={0}
                      defaultValue={watch("discountValue") || 0}
                      onChange={(e) =>
                        setValue("discountValue", parseInt(e as string))
                      }
                      placeholder="Enter discount"
                    />
                  </Input.Wrapper>

                  <Space h={"sm"} />

                  <Input.Wrapper
                    size="md"
                    error={<ErrorMessage name="invoiceTax" errors={errors} />}
                  >
                    <Select
                      label="Invoice Tax"
                      placeholder="Select tax type"
                      size="md"
                      radius={0}
                      disabled={vatProfileLoading}
                      defaultValue={watch("taxRate")?.toString()}
                      data={getVatProfileSelectInputData(
                        vatProfile?.setup__vats?.nodes as Vat[]
                      )}
                      onChange={(e) =>
                        setValue("taxRate", parseInt(e as string)!)
                      }
                    />
                  </Input.Wrapper>
                </div>
              </div>

              <Space h={"sm"} />

              <div className="p-3 text-xl font-bold text-center text-black bg-indigo-200 rounded-sm">
                Net Total: {currencyNumberFormat(getNetAmount())}
                BDT
              </div>

              <Space h={15} />

              {/* hold modal */}
              <Modal
                opened={openedHoldModal}
                onClose={holdModalHandler.close}
                title=""
              >
                <HoldAction
                  formData={
                    {
                      clientId: watch("clientId"),
                      products,
                      costAmount,

                      discountAmount,
                      discountPercentage: discountValue,
                      discountMode,

                      subTotal: productsPrice,
                      netTotal: getNetAmount(),

                      taxRate,
                      taxAmount: salesVatAmount,
                    }!
                  }
                  onSuccess={() => {
                    holdModalHandler.close();
                    reset({
                      clientId: "",
                      discountValue: 0,
                      discountMode: ProductDiscountMode.Amount,
                      taxRate: 0,
                      products: [],
                      costAmount: 0,
                    });
                    refetchHoldList();
                  }}
                />
              </Modal>

              {/* payment form */}
              <Drawer
                opened={openedPaymentModal}
                onClose={paymentModalHandler.close}
                title="Multiple payment to invoice"
                size={"lg"}
                position="right"
              >
                <PaymentForm
                  formData={{
                    clientId: watch("clientId"),
                    products,
                    costAmount,

                    discountAmount,
                    discountPercentage:
                      discountMode === ProductDiscountMode.Percentage
                        ? discountValue
                        : 0,
                    discountMode,

                    subTotal: productsPrice,
                    netTotal: getNetAmount(),

                    taxRate,
                    taxAmount: salesVatAmount,
                  }}
                  onSuccess={() => {
                    paymentModalHandler.close();
                    reset({
                      clientId: "",
                      discountMode: ProductDiscountMode.Amount,
                      discountValue: 0,
                      taxRate: 0,
                      products: [],
                      costAmount: 0,
                    });
                  }}
                  preMadeInvoiceId={selectedInvoice?._id}
                />
              </Drawer>

              <Group position="apart">
                <Button
                  size="md"
                  type="submit"
                  onClick={() => setAction("ADD_TO_HOLD_LIST")}
                  disabled={!watch("products")?.length || !watch("clientId")}
                >
                  Hold
                </Button>
                <Button
                  size="md"
                  type="submit"
                  leftIcon={<IconCreditCard size={16} />}
                  disabled={!watch("products")?.length || !watch("clientId")}
                >
                  Payment
                </Button>
                <Button
                  size="md"
                  onClick={() =>
                    reset({
                      clientId: "",
                      discountMode: ProductDiscountMode.Amount,
                      taxRate: 0,
                      taxAmount: 0,
                      products: [],
                      costAmount: 0,
                    })
                  }
                  leftIcon={<IconRefresh size={16} />}
                  color="red"
                >
                  Reset
                </Button>
              </Group>
            </Paper>
          </div>
          {/*  
          Right Side
          --------------------------
          */}
          <div className="lg:w-5/12">
            <POSProductGlary onSelectProduct={handleAddProductToList} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PosPage;

const Pos_Form_Validation_Schema = Yup.object().shape({
  clientId: Yup.string().required().label("Client"),
  products: Yup.array()
    .required()
    .min(1, "You must have to select at least one product")
    .label("Purchase products"),

  discountMode: Yup.string().optional().label("Discount type"),
  discountValue: Yup.number().optional().label("Discount value"), // amount, %
  // discountAmount: Yup.number().optional().label("Discount amount"),
  // discountPercentage: Yup.number().optional().label("Discount %"),

  costAmount: Yup.number().optional().label("Transport cost"),

  taxRate: Yup.number().optional().label("Tax rate"),
  taxAmount: Yup.number().optional().label("Tax amount"),
});

export type IPosFormType = Yup.InferType<typeof Pos_Form_Validation_Schema>;
