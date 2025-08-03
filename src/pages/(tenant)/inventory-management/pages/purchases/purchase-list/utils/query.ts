import { gql } from "@apollo/client";

export const Inventory__product_Purchases_Query = gql`
  query Inventory__productPurchases($where: CommonPaginationDto) {
    inventory__productPurchases(where: $where) {
      nodes {
        _id
        tenant
        purchaseUID
        products {
          referenceId
          name
          code
          quantity
          unitPurchasePrice
          netPurchaseAmount
        }
        paymentHistory {
          referenceId
          committedBy {
            referenceId
            name
            email
          }
          paymentUID
          date
          amount
        }
        supplier {
          _id
          tenant
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
    }
  }
`;

export const Inventory__Remove_Product_Purchase = gql`
  mutation Inventory__removeProductPurchase($where: CommonFindDocumentDto!) {
    inventory__removeProductPurchase(where: $where)
  }
`;
