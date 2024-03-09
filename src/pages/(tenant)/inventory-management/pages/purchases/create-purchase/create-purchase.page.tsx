import { Notify } from "@/_app/common/Notification/Notify";
import {
  MatchOperator,
  Product,
  ProductItemReference,
  ProductTaxType,
  ProductsWithPagination,
  Supplier,
  SuppliersWithPagination,
  Vat,
  VatsWithPagination,
} from "@/_app/graphql-models/graphql";
import { PEOPLE_SUPPLIERS_QUERY } from "@/pages/(tenant)/people/pages/suppliers/utils/suppliers.query";

import { useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
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
import classNames from "classnames";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  calculateTaxAmount,
  getTotalCostAmount,
  getTotalProductsPrice,
  getTotalTaxAmount,
  getVatProfileSelectInputData,
} from "./utils/helpers";

import currencyNumberFormat from "@/_app/common/utils/commaNumber";
import { useNavigate, useParams } from "react-router-dom";
import { SETTINGS_VAT_QUERY } from "../../settings/pages/vat/utils/query";
import CreateProductForm from "./components/CreateProductForm";
import CreateSupplierForm from "./components/CreateSupplierForm";
import ProductsCardList from "./components/ProductsCardList";
import SummaryCard from "./components/SummaryCard";
import SuppliersCardList from "./components/SuppliersCardList";
import {
  CREATE_INVENTORY_PRODUCT_PURCHASE,
  PURCHASE_PRODUCT_LIST,
} from "./utils/products.query";
import {
  ICreatePurchaseFormState,
  Schema_Validation,
} from "./utils/validation";

const CreatePurchasePage = () => {
  const [productPage, onChangeProductPage] = useState(1);
  const [supplierPage, onChangeSupplierPage] = useState(1);
  const [openCreateProduct, createProductDrawerHandler] = useDisclosure();
  const [openCreateSupplier, createSupplierDrawerHandler] = useDisclosure();

  const navigate = useNavigate();

  const params = useParams<{ tenant: string }>();

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
            key: "price",
            operator: MatchOperator.Gte,
            value: `${0}`,
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
  } = useForm<ICreatePurchaseFormState>({
    defaultValues: {
      purchaseDate: new Date(),
      purchaseOrderDate: new Date(),
      // note: "",
      // products: [],
      // costs: [],
      // supplierId: "",
      // taxRate: 0,
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
    const price = product?.price || 0;
    const percentage = product.vat?.percentage || 0;

    // Check the product is already exits in productsFields
    const locationIndex = productFields.findIndex(
      (p) => p?.referenceId === product?._id
    );
    if (locationIndex == -1) {
      appendProduct({
        name: product.name,
        referenceId: product._id,
        quantity: 1,
        subAmount: price,
        unitPrice: price,
        netAmount: 0,
        taxAmount: (price * percentage) / 100,
        taxRate: product.vat?.percentage || 0,
        taxType: ProductTaxType.Inclusive,
      });
    } else {
      setValue(
        `products.${locationIndex}.quantity`,
        watch(`products.${locationIndex}.quantity`) + 1
      );
    }
  }

  const [createPurchaseProduct, { loading: creatingPurchase }] = useMutation(
    CREATE_INVENTORY_PRODUCT_PURCHASE,
    Notify({
      sucTitle: "Inventory product added to purchase",
      onSuccess(res) {
        const supplierId = watch("supplierId");
        const purchaseId = res?.inventory__createProductPurchase?._id;
        navigate(
          `/${params.tenant}/inventory-management/payments/create-purchase-payment?supplierId=${supplierId}&purchaseId=${purchaseId}`
        );
      },
    })
  );

  const onSubmit = (v: any) => {
    createPurchaseProduct({
      variables: {
        body: {
          ...v,
          taxAmount:
            ((getTotalProductsPrice(watch("products")!) +
              getTotalCostAmount(watch("costs")!)) *
              watch("taxRate")) /
            100,

          // Prices
          costAmount: getTotalCostAmount(watch("costs")!),
          subTotal:
            getTotalProductsPrice(watch("products")!) +
            getTotalCostAmount(watch("costs")!), // products.netAmount + costs.amount
          netTotal:
            getTotalProductsPrice(watch("products")!) +
            getTotalCostAmount(watch("costs")!) +
            ((getTotalProductsPrice(watch("products")!) +
              getTotalCostAmount(watch("costs")!)) *
              watch("taxRate")) /
              100, // subTotal + taxAmount
        },
      },
    });
  };

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
                        <td className="font-medium">{product?.taxRate || 0}</td>
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
              onChange={(v) => setValue("taxRate", parseInt(v!))}
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
              className={classNames(
                "relative p-2 mt-5 mb-2 rounded-sm bg-gray-100",
                {
                  "bg-gray-100": true,
                }
              )}
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
                  // {...register(`costs.${idx}.amount`, {
                  // 	valueAsNumber: true,
                  // })}
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

          <SummaryCard watch={watch} />
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
