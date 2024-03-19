import currencyNumberFormat from "@/_app/common/utils/commaNumber";
import {
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
  Flex,
  Group,
  Input,
  NumberInput,
  Paper,
  Select,
  Space,
  Table,
  Title,
} from "@mantine/core";
import {
  IconCreditCard,
  IconDeviceFloppy,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { getDiscount, getSalesVat } from "./utils/utils.calc";

const PosPage = () => {
  // fetch vat profiles
  const { data: vatProfile, loading: vatProfileLoading } = useQuery<{
    setup__vats: VatsWithPagination;
  }>(SETTINGS_VAT_QUERY, {
    variables: {
      where: { limit: -1 },
    },
  });

  // const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const form = useForm<IPosFormType>({
    defaultValues: {
      discountAmount: 0,
      discountType: "Fixed",
      transportCost: 0,
      invoiceTax: 0,
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
  function handleAddProductToList(productReference: ProductItemReference) {
    const productCart: ProductItemReference[] = watch("products");
    const index = productCart?.findIndex(
      (item) => item.referenceId == productReference.referenceId
    );

    if (index == -1) {
      appendProduct(productReference);
    } else {
      setValue(
        `products.${index}.quantity`,
        watch(`products.${index}.quantity`) + 1
      );
    }
  }

  // submit pos form
  const onSubmitPOS = (values: IPosFormType) => {
    console.log(values);
  };

  return (
    <div>
      <Flex className="p-1 pb-0 bg-red-500 h-11">
        <p>POS Application</p>
      </Flex>

      <form onSubmit={handleSubmit(onSubmitPOS)}>
        <div className="flex items-start gap-3">
          {/* Left Side */}
          <div className="lg:w-7/12">
            <Paper p={15} withBorder>
              <div className="grid grid-cols-2 gap-3 place-content-center">
                <ClientSearchAutocomplete
                  formInstance={form}
                  contactNumber={watch("client")}
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
                      label="Discount Type"
                      placeholder="Fixed"
                      size="md"
                      onChange={(e) => setValue("discountType", e!)}
                      defaultValue={watch("discountType")}
                      radius={0}
                      data={["Fixed", "Percentage(%)"]}
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
                        setValue("transportCost", parseInt(e as string))
                      }
                      defaultValue={watch("transportCost")}
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
                      defaultValue={watch("discountAmount")}
                      onChange={(e) =>
                        setValue("discountAmount", parseInt(e as string))
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
                      defaultValue={watch("invoiceTax").toString()}
                      data={getVatProfileSelectInputData(
                        vatProfile?.setup__vats?.nodes as Vat[]
                      )}
                      onChange={(e) =>
                        setValue("invoiceTax", parseInt(e as string)!)
                      }
                    />
                  </Input.Wrapper>
                </div>
              </div>

              <Space h={"sm"} />

              <div className="p-3 text-xl font-bold text-center text-black bg-indigo-200 rounded-sm">
                Net Total:{" "}
                {currencyNumberFormat(
                  getTotalProductsPrice(watch("products")!) -
                    getDiscount(
                      watch("discountType"),
                      watch("discountAmount"),
                      getTotalProductsPrice(watch("products")!)
                    ) +
                    watch("transportCost") +
                    getSalesVat(
                      watch("transportCost") +
                        getTotalProductsPrice(watch("products")!) -
                        getDiscount(
                          watch("discountType"),
                          watch("discountAmount"),
                          getTotalProductsPrice(watch("products")!)
                        ),
                      watch("invoiceTax")
                    ) ?? 0
                ) ?? 0.0}{" "}
                BDT
              </div>

              <Space h={15} />

              <Group position="apart">
                <Button
                  size="md"
                  type="submit"
                  leftIcon={<IconDeviceFloppy size={16} />}
                >
                  Save
                </Button>
                <Button
                  size="md"
                  type="submit"
                  leftIcon={<IconCreditCard size={16} />}
                >
                  Save & Payment
                </Button>
                <Button
                  size="md"
                  onClick={() =>
                    reset({
                      brand: "",
                      client: "",
                      category: "",
                      discountAmount: 0,
                      discountType: "Fixed",
                      invoiceTax: 0,
                      products: [],
                      transportCost: 0,
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
  client: Yup.string().required().label("Client"),
  discountType: Yup.string().required().label("Discount type"),
  discountAmount: Yup.number().required().label("Discount amount"),
  transportCost: Yup.number().required().label("Transport cost"),
  invoiceTax: Yup.number().required().label("Invoice tax"),
  category: Yup.string().required().label("Category"),
  brand: Yup.string().required().label("Brand"),
  products: Yup.array()
    .required()
    .min(1, "You must have to select at least one product")
    .label("Purchase products"),
});

export type IPosFormType = Yup.InferType<typeof Pos_Form_Validation_Schema>;
