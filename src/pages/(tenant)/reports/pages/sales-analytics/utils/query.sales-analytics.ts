import { gql } from "@apollo/client";

export const SALES_BY_PRODUCT_REPORT_QUERY = gql`
  query SalesByProductReport($input: ProductSalesFilterInput!) {
    inventory__salesByProductReport(input: $input) {
      meta {
        currentPage
        hasNextPage
        totalCount
        totalPages
      }
      nodes {
        productId
        productName
        category
        unitsSold
        revenue
        profit
        profitMargin
      }
      categoryTotals {
        category
        productCount
        totalRevenue
        totalUnits
      }
    }
  }
`;

export const SALES_SUMMARY_REPORT_QUERY = gql`
  query SalesSummaryReport($input: SalesSummaryFilterInput!) {
    inventory__salesSummaryReport(input: $input) {
      totalRevenue
      totalProfit
      totalDiscounts
      averageSaleValue
      totalTransactions
      timeSeries {
        date
        revenue
        profit
        transactions
      }
    }
  }
`;

export const PRODUCT_CATEGORIES_QUERY = gql`
  query SalesByProductReport__categories($where: CommonPaginationDto) {
    inventory__productCategories(where: $where) {
      nodes {
        _id
        name
      }
    }
  }
`;
