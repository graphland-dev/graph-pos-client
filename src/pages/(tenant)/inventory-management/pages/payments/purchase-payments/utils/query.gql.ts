import { gql } from "@apollo/client";

export const PURCHASE_PAYMENTS_QUERY = gql`
  query Accounting__purchasePayments($where: CommonPaginationDto) {
    accounting__purchasePayments(where: $where) {
      nodes {
        _id
        paymentUID
        account {
          _id
          name
          referenceNumber
        }
        supplier {
          _id
          name
        }
        paidAmount
        attachments {
          meta
          path
          provider
        }
      }
    }
  }
`;
