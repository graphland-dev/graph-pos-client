import {
  MatchOperator,
  Maybe,
  Product,
  ProductsWithPagination,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import {
  Button,
  Checkbox,
  Flex,
  Input,
  NumberInput,
  Paper,
  Select,
  Space,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Barcode from "react-jsbarcode";
import { INVENTORY_PRODUCTS_LIST_QUERY } from "../products-list/utils/product.query";
// import JsBarcode from "jsbarcode";
import PageTitle from "@/_app/common/PageTitle";
import { Generate_Barcode_Type } from "@/_app/models/barcode.type";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPrinter, IconTrash } from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import * as yup from "yup";

interface IProduct {
  productCode: string;
  barcodeType: string;
  quantity: number;
  productName: string;
  productPrice: number;
}

interface IProductData {
  value: Maybe<string> | undefined;
  label: string;
}

const BarcodePage = () => {
  const {
    // setValue,
    // handleSubmit,
   
    formState: { errors },
  } = useForm({
    resolver: yupResolver(barcodeValidationSchema),
    defaultValues: {
      productCode: "",
      barcodeType: Generate_Barcode_Type.Code128,
      quantity: 30,
      barcodeProductName: "",
      barcodePrice: 0.0,
    },
  });

  const [productName, setProductName] = useState("");
  const [showProductNames, setShowProductNames] = useState(false);

  const [product, setProduct] = useState<IProduct>({
    productCode: "",
    barcodeType: "",
    quantity: 1,
    productName: "",
    productPrice: 0,
  });

  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [isShowProductPrice, setIsShowProductPrice] = useState(false);
  const [isShowProductName, setIsShowProductName] = useState(false);

  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current!,
  });

  const { data, refetch } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(INVENTORY_PRODUCTS_LIST_QUERY, {
    variables: {
      where: {
        filters: [
          {
            key: "name",
            operator: MatchOperator.Contains,
            value: productName,
          },
        ],
      },
    },
    skip: !productName,
  });

  const productsDropdown = useMemo<IProductData[] | undefined>(
    () =>
      data?.inventory__products.nodes?.map((item: Product) => ({
        value: item?.code,
        label: `${item?.name}`,
      })),
    [data?.inventory__products.nodes]
  );


  const getProductByCode = (code: string) => {
    return data?.inventory__products.nodes?.find((p) => p.code === code);
  };

  const handleProductRemove = (index: number) => {
    const updatedProducts = [...allProducts];
    updatedProducts.splice(index, 1);
    setAllProducts(updatedProducts);
  };

  const ths = (
    <tr>
      <th>Product Name</th>
      <th>Product Quantity</th>
      <th>Action</th>
    </tr>
  );

  const rows = allProducts.map((product, index) => (
    <tr key={product.productCode}>
      <td>{product.productCode}</td>
      <td>
        <NumberInput
          type="number"
          placeholder="Quantity"
          value={product.quantity}
          onChange={(quantity: number) => {
            const _products = [...allProducts];
            _products[index].quantity = quantity;
            setAllProducts(_products);
          }}
        />
      </td>
      <td>
        <div
          className="text-red-500 cursor-pointer select-none"
          onClick={() => handleProductRemove(index)}
        >
          <IconTrash />
        </div>
      </td>
    </tr>
  ));

  const handleAddToList = () => {
    const getProduct = getProductByCode(product.productCode);
    setAllProducts((prev) => [
      ...prev,
      {
        ...product,
        productName: getProduct?.name || "",
        productPrice: getProduct?.price || 0,
      },
    ]);
    setProduct({ productCode: "", barcodeType: "", quantity: 1 , productName: "" , productPrice: 0});
    setProductName("");
    setShowProductNames(false);
  };

  return (
    <>
      <PageTitle title="barcode" />
      <Paper p={"xl"}>
        <Title order={3}>Generate Barcode</Title>
        <Space h="" />
        <form className="flex flex-col gap-6">
          <div className="grid gap-3 lg:grid-cols-2 ">
            <div className="relative">
              <Input.Wrapper
                label="Select Product"
                withAsterisk
                error={<ErrorMessage name={"productCode"} errors={errors} />}
              >
                <Input
                  onChange={(e) => {
                    setProductName(e.target.value);
                    if (e.target.value.length > 0) {
                      refetch();
                    }
                   
                  }}
                  placeholder="Select Product"
                  // data={productsDropdown || ([] as any)}
                  value={productName}
                  onFocus={() => setShowProductNames(true)}
                />
              </Input.Wrapper>

              <div
                className={`absolute top-18 bg-white z-50 w-full rounded ${
                  showProductNames ? "block" : "hidden"
                }`}
              >
                {productsDropdown?.map((item) => {
                   
                  return (
                    <Text
                      className="p-1 mb-1 rounded hover:bg-yellow-100 cursor-pointer"
                      onClick={() => {
                        
                        setProduct((prev) => ({
                          ...prev,
                          productCode: item.value || "",
                        }));
                        setProductName(item.label);
                        setShowProductNames(false);
                       
                      }}
                    >
                      {item.label}
                    </Text>
                  );
                })}
              </div>
            </div>

            <Input.Wrapper
              label="Barcode Type"
              withAsterisk
              error={<ErrorMessage name={"barcodeType"} errors={errors} />}
            >
              <Select
                value={product.barcodeType}
                onChange={(barcodeType) =>
                  setProduct((prev) => ({
                    ...prev,
                    barcodeType: barcodeType || "",
                  }))
                }
                data={[
                  {
                    label: "Code128",
                    value: Generate_Barcode_Type?.Code128,
                  },
                  {
                    label: "CodeBar",
                    value: Generate_Barcode_Type?.CodeBar,
                  },
                  // {
                  //   label: "PharmaCode",
                  //   value: Generate_Barcode_Type?.PharmaCode,
                  // },
                ]}
              />
            </Input.Wrapper>
          </div>
          <Table withBorder withColumnBorders>
            <thead>
              <tr>
                <th className="w-6/12">Product Code</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <TextInput
                    placeholder="Product Id"
                    value={product.productCode}
                  />
                </td>
                <td>
                  <NumberInput
                    type="number"
                    placeholder="Quantity"
                    value={product.quantity}
                    onChange={(quantity: any) => {
                      setProduct((prev) => ({
                        ...prev,
                        quantity: quantity || 0,
                      }));
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
          <div className="flex justify-center">
            <Button
              size="md"
              disabled={
                !product.productCode ||
                !product.barcodeType ||
                product.quantity <= 0
              }
              onClick={handleAddToList}
            >
              Add to list
            </Button>
          </div>
        </form>

        <Table
          mt={"md"}
          highlightOnHover
          withBorder
          withColumnBorders
          captionSide="bottom"
        >
          <thead className="bg-card-header">{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>

        

        <Space h={"xl"} />
        <Flex justify={"space-between"}>
          <div className="flex flex-wrap gap-3">
            <Checkbox
              // value={product.barcodeType}
              onChange={(event) => setIsShowProductPrice(event.target.checked)}
              name="barcodePrice"
              label="Generate barcode with price"
            />
            <Checkbox
              onChange={(event) => setIsShowProductName(event.target.checked)}
              name="barcodeProductName"
              label="Generate barcode with product name"
            />
          </div>
          <div>
            <Button onClick={handlePrint} leftIcon={<IconPrinter size={16} />}>
              Print
            </Button>
          </div>
        </Flex>

        <Space h={"xl"} />
        <div
          ref={printRef}
          className="flex flex-col items-center justify-center py-4 "
        >
          {allProducts.map((item, index) => {
            return (
              <div key={index}>
                {new Array(item.quantity).fill(1)?.map((_, key) => (
                  <div
                    key={key}
                    className="flex flex-col justify-center items-center w-[240px] border border-slate-200"
                  >
                    {isShowProductName && (
                      <Text className="font-semibold">
                        {item.productName}
                      </Text>
                    )}
                    {item?.productCode ? (
                      <Barcode
                        className="w-[240px] h-[90px]"
                        value={item?.productCode}
                        options={{
                          format: item.barcodeType,
                        }}
                      />
                    ) : null}
                    {isShowProductPrice && (
                      <Text className="mt-0">BDT: {item.productPrice}</Text>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Paper>
    </>
  );
};

export default BarcodePage;

const barcodeValidationSchema = yup.object({
  barcodeType: yup.string().required().label("Barcode Type"),
  productCode: yup.string().optional().label("Code"),
  quantity: yup.number().required().label("Quantity"),
  barcodePrice: yup.number().required().label("Price"),
  barcodeProductName: yup.string().required().label("Product"),
});
