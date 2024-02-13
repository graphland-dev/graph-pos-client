import { gql } from "@apollo/client";

export const CREATE_PAYROLL_MUTATION = gql`
  mutation Mutation($body: CreatePayrollInput!) {
    accounting__createPayroll(body: $body) {
      _id
    }
  }
`;

export const PAYROLL_QUERY = gql`
  query Accounting__payrolls($where: CommonPaginationDto) {
    accounting__payrolls(where: $where) {
      nodes {
        _id
        employee {
          _id
          name
          salary
        }
        account {
          _id
          name
        }
        salaryMonth
        salaryDate
        opportunities {
          name
          amount
        }
        amount
        createdAt
        updatedAt
        attachments {
          provider
          path
          meta
        }
      }
      meta {
        totalCount
        currentPage
        hasNextPage
        totalPages
      }
    }
  }
`;

export const REMOVE_PAYROLL_MUTATION = gql`
  mutation Mutation($where: CommonFindDocumentDto!) {
    accounting__removePayroll(where: $where)
  }
`;

export const PAYROLL_ACCOUNTS_QUERY = gql`
  query Accounting__accounts {
    accounting__accounts {
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
