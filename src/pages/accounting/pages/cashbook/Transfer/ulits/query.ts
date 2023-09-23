import { gql } from "@apollo/client";

export const ACCOUNTING_TRANSFER_QUERY_LIST = gql`
  query TransferQuery($where: CommonPaginationDto) {
    acounting__transfers(where: $where) {
      meta {
        totalCount
      }
      nodes {
        _id
        amount
        coRelationId
        createdAt
        date
        fromAccount {
          _id
          brunchName
          createdAt
          isActive
          name
          note
          openedAt
          referenceNumber
          updatedAt
        }
        note
        toAccount {
          _id
          brunchName
          createdAt
          isActive
          name
          note
          openedAt
          referenceNumber
          updatedAt
        }
        updatedAt
      }
    }
  }
`;

export const ACCOUNT_CREATE_TRANSFER_MUTATION = gql`
  mutation Acounting__createTransfer($body: CreateTransferInput!) {
    acounting__createTransfer(body: $body) {
      _id
    }
  }
`;

export const ACCOUNT_UPDATE_TRANSFER_MUTATION = gql`
  mutation Accounting__updateTransaction(
    $body: UpdateTransactionInput
    $where: CommonFindDocumentDto
  ) {
    accounting__updateTransaction(body: $body, where: $where)
  }
`;
