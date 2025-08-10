import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback.ts";
import {
  CostItemReferenceInput,
  MatchOperator,
  Product,
  ProductItemReference,
  ProductPurchaseItemReferenceInput,
  ProductsWithPagination,
  Supplier,
  SuppliersWithPagination,
  Vat,
  VatsWithPagination,
} from "@/commons/graphql-models/graphql";
import { PEOPLE_SUPPLIERS_QUERY } from "@/pages/(tenant)/people/pages/suppliers/utils/suppliers.query";

import { useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
  Box,
  Button,
  Drawer,
  Flex,
  Input,
  NumberInput,
  Paper,
  Select,
  Space,
  Table,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconMinus, IconPlus, IconX } from "@tabler/icons-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { getVatProfileSelectInputData } from "./utils/helpers";

import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { SETTINGS_VAT_QUERY } from "../../settings/pages/vat/utils/query";
import CreateProductForm from "./components/CreateProductForm";
import CreateSupplierForm from "./components/CreateSupplierForm";
import ProductsCardList from "./components/ProductsCardList";
import SuppliersCardList from "./components/SuppliersCardList";
import {
  CREATE_INVENTORY_PRODUCT_PURCHASE,
  PURCHASE_PRODUCT_LIST,
} from "./utils/products.query";
import { Schema_Validation } from "./utils/validation";

const CreatePurchasePage = () => {
  const [productPage, onChangeProductPage] = useState(1);
  const [supplierPage, onChangeSupplierPage] = useState(1);
  const [openCreateProduct, createProductDrawerHandler] = useDisclosure();
  const [openCreateSupplier, createSupplierDrawerHandler] = useDisclosure();

  const navigate = useNavigate();

  const params = useParams<{ tenant: string }>();
  const [searchParams] = useSearchParams();

  const {
    data,
    loading: isFetchingSuppliers,
    refetch: refetchSuppliers,
  } = useQuery<{
    people__suppliers: SuppliersWithPagination;
  }>(PEOPLE_SUPPLIERS_QUERY, {
    variables: {
      where: {
        page: supplierPage,
        limit: 6,
      },
    },
  });

  const {
    data: productsData,
    loading: isFetchingProducts,
    refetch: refetchProducts,
  } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(PURCHASE_PRODUCT_LIST, {
    variables: {
      where: {
        page: productPage,
        limit: 12,

        filters: [
          {
            // key: "price",
            // operator: MatchOperator.Gte,
            // value: `${0}`,
            key: "_id",
            operator: MatchOperator.Eq,
            value: searchParams.get("productId"),
          },
        ],
      },
    },
  });

  const { data: vatProfile, loading: vatProfileLoading } = useQuery<{
    setup__vats: VatsWithPagination;
  }>(SETTINGS_VAT_QUERY, {
    variables: {
      where: { limit: -1 },
    },
  });

  // const {
  // 	register,
  // 	setValue,
  // 	formState: { errors },
  // 	control,
  // 	watch,
  // 	handleSubmit,
  // } = useForm<ICreatePurchaseFormState>({
  // 	// defaultValues: {
  // 	//   purchaseDate: new Date(),
  // 	//   purchaseOrderDate: new Date(),
  // 	//   note: "",
  // 	//   products: [],
  // 	//   costs: [],
  // 	//   supplierId: "",
  // 	//   taxRate: 0,
  // 	// },
  // 	resolver: yupResolver(Schema_Validation),
  // 	mode: 'onChange',
  // });
  const {
    register,
    setValue,
    formState: { errors },
    control,
    watch,
    handleSubmit,
    // } = useForm<ICreatePurchaseFormState>({
  } = useForm({
    defaultValues: {
      purchaseDate: new Date(),
      purchaseOrderDate: new Date(),
      // note: "",
      // products: [],
      // costs: [],
      // supplierId: "",
      taxRate: 0,
    },
    resolver: yupResolver(Schema_Validation),
    mode: "onChange",
  });

  const {
    append: appendProduct,
    fields: productFields,
    remove: removeProduct,
  } = useFieldArray({
    name: "products",
    control,
  });

  const {
    append: appendCosts,
    fields: costsFields,
    remove: removeCosts,
  } = useFieldArray({
    name: "costs",
    control,
  });

  function handleAddProductToList(product: Product) {
    const locationIndex = productFields.findIndex(
      (p) => p?.referenceId === product?._id
    );
    if (locationIndex == -1) {
      appendProduct({
        name: product.name || "",
        referenceId: product._id || "",
        code: product.code || "",
        unitPurchasePrice: product.purchasePrice || 0,
        quantity: 1,
      } satisfies ProductPurchaseItemReferenceInput);
    } else {
      setValue(
        `products.${locationIndex}.quantity`,
        watch(`products.${locationIndex}.quantity`) + 1
      );
    }
  }

  function getNetPurchasePriceAmount(
    products: ProductPurchaseItemReferenceInput[]
  ) {
    return products?.reduce(
      (total, current) =>
        total + (current.unitPurchasePrice ?? 0) * current.quantity,
      0
    );
  }

  function getTotalCostAmount(costs: CostItemReferenceInput[]) {
    return costs?.reduce((total, current) => total + current.amount, 0);
  }

  function getTotalTaxAmount(products: ProductPurchaseItemReferenceInput[]) {
    return products.reduce((total, current) => {
      const unitSellPrice = current.unitPurchasePrice || 0;
      const taxRate = watch("taxRate") || 0;
      const quantity = current.quantity || 0;
      return total + unitSellPrice * quantity * taxRate;
    }, 0);
  }

  function getSubtotal(products: ProductPurchaseItemReferenceInput[]) {
    return products.reduce((total, current) => {
      const unitPrice = current.unitPurchasePrice || 0;
      const quantity = current.quantity || 0;
      return total + unitPrice * quantity;
    }, 0);
  }

  function getNetTotal() {
    return (
      getSubtotal(watch("products") ?? []) +
      getTotalTaxAmount(watch("products") ?? []) +
      getTotalCostAmount(watch("costs") ?? [])
    );
  }

  const [createPurchaseProduct, { loading: creatingPurchase }] = useMutation(
    CREATE_INVENTORY_PRODUCT_PURCHASE,
    commonNotifierCallback({
      successTitle: "Inventory product added to purchase",
      onSuccess(res) {
        const supplierId = watch("supplierId");
        const purchaseId = res?.inventory__createProductPurchase?._id;
        navigate(
          `/${params.tenant}/inventory-management/payments/create-purchase-payment?supplierId=${supplierId}&purchaseId=${purchaseId}`
        );
      },
    })
  );

  const onSubmit = () => {
    createPurchaseProduct({
      variables: {
        body: {
          supplierId: watch("supplierId"),
          purchaseDate: watch("purchaseDate"),
          purchaseOrderDate: watch("purchaseOrderDate"),
          note: watch("note"),
          products: watch("products"),
          costs: watch("costs"),
          taxRate: watch("taxRate"),
        },
      },
    });
  };

  useEffect(() => {
    if (
      !isFetchingProducts &&
      typeof searchParams.get("productId") === "string" &&
      productsData?.inventory__products?.nodes &&
      productsData?.inventory__products?.nodes?.length > 0
    ) {
      handleAddProductToList(productsData.inventory__products.nodes[0]);
    }
  }, [isFetchingProducts]);

  return (
    <>
      <Drawer
        title="Create a supplier"
        opened={openCreateSupplier}
        onClose={() => createSupplierDrawerHandler.close()}
        closeOnEscape
        closeOnClickOutside
        withCloseButton
      >
        <CreateSupplierForm
          onClose={() => createSupplierDrawerHandler.close()}
          onRefetchSuppliers={() => refetchSuppliers()}
        />
      </Drawer>
      <Drawer
        title="Create a product"
        opened={openCreateProduct}
        onClose={() => createProductDrawerHandler.close()}
        closeOnEscape
        closeOnClickOutside
        withCloseButton
      >
        <CreateProductForm
          onClose={() => createProductDrawerHandler.close()}
          onRefetchProducts={() => refetchProducts()}
          vatProfiles={vatProfile?.setup__vats?.nodes as Vat[]}
        />
      </Drawer>

      <Paper radius={10} p={10}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex justify={"space-between"} align={"center"}>
            <div>
              <Title order={4}>
                Select supplier <span className="text-red-500">*</span>
              </Title>
              <Text color="red">{errors?.supplierId?.message}</Text>
            </div>

            <Button
              variant="light"
              leftIcon={<IconPlus />}
              onClick={() => createSupplierDrawerHandler.open()}
            >
              Add new
            </Button>
          </Flex>
          <Space h={"md"} />
          <SuppliersCardList
            isFetchingSuppliers={isFetchingSuppliers}
            setValue={setValue}
            suppliers={data?.people__suppliers?.nodes as Supplier[]}
            watch={watch}
            hasNextPage={data?.people__suppliers?.meta?.hasNextPage as boolean}
            supplierPage={supplierPage}
            onChangeSupplierPage={onChangeSupplierPage}
          />

          <Space h={"md"} />
          <Flex justify={"space-between"} align={"center"} mt={"lg"}>
            <div>
              <Title order={4}>
                Select product <span className="text-red-500">*</span>
              </Title>
              <Text color="red">{errors?.products?.message}</Text>
            </div>
            <Button
              variant="light"
              leftIcon={<IconPlus />}
              onClick={() => createProductDrawerHandler.open()}
            >
              Add new
            </Button>
          </Flex>
          <Space h={"md"} />

          {/* Product List to select */}
          <ProductsCardList
            isFetchingProducts={isFetchingProducts}
            handleAddProductToList={handleAddProductToList}
            productFields={productFields}
            products={productsData?.inventory__products?.nodes as Product[]}
            hasNextPage={
              productsData?.inventory__products?.meta?.hasNextPage as boolean
            }
            onChangeProductPage={onChangeProductPage}
            productPage={productPage}
          />

          <Space h={50} />

          <Title order={4}>Items</Title>
          <Space h={"md"} />

          {Boolean(productFields?.length) && (
            <>
              <Table withBorder withColumnBorders>
                <thead className="bg-card-header">
                  <tr className="!p-2 rounded-md">
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Unit purchase price</th>
                    <th>Cost</th>
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
                                `products.${idx}.unitPurchasePrice`,
                                parseInt(v as string)
                              )
                            }
                            min={1}
                            value={watch(`products.${idx}.unitPurchasePrice`)}
                          />
                        </td>
                        <td className="font-medium text-left">
                          {currencyNumberWithSymbolFormat(
                            watch(`products.${idx}.quantity`) *
                              watch(`products.${idx}.unitPurchasePrice`)
                          )}{" "}
                          BDT
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
                    <td colSpan={3} className="font-semibold text-right">
                      Total
                    </td>
                    <td>
                      {currencyNumberWithSymbolFormat(
                        getNetPurchasePriceAmount(watch("products")!)
                      )}{" "}
                      BDT
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
              <Space h={50} />
            </>
          )}
          <Input.Wrapper
            label="Purchase date"
            withAsterisk
            error={<ErrorMessage errors={errors} name={"purchaseDate"} />}
          >
            <DateInput
              onChange={(d) => setValue("purchaseDate", d!)}
              placeholder="Pick a date"
            />
          </Input.Wrapper>
          <Space h={"sm"} />
          <Input.Wrapper
            label="Purchase order date"
            withAsterisk
            error={<ErrorMessage errors={errors} name={`purchaseOrderDate`} />}
          >
            <DateInput
              onChange={(d) => setValue("purchaseOrderDate", d!)}
              placeholder="Pick a date"
            />
          </Input.Wrapper>
          <Space h={"sm"} />
          <Input.Wrapper
            label="Note"
            error={<ErrorMessage errors={errors} name={`note`} />}
          >
            <Textarea {...register("note")} placeholder="Write note" />
          </Input.Wrapper>
          <Space h={"sm"} />
          <Input.Wrapper
            withAsterisk
            label="Select VAT profile"
            error={<ErrorMessage errors={errors} name={`taxRate`} />}
          >
            <Select
              data={getVatProfileSelectInputData(
                vatProfile?.setup__vats?.nodes as Vat[]
              )}
              onChange={(value) => {
                const vatProfile = Number(value ?? 0) ?? 0;
                setValue("taxRate", vatProfile > 0 ? vatProfile / 100 : 0);
              }}
              placeholder="Select vat profile"
              disabled={vatProfileLoading}
            />
          </Input.Wrapper>

          <Space h={"xl"} />

          <Flex justify={"space-between"} align={"center"}>
            <Title order={4}>Extra cost</Title>
            <Button
              variant="light"
              leftIcon={<IconPlus />}
              onClick={() =>
                appendCosts({
                  amount: 0,
                  note: "",
                  name: "",
                })
              }
            >
              Add new
            </Button>
          </Flex>

          <Space h={"md"} />

          {costsFields?.map((_, idx) => (
            <div
              key={idx}
              className={clsx("relative p-2 mt-5 mb-2 rounded-sm bg-gray-100", {
                "bg-gray-100": true,
              })}
            >
              <ActionIcon
                color="red"
                size={"sm"}
                radius={100}
                variant="filled"
                className="absolute -top-2 -right-1"
                onClick={() => removeCosts(idx)}
              >
                <IconMinus size={16} />
              </ActionIcon>
              <Input.Wrapper
                label="Cost name"
                withAsterisk
                error={
                  <ErrorMessage errors={errors} name={`costs.${idx}.name`} />
                }
              >
                <Input
                  size="xs"
                  placeholder="Write cost name"
                  {...register(`costs.${idx}.name`)}
                />
              </Input.Wrapper>

              <Space h={"xs"} />
              <Input.Wrapper
                label="Cost amount"
                withAsterisk
                error={
                  <ErrorMessage errors={errors} name={`costs.${idx}.amount`} />
                }
              >
                <NumberInput
                  size="xs"
                  placeholder="Write cost amount"
                  onChange={(v) =>
                    setValue(`costs.${idx}.amount`, parseInt(v as string))
                  }
                  min={0}
                />
              </Input.Wrapper>
              <Space h={"xs"} />
              <Input.Wrapper
                label="Note"
                error={
                  <ErrorMessage errors={errors} name={`costs.${idx}.note`} />
                }
              >
                <Input
                  size="xs"
                  placeholder="Write cost note"
                  {...register(`costs.${idx}.note`)}
                />
              </Input.Wrapper>
            </div>
          ))}

          <Space h={50} />
          {/* Summary */}
          <Paper withBorder p={"sm"} mb={"xl"} w={"45%"}>
            <Flex justify={"space-between"}>
              <Text fw={"bold"}>Subtotal</Text>
              <Text>{getSubtotal(watch("products") ?? []) || 0} BDT</Text>
            </Flex>
            <Flex justify={"space-between"}>
              <Box>
                <Text fw={"bold"}>Tax ({watch("taxRate") * 100}%)</Text>
              </Box>
              <Box>
                <Text>
                  {currencyNumberWithSymbolFormat(
                    getTotalTaxAmount(watch("products") ?? [])
                  ) || 0}{" "}
                  BDT
                </Text>
              </Box>
            </Flex>
            <Flex justify={"space-between"}>
              <Text fw={"bold"}>Cost Amount</Text>
              <Text>{getTotalCostAmount(watch("costs") ?? []) || 0} BDT</Text>
            </Flex>
            <Flex justify={"space-between"}>
              <Text fw={"bold"}>Total Bill</Text>
              <Text>{getNetTotal() || 0} BDT</Text>
            </Flex>
          </Paper>
          <Space h={10} />
          <Button type="submit" loading={creatingPurchase} fullWidth>
            Submit
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default CreatePurchasePage;
