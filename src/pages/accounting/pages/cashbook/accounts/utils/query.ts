import { gql } from "@apollo/client";

export const AccountListQuery = gql`
  query Accounts {
    accounting__accounts {
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
