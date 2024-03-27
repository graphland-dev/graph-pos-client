import EmptyState from "@/_app/common/EmptyState/EmptyState";
import {
  BrandsWithPagination,
  MatchOperator,
  Product,
  ProductCategorysWithPagination,
  ProductItemReference,
  ProductsWithPagination,
  ServerFileReference,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import {
  Badge,
  Input,
  Paper,
  Select,
  Skeleton,
  Space,
  Text,
} from "@mantine/core";
import React, { useState } from "react";
import { getSelectInputData } from "../../products/product-edit/components/AssignmentForm";
import {
  Pos_Brands_Query,
  Pos_Categories_Query,
  Pos_Products_Query,
} from "../utils/query.pos";
import { getProductReferenceByQuantity } from "../utils/utils.calc";
import { getFileUrl } from "@/_app/common/utils/getFileUrl";

interface IProp {
  onSelectProduct: (product: ProductItemReference) => void;
}

const POSProductGlary: React.FC<IProp> = ({ onSelectProduct }) => {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  // products fetching
  const { data: products, loading: productsFetching } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(Pos_Products_Query, {
    nextFetchPolicy: "network-only",
    variables: {
      where: {
        limit: 20,
        filters: [
          {
            key: "category",
            operator: MatchOperator.Eq,
            value: category,
          },
          {
            key: "brand",
            operator: MatchOperator.Eq,
            value: brand,
          },
        ],
      },
    },
  });

  // categories query
  const { data: categories, loading: loadingCategories } = useQuery<{
    inventory__productCategories: ProductCategorysWithPagination;
  }>(Pos_Categories_Query, {
    variables: {
      where: { limit: -1 },
    },
    nextFetchPolicy: "network-only",
  });

  // // brands query
  const { data: brands, loading: loadingBrands } = useQuery<{
    setup__brands: BrandsWithPagination;
  }>(Pos_Brands_Query, {
    variables: {
      where: { limit: -1 },
    },
    nextFetchPolicy: "network-only",
  });

  // handle emit product
  const handleEmitProduct = (product: Product) => {
    const audio = new Audio("/beep.mp3");
    audio.play();
    onSelectProduct(getProductReferenceByQuantity(product, 1));
  };

  return (
    <Paper p={15} className=" h-[calc(100vh-44px)] overflow-y-auto">
      <div className="grid grid-cols-2 gap-2">
        <Input.Wrapper size="md" label="Category">
          <Select
            size="md"
            radius={0}
            searchable
            clearable
            placeholder="Select a category"
            data={getSelectInputData(
              categories?.inventory__productCategories?.nodes
            )}
            onChange={(catId) => setCategory(catId!)}
            disabled={loadingCategories}
          />
        </Input.Wrapper>

        <Input.Wrapper size="md" label="Brand">
          <Select
            size="md"
            radius={0}
            searchable
            clearable
            placeholder="Select a brand"
            data={getSelectInputData(brands?.setup__brands?.nodes)}
            onChange={(brandId) => setBrand(brandId!)}
            disabled={loadingBrands}
          />
        </Input.Wrapper>
      </div>

      <Space h={20} />
      <div className="grid grid-cols-4 gap-2">
        {products?.inventory__products?.nodes?.map(
          (product: Product, idx: number) => (
            <Paper
              key={idx}
              radius={5}
              shadow="sm"
              pos={"relative"}
              onClick={() => handleEmitProduct(product)}
              className="overflow-hidden border cursor-pointer border-neutral-muted hover:border-blue-500"
            >
              <Badge
                pos={"absolute"}
                top={0}
                left={0}
                radius={0}
                size="lg"
                variant="filled"
              >
                {product.price} BDT
              </Badge>
              <img
                src={
                  getFileUrl(product?.thumbnail as ServerFileReference) ?? ""
                }
                alt="product image"
                className="object-cover p-2 rounded-md"
              />

              <Space h={5} />

              <div className="p-2">
                <Text size="xs" fw={500}>
                  {product?.code}
                </Text>
                <Text fz={"md"} fw={500}>
                  {product?.name}
                </Text>
              </div>
            </Paper>
          )
        )}

        {productsFetching && (
          <>
            {new Array(12).fill(12).map((_, idx) => (
              <Skeleton key={idx} radius={5} h={200} />
            ))}
          </>
        )}
      </div>
      {!products?.inventory__products?.nodes?.length && !productsFetching && (
        <EmptyState label={"No products found with your filter!"} />
      )}
    </Paper>
  );
};

export default POSProductGlary;
