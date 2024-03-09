import { getFileUrl } from "@/_app/common/utils/getFileUrl";
import {
  Product,
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
import React from "react";
import { Pos_Products_Query } from "../utils/query.pos";
import { getProductReferenceByQuantity } from "../utils/utils.calc";

interface IProp {
  onSelectProduct: (product: ProductItemReference) => void;
}

const POSProductGalary: React.FC<IProp> = ({ onSelectProduct }) => {
  const { data: products, loading: productsFetching } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(Pos_Products_Query, {
    variables: {
      where: { limit: 20 },
    },
  });

  // categories query
  // const { data: categories, loading: loadingCategories } = useQuery<{
  //   inventory__productCategories: ProductCategorysWithPagination;
  // }>(Pos_Categories_Query);

  // // brands query
  // const { data: brands, loading: loadingBrands } = useQuery<{
  //   setup__brands: BrandsWithPagination;
  // }>(Pos_Brands_Query);

  const handleEmitProduct = (product: Product) => {
    const audio = new Audio("/beep.mp3");
    audio.play();
    onSelectProduct(getProductReferenceByQuantity(product, 1));
  };

  return (
    <Paper p={15} className=" h-[calc(100vh-44px)] overflow-y-auto">
      <div className="grid grid-cols-2 gap-2">
        <Input.Wrapper size="md">
          <Select
            size="md"
            radius={0}
            placeholder="Select a category"
            data={[]}
          />
        </Input.Wrapper>

        <Input.Wrapper size="md">
          <Select size="md" radius={0} placeholder="Select a brand" data={[]} />
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
                src={getFileUrl(product?.thumbnail as ServerFileReference)}
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
    </Paper>
  );
};

export default POSProductGalary;
