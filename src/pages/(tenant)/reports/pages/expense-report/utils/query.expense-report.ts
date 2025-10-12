import { gql } from "@apollo/client";

export const EXPENSE_REPORT_QUERY = gql`
  query ExpenseReport($input: ExpenseReportFilterInput!) {
    accounting__expenseReport(input: $input) {
      summary {
        totalExpenses
        transactionCount
        averageExpensePerDay
        categoryCount
        largestExpenseCategory
      }
      timeSeries {
        date
        amount
        transactionCount
      }
      categories {
        category
        amount
        percentage
        transactionCount
      }
      topExpenses {
        expenseId
        date
        category
        purpose
        amount
        voucherNo
        checkNo
        note
      }
    }
  }
`;

export const EXPENSE_CATEGORIES_QUERY = gql`
  query ExpenseCategories($where: GetExpenseCategoryInput!) {
    accounting__expenseCategories(where: $where) {
      nodes {
        _id
        name
      }
      meta {
        totalCount
      }
    }
  }
`;
