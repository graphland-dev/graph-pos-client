import { gql } from "@apollo/client";

export const ACCOUNTING_EXPENSE_QUERY_LIST = gql`
  query Accounting__expenses {
    accounting__expenses {
      meta {
        totalCount
      }
      nodes {
        _id
        attachments {
          meta
          path
          provider
        }
        account {
          _id
          name
          referenceNumber
        }
        amount
        category
        checkNo
        createdAt
        date
        note
        purpose
        updatedAt
        voucherNo
      }
    }
  }
`;

export const ACCOUNTING_EXPENSE_CREATE_MUTATION = gql`
  mutation Accounting__createExpense($body: CreateExpenseInput!) {
    accounting__createExpense(body: $body) {
      _id
    }
  }
`;


export const ACCOUNTING_EXPENSE_DELETE_MUTATION = gql`
  mutation Accounting__removeExpense($where: CommonFindDocumentDto!) {
    accounting__removeExpense(where: $where)
  }
`;