import {
  ProductDiscountMode,
  ProductItemReference,
  VatsWithPagination,
} from "@/commons/graphql-models/graphql";
import {
  currencyNumberFormat,
  currencyNumberWithSymbolFormat,
} from "@/commons/utils/commaNumber";
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
  NumberInput,
  Paper,
  Select,
  Space,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconBox,
  IconCalculator,
  IconCreditCard,
  IconDashboard,
  IconList,
  IconRefresh,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import * as Yup from "yup";
import { SETTINGS_VAT_QUERY } from "../settings/pages/vat/utils/query";
import ClientSearchAutocomplete from "./components/ClientSearchAutocomplete";
import POSProductGallery from "./components/POSProductGalary";
import ProductSearchAutocomplete from "./components/ProductSearchAutocomplete";
import PaymentForm from "./components/form-actions/PaymentForm";
import { ProductItemReferenceWithStockQuantity } from "./utils/pos.types";
import { getPercentageAmount } from "./utils/utils.calc";
import PrintableFullInvoice from "@/commons/components/invoice/PrintableFullInvoice";

const PosPage = () => {
  // const [openedHoldModal, holdModalHandler] = useDisclosure();
  const params = useParams<{ tenant: string }>();
  const [openedPaymentModal, paymentModalHandler] = useDisclosure();
  const [action, setAction] = useState<"ADD_TO_HOLD_LIST" | "PAYMENT">();
  const [createdInvoiceId, setCreatedInvoiceId] = useState<string>();
  // const [successFullpaymentInvoiceId, setSuccessFullpaymentInvoiceId] =
  //   useState<string>();
  // Note: This is for hold list
  // const [selectedInvoice, setSelectedInvoice] = useState<ProductInvoice>();

  // hold list data API
  // const { data: holdList, refetch: refetchHoldList } = useQuery<{
  //   inventory__productInvoices: ProductInvoicesWithPagination;
  // }>(Pos_Hold_List, {
  //   variables: {
  //     where: {
  //       limit: -1,
  //       filters: {
  //         key: "status",
  //         operator: MatchOperator.Eq,
  //         value: "HOLD",
  //       },
  //     },
  //   },
  // });

  // fetch vat profiles
  const { data: vatProfile, loading: vatProfileLoading } = useQuery<{
    setup__vats: VatsWithPagination;
  }>(SETTINGS_VAT_QUERY, {
    variables: {
      where: { limit: -1 },
    },
  });

  const form = useForm({
    defaultValues: {
      discountValue: 0,
      invoiceDiscountMode: ProductDiscountMode.Percentage,
    } as IPosFormType,
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
    const productCart: ProductItemReference[] = watch("products");

    const index = productCart?.findIndex(
      (item) => item.referenceId == productReference.referenceId
    );

    if (index == -1) {
      appendProduct({
        referenceId: productReference?.referenceId || "",
        code: productReference?.code || "",
        name: productReference?.name || "",
        quantity: 1,
        unitPrice: productReference?.unitPrice || 0,
        unitSellPrice: productReference?.unitSellPrice || 0,
        unitPurchasePrice: productReference?.unitPurchasePrice || 0,
        taxAmount: productReference?.taxAmount || 0,
        taxRate: productReference?.taxRate || 0,
      });
    } else {
      const existingStock = watch(`products.${index}.quantity`);
      const newStock = productReference.stock || 0;

      if (
        existingStock >= newStock &&
        !productReference.isSellableWithoutStock
      ) {
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

  const getNetSellPrice = () => {
    const products = watch("products") || [];
    return (
      products
        ?.map((p: ProductItemReference) => {
          const unitSellPrice = p?.unitSellPrice || 0;
          const quantity = p?.quantity || 0;
          return unitSellPrice * quantity;
        })
        .reduce((a, b) => a + b, 0) || 0
    );
  };

  const getNetSubtotal = () => {
    const products = watch("products") || [];
    return (
      products
        ?.map((p: ProductItemReference) => {
          const unitPrice = p?.unitPrice || 0;
          const quantity = p?.quantity || 0;
          return unitPrice * quantity;
        })
        .reduce((a, b) => a + b, 0) || 0
    );
  };

  const getNetSubtotalDiscount = () => {
    return (
      watch("products")
        ?.map((p: ProductItemReference) => {
          const unitSellPrice = p?.unitSellPrice || 0;
          const unitPrice = p?.unitPrice || 0;
          const quantity = p?.quantity || 0;
          return (unitPrice - unitSellPrice) * quantity || 0;
        })
        .reduce((a, b) => a + b, 0) || 0
    );
  };

  const getNetExtraDiscount = () => {
    if (watch("invoiceDiscountMode") === ProductDiscountMode.Amount) {
      return watch("discountValue") || 0;
    }

    if (watch("invoiceDiscountMode") === ProductDiscountMode.Percentage) {
      const netSellPrice =
        watch("products")
          ?.map((p: ProductItemReference) => {
            const unitSellPrice = p?.unitSellPrice || 0;
            const quantity = p?.quantity || 0;
            return unitSellPrice * quantity;
          })
          .reduce((a, b) => a + b, 0) || 0;
      return (watch("discountValue") || 0) * (netSellPrice / 100);
    }

    return 0;
  };

  const getNetTaxAmount = () => {
    return (
      watch("products")
        ?.map((p) => {
          return p.unitSellPrice * p.quantity * p.taxRate || 0;
        })
        .reduce((a, b) => a + b, 0) || 0
    );
  };

  const invoiceNetTotal = () => {
    return getNetSellPrice() + getNetTaxAmount() - getNetExtraDiscount();
  };

  // Note: This is for hold list
  // prefill form
  // useEffect(() => {
  //   if (selectedInvoice) {
  //     setValue("clientId", selectedInvoice?.client?._id as string);
  //     setValue(
  //       "invoiceDiscountMode",
  //       selectedInvoice?.invoiceDiscountMode ?? ProductDiscountMode.Percentage
  //     );
  //     setValue("discountValue", selectedInvoice?.netDiscountAmount ?? 0);
  //     setValue("costAmount", selectedInvoice?.costAmount as number);
  //     setValue("products", selectedInvoice?.products as ProductItemReference[]);
  //   }
  // }, [selectedInvoice, setValue]);

  // submit pos form
  const onSubmitPOS = () => {
    if (action === "ADD_TO_HOLD_LIST") {
      // holdModalHandler.open();
    } else {
      paymentModalHandler.open();
    }
  };

  return (
    <div>
      {/* Header */}
      <Flex
        className="px-3 pb-0 h-[45px] border-b"
        justify={"space-between"}
        align={"center"}
      >
        <div className="font-bold">
          <Flex>
            <Button
              variant="subtle"
              color="accent"
              component={Link}
              to={"/"}
              leftIcon={<IconDashboard size={16} />}
            >
              Dashboard
            </Button>
            <Button
              variant="subtle"
              color="accent"
              leftIcon={<IconList size={16} />}
              component={Link}
              to={`/${params?.tenant}/inventory-management/invoices`}
            >
              Sales List
            </Button>
            <Button
              variant="subtle"
              color="accent"
              leftIcon={<IconUsers size={16} />}
              component={Link}
              to={`/${params?.tenant}/people/client`}
            >
              Customer List
            </Button>
            <Button
              variant="subtle"
              color="accent"
              leftIcon={<IconBox size={16} />}
              component={Link}
              to={`/${params?.tenant}/inventory-management/products/products-list
						`}
            >
              Items List
            </Button>
            <Button
              variant="subtle"
              color="accent"
              leftIcon={<IconCalculator size={16} />}
              onClick={() =>
                reset({
                  clientId: "",
                  discountValue: 0,
                  invoiceDiscountMode: ProductDiscountMode.Amount,
                  netTaxAmount: 0,
                  products: [],
                  costAmount: 0,
                })
              }
            >
              New Invoice
            </Button>
          </Flex>
        </div>
        {/* <div className="flex items-center gap-3">
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
        </div> */}
      </Flex>
      <form onSubmit={handleSubmit(onSubmitPOS)}>
        <div className="flex items-start gap-3">
          {/* Left Side */}
          <div className="lg:w-7/12">
            <Paper p={8} withBorder>
              <div className="grid grid-cols-2 gap-3 place-content-center">
                <ClientSearchAutocomplete
                  prefilledClientId={
                    watch("clientId")
                    // watch("clientId") ?? selectedInvoice?.client?._id
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
                        <th>Sell Price</th>
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
                            <td data-name="name" className="font-medium">
                              {product?.name}
                            </td>
                            <td data-name="quantity" className="font-medium">
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
                            <td
                              data-name="unitSellPrice"
                              className="font-medium"
                            >
                              <NumberInput
                                w={100}
                                onChange={(v) =>
                                  setValue(
                                    `products.${idx}.unitSellPrice`,
                                    parseInt(v as string)
                                  )
                                }
                                min={1}
                                value={watch(`products.${idx}.unitSellPrice`)}
                              />

                              <p className="mt-1 text-xs">
                                Purchase Price:{" "}
                                {currencyNumberFormat(
                                  watch(`products.${idx}.unitPurchasePrice`) ||
                                    0
                                )}
                              </p>
                            </td>
                            <td
                              data-name="unit-cost"
                              className="font-medium text-center"
                            >
                              {currencyNumberFormat(
                                watch(`products.${idx}.unitSellPrice`) *
                                  watch(`products.${idx}.quantity`)
                              )}
                            </td>
                            <td
                              data-name="tax-rate"
                              className="font-medium w-[150px]"
                            >
                              <Select
                                data={
                                  vatProfile?.setup__vats.nodes?.map((v) => ({
                                    label: `${v.name} (${v.percentage}%)`,
                                    value: v.percentage.toString(),
                                  })) || []
                                }
                                value={(
                                  watch(`products.${idx}.taxRate`) * 100
                                ).toString()}
                                onChange={(v) => {
                                  const rateP = parseFloat(v!) || 0;
                                  const rate = rateP / 100 || 0;
                                  setValue(`products.${idx}.taxRate`, rate);
                                }}
                                placeholder="Select vat profile"
                                disabled={vatProfileLoading}
                              />
                            </td>
                            <td data-name="tax-amount" className="font-medium">
                              {currencyNumberWithSymbolFormat(
                                watch(`products.${idx}.unitSellPrice`) *
                                  watch(`products.${idx}.quantity`) *
                                  watch(`products.${idx}.taxRate`)
                              ) || 0}{" "}
                            </td>
                            <td data-name="total-cost" className="font-medium">
                              {currencyNumberWithSymbolFormat(
                                watch(`products.${idx}.unitSellPrice`) *
                                  watch(`products.${idx}.quantity`) +
                                  getPercentageAmount(
                                    watch(`products.${idx}.unitSellPrice`) *
                                      watch(`products.${idx}.quantity`),
                                    watch(`products.${idx}.taxRate`) * 100
                                  )
                              ) || 0}{" "}
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
                    </tbody>
                  </Table>
                  <Space h={50} />
                </>
              )}
            </Paper>

            <Space h={20} />

            <Paper p={15} withBorder>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input.Wrapper
                    size="md"
                    error={<ErrorMessage name="discountType" errors={errors} />}
                  >
                    <Select
                      label="Discount Mode"
                      placeholder="Discount Mode"
                      size="md"
                      onChange={(e) => setValue("invoiceDiscountMode", e!)}
                      radius={0}
                      value={watch("invoiceDiscountMode")}
                      data={[
                        {
                          label: "Fixed Amount",
                          value: ProductDiscountMode.Amount,
                        },
                        {
                          label: "Percentage (%)",
                          value: ProductDiscountMode.Percentage,
                        },
                      ]}
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
                </div>
              </div>

              <Space h={"sm"} />

              <Paper withBorder p={"sm"} mb={"xl"}>
                <Flex justify={"space-between"}>
                  <Text fw={"bold"}>Sub total</Text>
                  <Text>
                    {currencyNumberWithSymbolFormat(getNetSubtotal())}
                  </Text>
                </Flex>
                <Flex justify={"space-between"}>
                  <Text fw={"bold"}>Sell price</Text>
                  <Text>
                    {currencyNumberWithSymbolFormat(getNetSellPrice())}
                  </Text>
                </Flex>
                <Flex justify={"space-between"}>
                  <Text fw={"bold"}>Sub total discount</Text>
                  <Text>
                    {currencyNumberWithSymbolFormat(getNetSubtotalDiscount())}
                  </Text>
                </Flex>
                <Flex justify={"space-between"}>
                  <Text fw={"bold"}>Extra discount</Text>
                  <Text>
                    {currencyNumberWithSymbolFormat(getNetExtraDiscount())}
                  </Text>
                </Flex>

                <Flex justify={"space-between"}>
                  <Text fw={"bold"}>Tax amount</Text>
                  <Text>
                    {currencyNumberWithSymbolFormat(getNetTaxAmount())}
                  </Text>
                </Flex>

                {/* const sum = productsPrice - discountAmount + costAmount + salesVatAmount; */}

                <Space h={"sm"} />
                <div className="flex justify-between p-3 text-xl font-bold text-center rounded-sm bg-primary-50 text-primary-foreground">
                  <div>Net Total (SellPrice + Tax - Discount)</div>{" "}
                  <div>{currencyNumberWithSymbolFormat(invoiceNetTotal())}</div>
                </div>
              </Paper>

              <Space h={15} />

              {/* hold modal */}
              {/* <Modal
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
                      discountValue,
                      discountMode,

                      subTotal: productsPrice,
                      netTotal: getNetAmount(),

                      taxRate,
                      taxAmount: salesVatAmount,
                    }!
                  }
                  onSuccess={() => {
                    holdModalHandler.close();
                    refetchHoldList();
                    reset({
                      clientId: "",
                      discountValue: 0,
                      discountMode: ProductDiscountMode.Amount,
                      taxRate: 0,
                      products: [],
                      costAmount: 0,
                    });
                  }}
                />
              </Modal> */}

              <Group position="apart">
                {/* <Button
                  size="md"
                  type="submit"
                  onClick={() => setAction("ADD_TO_HOLD_LIST")}
                  disabled={!watch("products")?.length || !watch("clientId")}
                >
                  Hold
                </Button> */}
                <Button
                  size="md"
                  type="submit"
                  leftIcon={<IconCreditCard size={16} />}
                  onClick={() => setAction("PAYMENT")}
                  disabled={!watch("products")?.length || !watch("clientId")}
                >
                  Proceed order
                </Button>
                <Button
                  size="md"
                  onClick={() =>
                    reset({
                      clientId: "",
                      invoiceDiscountMode: ProductDiscountMode.Amount,
                      netTaxAmount: 0,
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
            <POSProductGallery onSelectProduct={handleAddProductToList} />
          </div>
        </div>
      </form>

      {/* payment form */}
      <Drawer
        opened={openedPaymentModal}
        onClose={paymentModalHandler.close}
        title="Proceed order"
        size={"lg"}
        position="right"
      >
        <PaymentForm
          formData={{
            clientId: watch("clientId"),
            products: watch("products"),
            discountValue: watch("discountValue"),
            invoiceDiscountMode: watch("invoiceDiscountMode"),
            invoiceDiscountPercentage:
              watch("invoiceDiscountMode") === ProductDiscountMode.Percentage
                ? watch("discountValue")
                : 0,
            costAmount: watch("costAmount"),
            netTaxAmount: getNetTaxAmount(),
            invoiceNetTotalBill: invoiceNetTotal(),
          }}
          onSuccess={({ invoiceId }) => {
            paymentModalHandler.close();
            setCreatedInvoiceId(invoiceId);
            console.log({ invoiceId });
            reset({
              clientId: "",
              invoiceDiscountMode: ProductDiscountMode.Amount,
              discountValue: 0,
              products: [],
              costAmount: 0,
            });
          }}
          // Note: This is for hold list
          // preMadeInvoiceId={selectedInvoice?._id}
          onRefetchHoldList={() => {
            // Note: This is for hold list
            // refetchHoldList();
          }}
        />
      </Drawer>
      <Drawer
        opened={Boolean(createdInvoiceId)}
        onClose={() => setCreatedInvoiceId("")}
        title="Print Invoice"
        size={"100%"}
        position="right"
      >
        {createdInvoiceId && (
          <PrintableFullInvoice
            invoiceId={createdInvoiceId}
            tenant={params.tenant ?? ""}
          />
        )}
      </Drawer>
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

  invoiceDiscountMode: Yup.string().default("").label("Discount type"),
  discountValue: Yup.number().default(0).label("Discount value"), // amount, %

  costAmount: Yup.number().default(0).label("Transport cost"),
  netTaxAmount: Yup.number().default(0).label("Tax amount"),
});

export type IPosFormType = Yup.InferType<typeof Pos_Form_Validation_Schema>;
