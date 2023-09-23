import { gql } from "@apollo/client";

export const ACCOUNTING_ACCOUNTS_LIST = gql`
  query Accounts($where: CommonPaginationDto) {
    accounting__accounts(where: $where) {
      meta {
        totalCount
      }
      nodes {
        _id
        name
        referenceNumber
        brunchName
        openedAt
        note
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const ACCOUNT_CREATE_MUTATION = gql`
  mutation Accounting__createAccount($body: CreateAccountInput!) {
    accounting__createAccount(body: $body) {
      _id
    }
  }
`;

export const ACCOUNT_UPDATE_MUTATION = gql`
  mutation Accounting__updateAccount(
    $where: CommonFindDocumentDto
    $body: UpdateAccountInput
  ) {
    accounting__updateAccount(where: $where, body: $body)
  }
`;
