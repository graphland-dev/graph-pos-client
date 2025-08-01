import AutoComplete from "@/commons/components/AutoComplete";
import {
  MatchOperator,
  Product,
  ProductItemReference,
  ProductsWithPagination,
} from "@/commons/graphql-models/graphql";
import { playBipSound } from "@/commons/utils/play-bip-sound";
import { useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { Input } from "@mantine/core";
import React, { useState } from "react";
import { Pos_Products_Query } from "../utils/query.pos";
import { getProductReferenceByQuantity, getStock } from "../utils/utils.calc";
import { showNotification } from "@mantine/notifications";

const ProductSearchAutocomplete: React.FC<{
  formInstance: any;
  onSelectProduct: (productReference: ProductItemReference) => void;
}> = ({ formInstance, onSelectProduct }) => {
  const [q, setQ] = useState<string>("");

  // fetch products API initialization
  const { data: searchedProducts, loading } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(Pos_Products_Query, {
    variables: {
      where: {
        filters: [
          {
            or: [
              {
                key: "name",
                operator: MatchOperator.Contains,
                value: q.trim(),
              },
              {
                key: "code",
                operator: MatchOperator.Contains,
                value: q.trim(),
              },
            ],
          },
        ],
      },
    },
    onCompleted(data) {
      // if one product is found then select it
      if (data.inventory__products.nodes?.length === 1) {
        onSelectProduct(
          getProductReferenceByQuantity(data.inventory__products.nodes[0], 1)
        );
        playBipSound();
        // clean the input
        setQ("");
      }
    },
    skip: !q,
  });

  return (
    <Input.Wrapper
      size="md"
      error={
        <ErrorMessage name="products" errors={formInstance.formState.errors} />
      }
    >
      <AutoComplete
        loading={loading}
        data={searchedProducts?.inventory__products?.nodes || []}
        onChange={setQ}
        placeholder="Search in inventory"
        onSelect={(item: Product) => {
          if (!item._id) return;
          if (!getStock(item) && !item?.isSellableWithoutStock) {
            showNotification({
              message: "Out of stock",
              color: "red",
            });
            return;
          }

          // if one product is selected then emit it
          onSelectProduct(getProductReferenceByQuantity(item, 1));
          playBipSound();
        }}
        enableNoResultDropdown
        NoResultComponent={
          <div className="flex gap-2 py-2 item-center">
            <p>No product found!</p>
          </div>
        }
        labelKey={"name"}
      />
    </Input.Wrapper>
  );
};

export default ProductSearchAutocomplete;
