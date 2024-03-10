import {
  MatchOperator,
  Product,
  ProductItemReference,
  ProductsWithPagination,
} from "@/_app/graphql-models/graphql";
import { useLazyQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { Autocomplete, Input } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { Pos_Products_Query } from "../utils/query.pos";

const ProductSelectArea: React.FC<{
  formInstance: any;
  onSelectProduct: (productReference: ProductItemReference) => void;
}> = ({ formInstance }) => {
  const [value, setValue] = useDebouncedState("", 500);
  const [inputData, setInputData] = useState<any[]>([]);

  // fetch products
  const [fetchProducts] = useLazyQuery<{
    inventory__products: ProductsWithPagination;
  }>(Pos_Products_Query, {
    nextFetchPolicy: "network-only",
    variables: {
      where: {
        limit: -1,
        filters: [
          {
            or: [
              {
                key: "name",
                operator: MatchOperator.Contains,
                value,
              },
              {
                key: "code",
                operator: MatchOperator.Eq,
                value,
              },
            ],
          },
        ],
      },
    },
  });

  // fetch based on search
  useEffect(() => {
    if (!value) return;

    fetchProducts().then((res) => {
      const products: Product[] = res.data?.inventory__products?.nodes || [];
      setInputData(
        products?.map((product) => ({
          label: product.name,
          value: product._id,
        }))
      );
    });
  }, [value]);

  // console.log(onSelectProduct);

  return (
    <Input.Wrapper
      size="md"
      error={
        <ErrorMessage name="products" errors={formInstance.formState.errors} />
      }
    >
      <pre>{JSON.stringify(inputData, null, 2)}</pre>
      <Autocomplete
        size="md"
        radius={0}
        className="w-full"
        data={inputData}
        placeholder="Search by name/code"
        onChange={(value) => setValue(value)}
        nothingFound={true}
      />
    </Input.Wrapper>
  );
};

export default ProductSelectArea;
