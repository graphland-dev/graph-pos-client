import { gql } from "@apollo/client";

export const ACCOUNTING_EXPENSE_CATEGORY_QUERY_LIST = gql`
  query Accounting__expenseCategorys($where: CommonPaginationDto!) {
    accounting__expenseCategorys(where: $where) {
      meta {
        totalCount
      }
      nodes {
        _id
        createdAt
        name
        updatedAt
      }
    }
  }
`;

export const ACCOUNTING_EXPENSE_CATEGORY_CREATE_MUTATION = gql`
  mutation Accounting__createExpenseCategory(
    $body: CreateExpenseCategoryInput!
  ) {
    accounting__createExpenseCategory(body: $body) {
      _id
    }
  }
`;

export const ACCOUNTING_EXPENSE_CATEGORY_UPDATE_MUTATION = gql`
  mutation Accounting__updateExpenseCategory(
    $where: CommonFindDocumentDto!
    $body: UpdateExpenseCategoryInput!
  ) {
    accounting__updateExpenseCategory(where: $where, body: $body)
  }
`;

export const ACCOUNTING_EXPENSE_CATEGORY_DELETE_MUTATION = gql`
  mutation Accounting__removeExpenseCategory($where: CommonFindDocumentDto!) {
    accounting__removeExpenseCategory(where: $where)
  }
`;
