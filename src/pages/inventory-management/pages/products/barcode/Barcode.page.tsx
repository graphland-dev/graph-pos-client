import {
  Generate_Barcode_Type,
  ProductsWithPagination,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import {
  Button,
  Checkbox,
  Input,
  Paper,
  Select,
  Space,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { INVENTORY_PRODUCTS_LIST_QUERY } from "../products-list/utils/product.query";
// import JsBarcode from "jsbarcode";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPlus } from "@tabler/icons-react";
import JsBarcode from "jsbarcode";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const Barcode = () => {
  const {
    // register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(barcodeValidationSchema),
    defaultValues: {
      barcodeId: "",
      barcodeType: "",
      productCode: "",
    },
  });

  const [tableData, setTableData] = useState([
    {
      Product: "Item 1",
      Quantity: 1,
      Code: "Code",
    },
  ]);

  const [codeMatchData, setCodeMatchData] = useState({});
  const [barcodeQuantity, setBarcodeQuantity] = useState(0);

  const quantityData = [];

  for (let i = 0; i < barcodeQuantity; i++) {
    quantityData.push(i);
  }

  const { data } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(INVENTORY_PRODUCTS_LIST_QUERY, {
    variables: {
      where: {
        limit: 10,
        page: 1,
      },
    },
  });

  const productId = data?.inventory__products.nodes?.map((item) => ({
    value: item?._id,
    label: `${item?.name}`,
  }));

  // const productShortId = productId?.slice(0, 5)

  // const productCode = data?.inventory__products?.nodes?.filter(
  //   (item: any) => console.log(item)
  // );

  const bareCodeGenerate = () => {
    const barcodeType = getValues("barcodeType");
    const barcodeId = getValues("barcodeId");
    // const productCode = getValues("productCode");

    JsBarcode("#barcode", barcodeId, {
      format: barcodeType,
      lineColor: "#0aa",
      width: 2,
      height: 40,
      // displayValue: productId.slice(0, 5),
    });
  };

  const onSubmit = () => {
    bareCodeGenerate();
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
              error={<ErrorMessage name={"barcodeId"} errors={errors} />}
            >
              <Select
                searchable
                withAsterisk
                onChange={(fromBarcodeId) => {
                  setValue("barcodeId", fromBarcodeId || "");
                  // console.log(fromBarcodeId);
                  const matchData = data?.inventory__products?.nodes?.find(
                    (item: any) => item._id === fromBarcodeId
                  );
                  setCodeMatchData(matchData);
                  // console.log(matchData);
                }}
                placeholder="Select Product"
                data={productId || []}
                value={watch("barcodeId")}
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
                  {
                    label: "Msi",
                    value: Generate_Barcode_Type?.Msi,
                  },
                  {
                    label: "PharmaCode",
                    value: Generate_Barcode_Type?.PharmaCode,
                  },
                ]}
              />
            </Input.Wrapper>
          </div>
          <Table withBorder withColumnBorders>
            <thead>
              <tr>
                <th className="w-6/12">Product Id</th>
                <th>Quantity</th>
                <th>Code</th>
              </tr>
            </thead>

            <tbody>
              {tableData?.map((td, idx) => (
                <tr key={idx}>
                  <td>
                    <TextInput
                      placeholder="Product Id"
                      defaultValue={td?.Product}
                      value={watch("barcodeId")}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      onChange={(e: any) => {
                        setBarcodeQuantity(e.target.value);
                      }}
                      defaultValue={td?.Quantity}
                    />
                  </td>
                  <td>
                    <TextInput
                      placeholder="Code"
                      defaultValue={td?.Code}
                      value={codeMatchData?.code}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Checkbox
            name="withCode"
            defaultChecked
            label="Generate barcode with code"
          />
          <div>
            <Button
              onClick={bareCodeGenerate}
              leftIcon={<IconPlus size={16} />}
              type="submit"
            >
              Generate Barcode
            </Button>
          </div>
        </form>
        <Space h={"xl"} />
        <div className="grid grid-cols-3 gap-5">
          {quantityData?.map((item: any) => (
            <Paper p={"lg"} shadow="md" key={item._id}>
              <svg id="barcode"></svg>
            </Paper>
          ))}
        </div>

        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Paper>
    </>
  );
};

export default Barcode;

const barcodeValidationSchema = yup.object({
  barcodeId: yup.string().required().label("Product"),
  barcodeType: yup.string().required().label("Barcode Type"),
  productCode: yup.string().optional().label("Code"),
});
