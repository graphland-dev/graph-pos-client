import { gql } from "@apollo/client";

export const ACCOUNTING_STATEMENTS_QUERY_LIST = gql`
  query Accounting__transactions($where: CommonPaginationDto) {
    accounting__transactions(where: $where) {
      nodes {
        _id
        account {
          _id
          name
          referenceNumber
        }
        amount
        coRelationId
        createdAt
        date
        isActive
        note
        source
        type
        updatedAt
      }
      meta {
        totalCount
      }
    }
  }
`;
