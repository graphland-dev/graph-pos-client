import { ProductsWithPagination } from "@/_app/graphql-models/graphql";
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
import { Generate_Barcode_Type } from "@/_app/models/barcode.type";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { IconPrinter } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const BarcodePage = () => {
  const {
    setValue,
    handleSubmit,
    watch,
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

  const [barcodePrice, setBarcodePrice] = useState(false)
  const [barcodeProductName, setBarcodeProductName] = useState(false)

  // const [price, setPrice] = useState(0)


   const printRef = useRef<HTMLDivElement | null>(null);
   const handlePrint = useReactToPrint({
     content: () => printRef.current!,
   });

  const { data } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(INVENTORY_PRODUCTS_LIST_QUERY, {
    variables: {
      where: { limit: -1 },
    },
  });



  const productsDropdownData = data?.inventory__products.nodes?.map((item) => ({
    value: item?.code,
    label: `${item?.name}`,
  }));

 


  const onSubmit = () => {
    // bareCodeGenerate();
  };

  return (
    <>
      <Paper p={"xl"}>
        <Title order={3}>Generate Barcode</Title>
        <Space h="" />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid gap-3 lg:grid-cols-2">
            <Input.Wrapper
              label="Select Product"
              withAsterisk
              error={<ErrorMessage name={"productCode"} errors={errors} />}
            >
              <Select
                searchable
                withAsterisk
                onChange={(productCode) => {
                  setValue("productCode", productCode || "");
                }}
                placeholder="Select Product"
                data={productsDropdownData || []}
                value={watch("productCode")}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="Barcode Type"
              withAsterisk
              error={<ErrorMessage name={"barcodeType"} errors={errors} />}
            >
              <Select
                value={watch("barcodeType")}
                onChange={(barcodeType) =>
                  setValue("barcodeType", barcodeType || "", {
                    shouldValidate: true,
                  })
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
                    value={watch("productCode")}
                  />
                </td>
                <td>
                  <NumberInput
                    type="number"
                    placeholder="Quantity"
                    value={watch("quantity")}
                    onChange={(value: any) => {
                      setValue("quantity", parseInt(value));
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </Table>

          <Flex justify={"space-between"}>
            <div className="flex flex-col gap-3">
              <Checkbox
                value={watch("barcodePrice")}
                onChange={(event) => setBarcodePrice(event.target.checked)}
                name="barcodePrice"
                label="Generate barcode with price"
              />
              <Checkbox
                onChange={(event) =>
                  setBarcodeProductName(event.target.checked)
                }
                name="barcodeProductName"
                label="Generate barcode with product name"
              />
            </div>
            <div>
              <Button
                onClick={handlePrint}
                leftIcon={<IconPrinter size={16} />}
              >
                Print
              </Button>
            </div>
          </Flex>
          {/* <div>
            <Button
              onClick={bareCodeGenerate}
              leftIcon={<IconPlus size={16} />}
              type="submit"
            >
              Generate Barcode(s)
            </Button>
          </div> */}
        </form>

        <Space h={"xl"} />
        <div ref={printRef} className="grid grid-cols-3 gap-5">
          {new Array(watch("quantity")).fill(1)?.map((_, key) => (
            <Paper p={"lg"} shadow="xs" key={key} className="text-center">
              {barcodeProductName && <Text>{watch("barcodeProductName")}</Text>}
              {watch("productCode") ? (
                <Barcode
                  value={watch("productCode")!}
                  options={{
                    format: watch("barcodeType"),
                  }}
                />
              ) : null}
              {barcodePrice && <Text>{watch("barcodePrice")}</Text>}
            </Paper>
          ))}
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
