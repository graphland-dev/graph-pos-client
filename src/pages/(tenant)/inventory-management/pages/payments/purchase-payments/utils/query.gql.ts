import { gql } from "@apollo/client";

export const PURCHASE_PAYMENTS_QUERY = gql`
  query Accounting__purchasePayments($where: CommonPaginationDto) {
    accounting__purchasePayments(where: $where) {
      meta {
        totalCount
        currentPage
        totalPages
        hasNextPage
      }
      nodes {
        _id
        checkNo
        account {
          _id
          name
          note
          brunchName
          referenceNumber
          tenant
        }
        items {
          purchase {
            _id
            netTotal
            purchaseUID
            purchaseDate
            paidAmount
          }
          purchaseUID
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
