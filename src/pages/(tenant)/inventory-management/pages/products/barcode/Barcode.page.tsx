import {
  MatchOperator,
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
  Title,
} from "@mantine/core";
import Barcode from "react-jsbarcode";
import { INVENTORY_PRODUCTS_LIST_QUERY } from "../products-list/utils/product.query";
// import JsBarcode from "jsbarcode";
import PageTitle from "@/_app/common/PageTitle";
import AutoComplete from "@/_app/common/components/AutoComplete";
import { Generate_Barcode_Type } from "@/_app/models/barcode.type";
import { useDebouncedState } from "@mantine/hooks";
import { IconPrinter, IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface IBarcodeProductItem {
  productCode: string;
  barcodeType: string;
  quantity: number;
  productName: string;
  productPrice: number;
}

const BarcodePage = () => {
  const [productQuery, setProductQuery] = useDebouncedState("", 300);
  const [productItems, setProductItems] = useState<IBarcodeProductItem[]>();
  const [isShowProductPrice, setIsShowProductPrice] = useState(false);
  const [isShowProductName, setIsShowProductName] = useState(false);

  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current!,
  });

  const { data: searchedProducts, loading } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(INVENTORY_PRODUCTS_LIST_QUERY, {
    variables: {
      where: {
        filters: [
          {
            or: [
              {
                key: "name",
                operator: MatchOperator.Contains,
                value: productQuery,
              },
              {
                key: "code",
                operator: MatchOperator.Contains,
                value: productQuery,
              },
            ],
          },
        ],
      },
    },
    skip: !productQuery,
  });

  const handleProductRemove = (index: number) => {
    const updatedProducts = [...(productItems ?? [])];
    updatedProducts.splice(index, 1);
    setProductItems(updatedProducts);
  };

  const ths = (
    <tr>
      <th>Product Name</th>
      <th>Product Code</th>
      <th>Barcode Type</th>
      <th>Product Quantity</th>
      <th>Action</th>
    </tr>
  );

  const rows = productItems?.map((product, index) => (
    <tr key={product.productCode}>
      <td>{product.productName}</td>
      <td>{product.productCode}</td>
      <td>
        <Select
          value={product.barcodeType}
          onChange={(barcodeType) => {
            const _products = [...productItems];
            _products[index].barcodeType = barcodeType ?? "";
            setProductItems(_products);
          }}
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
      </td>
      <td>
        <NumberInput
          type="number"
          placeholder="Quantity"
          value={product.quantity}
          onChange={(quantity: number) => {
            const _products = [...productItems];
            _products[index].quantity = quantity;
            setProductItems(_products);
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

  return (
    <>
      <PageTitle title="barcode" />
      <Paper p={"xl"}>
        <Title order={3}>Generate Barcode</Title>
        <Space h="" />
        <form className="flex flex-col gap-6">
          <div className="grid gap-3 lg:grid-cols-2 ">
            <Input.Wrapper label="Search Product">
              <AutoComplete
                loading={loading}
                data={searchedProducts?.inventory__products?.nodes || []}
                onChange={setProductQuery}
                onSelect={(item: any) => {
                  setProductItems([
                    ...(productItems || []),
                    {
                      productName: item?.name,
                      barcodeType: Generate_Barcode_Type?.Code128,
                      productCode: item.code,
                      productPrice: item.price,
                      quantity: 1,
                    },
                  ]);
                }}
                labelKey={"name"}
              />
            </Input.Wrapper>
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
          {productItems?.map((item, index) => {
            return (
              <div key={index}>
                {new Array(item.quantity).fill(1)?.map((_, key) => (
                  <div
                    key={key}
                    className="flex flex-col justify-center items-center w-[240px] border border-slate-200"
                  >
                    {isShowProductName && (
                      <Text className="font-semibold">{item.productName}</Text>
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
