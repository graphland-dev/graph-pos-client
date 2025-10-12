import { gql } from "@apollo/client";

export const CASH_FLOW_REPORT_QUERY = gql`
  query CashFlowReport($input: CashFlowFilterInput!) {
    accounting__cashFlowReport(input: $input) {
      summary {
        openingBalance
        totalInflows
        totalOutflows
        netCashFlow
        closingBalance
      }
      timeSeries {
        date
        inflows
        outflows
        netFlow
        balance
      }
      categories {
        category
        amount
        percentage
        transactionCount
        type
      }
    }
  }
`;

export const PROFIT_LOSS_REPORT_QUERY = gql`
  query ProfitLossReport($input: ProfitLossFilterInput!) {
    accounting__profitAndLossSummaryReport(input: $input) {
      summary {
        totalRevenue
        costOfGoodsSold
        grossProfit
        grossProfitMargin
        totalExpenses
        netProfit
        netProfitMargin
      }
      timeSeries {
        period
        revenue
        cogs
        expenses
        grossProfit
        netProfit
      }
      expenseBreakdown {
        category
        amount
        percentage
      }
    }
  }
`;
