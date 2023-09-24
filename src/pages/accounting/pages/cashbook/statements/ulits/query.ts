import { gql } from "@apollo/client";

export const ACCOUNTING_STATEMENTS_QUERY_LIST = gql`
  query Accounting__transactions($where: CommonPaginationDto) {
    accounting__transactions(where: $where) {
      nodes {
        _id
        account {
          name
          referenceNumber
        }
        amount
        date
        note
        source
        type
      }
      meta {
        totalCount
      }
    }
  }
`;
