import { gql } from "@apollo/client";

export const PURCHASE_PRODUCT_LIST = gql`
  query Query($where: CommonPaginationDto) {
    inventory__products(where: $where) {
      nodes {
        _id
        name
        code
        category {
          _id
          name
        }
        vat {
          _id
          percentage
        }
        stockInQuantity
        stockOutQuantity
        price
      }
      meta {
        totalCount
        currentPage
        hasNextPage
        totalPages
      }
    }
  }
`;
