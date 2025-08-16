import { gql } from "@apollo/client";

export const PRODUCTS_EXAMPLE_QUERY = gql`
  query Inventory__products($where: CommonPaginationDto) {
    inventory__products(where: $where) {
      nodes {
        _id
        name
        code
        price
        vat {
          _id
          code
          percentage
        }
        stockInQuantity
        stockOutQuantity
        isSellableWithoutStock
      }
      meta {
        totalCount
      }
    }
  }
`;

export interface Product {
  _id: string;
  name: string;
  code: string;
  price: number;
  vat: {
    _id: string;
    code: string;
    percentage: number;
  } | null;
  stockInQuantity: number;
  stockOutQuantity: number;
  isSellableWithoutStock: boolean;
}

export interface ProductsResponse {
  inventory__products: {
    nodes: Product[];
    meta: {
      totalCount: number;
    };
  };
}