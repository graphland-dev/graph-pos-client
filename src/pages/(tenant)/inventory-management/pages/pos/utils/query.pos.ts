import { gql } from "@apollo/client";

export const Pos_Client_Query = gql`
  query Pos_Client_Query($where: CommonPaginationDto) {
    people__clients(where: $where) {
      nodes {
        _id
        contactNumber
        name
        email
      }
    }
  }
`;

export const Pos_Brands_Query = gql`
  query Pos_Brands_Query($where: CommonPaginationDto) {
    setup__brands(where: $where) {
      nodes {
        _id
        name
      }
    }
  }
`;

export const Pos_Categories_Query = gql`
  query Pos_Categories_Query($where: CommonPaginationDto) {
    inventory__productCategories(where: $where) {
      nodes {
        _id
        name
      }
    }
  }
`;

export const Pos_Products_Query = gql`
  query Pos_Products_Query($where: CommonPaginationDto) {
    inventory__products(where: $where) {
      nodes {
        _id
        brand {
          _id
          name
        }
        category {
          _id
          name
        }
        thumbnail {
          path
          meta
          provider
          externalUrl
        }
        stockInQuantity
        stockOutQuantity
        discountAmount
        discountMode
        discountPercentage
        code
        name
        price
        taxType
        vat {
          _id
          name
          percentage
        }
      }
    }
  }
`;

export const Pos_Hold_List = gql`
  query Pos_Hold_List($where: CommonPaginationDto) {
    inventory__productInvoices(where: $where) {
      nodes {
        _id
        client {
          name
          _id
        }
        netTotal
        status
        tenant
        invoiceUID
        products {
          referenceId
          name
          code
          unitPrice
          taxRate
          taxType
          taxAmount
          quantity
          netAmount
        }
        costs {
          name
          amount
          note
        }
        purchaseDate
        purchaseOrderDate
        taxRate
        taxAmount
        discountPercentage
        discountAmount
        discountMode
        subTotal
        costAmount
        paidAmount
        note
        source
        committedBy {
          referenceId
          name
          email
        }
        reference
        createdAt
        updatedAt
      }
    }
  }
`;
