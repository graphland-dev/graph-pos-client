import { Product, ProductItemReference } from "@/_app/graphql-models/graphql";
import { ErrorMessage } from "@hookform/error-message";
import { Autocomplete, Input } from "@mantine/core";
import React from "react";

const ProductSelectArea: React.FC<{
  formInstance: any;
  onSelectProduct: (productReference: ProductItemReference) => void;
  products: Product[];
  fetchingProducts: boolean;
}> = ({ formInstance, onSelectProduct, products, fetchingProducts }) => {
  console.log(onSelectProduct);
  return (
    <Input.Wrapper
      size="md"
      error={
        <ErrorMessage name="products" errors={formInstance.formState.errors} />
      }
    >
      <Autocomplete
        size="md"
        radius={0}
        className="w-full"
        disabled={fetchingProducts}
        data={getProductSelectInputData(products)}
        placeholder="Item name/code"
        onChange={(text) => {
          console.log(text);
        }}
        nothingFound
      />
    </Input.Wrapper>
  );
};

export default ProductSelectArea;

const getProductSelectInputData = (data: any) => {
  const productNames: any = [];

  data?.map((d: any) =>
    productNames.push({
      label: d.name,
      data: { ...d },
      value: d._id,
    })
  );

  return productNames;
};
