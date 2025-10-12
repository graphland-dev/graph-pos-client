import { gql } from "@apollo/client";

// Quick summary metrics for executive dashboard
export const DASHBOARD_SUMMARY_QUERY = gql`
  query DashboardSummary($salesInput: SalesSummaryFilterInput!, $expenseInput: ExpenseReportFilterInput!) {
    salesSummary: inventory__salesSummaryReport(input: $salesInput) {
      totalRevenue
      totalProfit
      totalTransactions
      averageSaleValue
    }
    expenseSummary: accounting__expenseReport(input: $expenseInput) {
      summary {
        totalExpenses
        transactionCount
      }
    }
    stockSummary: inventory__currentStockReport(input: { sort: DESC, sortBy: lastUpdated, page: 1, limit: 1 }) {
      summary {
        totalProductsCount
        lowStockCount
        outOfStockCount
        netStockPurchasePrice
        netProfitableAmount
      }
    }
  }
`;

// Recent expenses
export const RECENT_EXPENSES_QUERY = gql`
  query RecentExpenses($where: CommonPaginationDto) {
    accounting__expenses(where: $where) {
      nodes {
        _id
        date
        category {
          name
        }
        purpose
        amount
        voucherNo
        checkNo
      }
      meta {
        totalCount
      }
    }
  }
`;

// Recent purchase invoices
export const RECENT_PURCHASES_QUERY = gql`
  query RecentPurchases($where: CommonPaginationDto) {
    inventory__productPurchases(where: $where) {
      nodes {
        _id
        purchaseDate
        purchaseUID
        supplier {
          name
        }
        netTotal
        paidAmount
      }
      meta {
        totalCount
      }
    }
  }
`;

// Recent sales invoices
export const RECENT_SALES_QUERY = gql`
  query RecentSales($where: CommonPaginationDto) {
    inventory__productInvoices(where: $where) {
      nodes {
        _id
        date
        invoiceUID
        client {
          name
        }
        netTotal
        paidAmount
        paymentStatus
      }
      meta {
        totalCount
      }
    }
  }
`;
