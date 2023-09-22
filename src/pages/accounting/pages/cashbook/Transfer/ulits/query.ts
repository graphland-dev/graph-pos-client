import { gql } from "@apollo/client";

export const ACCOUNT_TRANSFER_QUERY_LIST = gql`
  query transferQuery {
    acounting__transfers {
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