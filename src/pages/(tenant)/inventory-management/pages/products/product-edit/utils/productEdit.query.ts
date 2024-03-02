import { gql } from "@apollo/client";

export const INVENTORY_PRODUCT_BASIC_INFO_QUERY = gql`
  query Inventory__product($where: CommonFindDocumentDto!) {
    inventory__product(where: $where) {
      name
      code
      modelName
      note
    }
  }
`;

export const INVENTORY_PRODUCT_PRICE_QUERY = gql`
  query Inventory__product($where: CommonFindDocumentDto!) {
    inventory__product(where: $where) {
      price
      discountAmount
      discountPercentage
      discountMode
    }
  }
`;

export const INVENTORY_PRODUCT_ASSIGNMENT_QUERY = gql`
  query Inventory__product($where: CommonFindDocumentDto!) {
    inventory__product(where: $where) {
      category {
        _id
      }
      brand {
        _id
      }
      unit {
        _id
      }
      vat {
        _id
      }
    }
  }
`;

export const INVENTORY_PRODUCT_UPDATE = gql`
  mutation Inventory__removeProduct(
    $body: UpdateProductInput!
    $where: CommonFindDocumentDto!
  ) {
    inventory__updateProduct(body: $body, where: $where)
  }
`;

export const CATEGORIES_QUERY = gql`
  query Inventory__productCategories {
    inventory__productCategories {
      nodes {
        _id
        name
      }
    }
  }
`;
export const BRANDS_QUERY = gql`
  query Setup__brands {
    setup__brands {
      nodes {
        _id
        name
      }
    }
  }
`;

export const UNITS_QUERY = gql`
  query Setup__units {
    setup__units {
      nodes {
        _id
        name
      }
    }
  }
`;

export const VATS_QUERY = gql`
  query Setup__vats($where: CommonPaginationDto) {
    setup__vats(where: $where) {
      nodes {
        _id
        name
      }
    }
  }
`;

export const PRODUCT_STOCK_HISTORY_QUERY = gql`
  query Inventory__productStocks($where: CommonPaginationDto) {
    inventory__productStocks(where: $where) {
      meta {
        totalCount
      }
      nodes {
        _id
        createdAt
        note
        purchaseId
        product {
          _id
          code
          name
          note
          stockInQuantity
          stockOutQuantity
          createdAt
        }
        quantity
        source
        type
        updatedAt
      }
    }
  }
`;

export const PRODUCT_STOCK_CREATE_MUTATION = gql`
  mutation Mutation($body: CreateProductStockInput!) {
    inventory__createProductStock(body: $body) {
      _id
    }
  }
`;

export const PRODUCT_STOCK_REMOVE_MUTATION = gql`
  mutation Inventory__removeProductStock($where: CommonFindDocumentDto!) {
    inventory__removeProductStock(where: $where)
  }
`;
