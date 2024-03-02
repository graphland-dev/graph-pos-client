import { gql } from "@apollo/client";

export const Inventory__product_Purchases_Query = gql`
  query Inventory__productPurchases($where: CommonPaginationDto) {
    inventory__productPurchases(where: $where) {
      nodes {
        _id
        purchaseUID
        products {
          referenceId
          name
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
        supplier {
          _id
          name
          companyName
          contactNumber
          email
          address
          createdAt
          updatedAt
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
        netTotal
        paidAmount
        note
        createdAt
        updatedAt
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

export const Inventory__Remove_Product_Purchase = gql`
  mutation Inventory__removeProductPurchase($where: CommonFindDocumentDto!) {
    inventory__removeProductPurchase(where: $where)
  }
`;
