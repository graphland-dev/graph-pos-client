import { ProductsWithPagination } from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import {
  Checkbox,
  Input,
  NumberInput,
  Paper,
  Select,
  Space,
  Table,
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
    },
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

  // const bareCodeGenerate = () => {
  //   JsBarcode("#barcode", "Rayhan", {
  //     format: watch("barcodeType")!,
  //     lineColor: "#0aa",
  //     width: 2,
  //     height: 40,
  //   });
  // };

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
                  // {
                  //   label: "Msi",
                  //   value: Generate_Barcode_Type?.Msi,
                  // },
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
          <Checkbox
            name="withCode"
            defaultChecked
            label="Generate barcode with price"
          />
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
        <div className="grid grid-cols-3 gap-5">
          {new Array(watch("quantity")).fill(null)?.map((_, key) => (
            <Paper p={"lg"} shadow="xs" key={key} className="text-center">
              {watch("productCode") ? (
                <Barcode
                  value={watch("productCode")!}
                  options={{ format: watch("barcodeType") }}
                />
              ) : null}
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
});
