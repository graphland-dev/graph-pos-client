import { gql } from "@apollo/client";

export const Inventory__Product_Purchases = gql`
  query Inventory__productPurchases($where: CommonPaginationDto) {
    inventory__productPurchases(where: $where) {
      nodes {
        _id
        purchaseId
        dueAmount
        paidAmount
        supplier {
          _id
          name
        }
      }
    }
  }
`;

export const Accounting__Create_Purchase_Payment = gql`
  mutation Accounting__Create_Purchase_Payment(
    $body: CreatePurchasePaymentInput!
  ) {
    accounting__createPurchasePayment(body: $body) {
      _id
    }
  }
`;
