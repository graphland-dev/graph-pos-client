import { gql } from "@apollo/client";

export const ACCOUNTS_LIST_DROPDOWN = gql`
  query Accounts($where: CommonPaginationDto) {
    accounting__accounts(where: $where) {
      nodes {
        _id
        name
        referenceNumber
        creditAmount
        debitAmount
      }
    }
  }
`;
