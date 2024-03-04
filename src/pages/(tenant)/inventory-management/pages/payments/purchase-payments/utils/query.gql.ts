import { gql } from "@apollo/client";

export const PURCHASE_PAYMENTS_QUERY = gql`
  query Accounting__purchasePayments {
    accounting__purchasePayments {
      meta {
        totalCount
        currentPage
        totalPages
        hasNextPage
      }
      nodes {
        checkNo
        account {
          _id
          name
          note
          brunchName
          referenceNumber
          tenant
        }
        note
        paidAmount
        paymentUID
        receptNo
        supplier {
          _id
          name
          email
          companyName
          contactNumber
        }
      }
    }
  }
`;
