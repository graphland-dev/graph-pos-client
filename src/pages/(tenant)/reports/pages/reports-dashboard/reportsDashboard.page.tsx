import PageTitle from "@/commons/components/PageTitle";
import {
  ExpensesWithPagination,
  ProductInvoicesWithPagination,
  ProductPurchasesWithPagination,
  SalesSummaryResponse,
  ExpenseReportResponse,
  CurrentStockResponse,
} from "@/commons/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Text } from "@mantine/core";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DASHBOARD_SUMMARY_QUERY,
  RECENT_EXPENSES_QUERY,
  RECENT_PURCHASES_QUERY,
  RECENT_SALES_QUERY,
} from "./utils/query.reports-dashboard";
import ExecutiveKpiCards from "./ExecutiveKpiCards";
import QuickStatsRow from "./QuickStatsRow";
import LatestExpenses from "./LatestExpenses";
import RecentPurchases from "./RecentPurchases";
import RecentSales from "./RecentSales";
import QuickAccessReports from "./QuickAccessReports";
import DateRangeFilter from "./DateRangeFilter";
import { MatchOperator } from "@/commons/graphql-models/graphql";

const ReportsDashboardPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string }>();
  // Shared date range (default last 30 days)
  const defaultEnd = new Date().toISOString().split("T")[0];
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const defaultStart = oneYearAgo.toISOString().split("T")[0];

  const [startDateVal, setStartDateVal] = useState<string | undefined>(
    defaultStart
  );
  const [endDateVal, setEndDateVal] = useState<string | undefined>(defaultEnd);

  const dateRange = useMemo(() => {
    return {
      startDate: startDateVal,
      endDate: endDateVal,
    } as { startDate?: string; endDate?: string };
  }, [startDateVal, endDateVal]);

  // Fetch dashboard summary
  const { data: summaryData, loading: summaryLoading } = useQuery<{
    salesSummary: SalesSummaryResponse;
    expenseSummary: ExpenseReportResponse;
    stockSummary: CurrentStockResponse;
  }>(DASHBOARD_SUMMARY_QUERY, {
    variables: {
      salesInput: {
        startDate: dateRange.startDate ?? defaultStart,
        endDate: dateRange.endDate ?? defaultEnd,
      },
      expenseInput: {
        startDate: dateRange.startDate ?? defaultStart,
        endDate: dateRange.endDate ?? defaultEnd,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  // Fetch recent expenses (last 10)
  const { data: expensesData, loading: expensesLoading } = useQuery<{
    accounting__expenses: ExpensesWithPagination;
  }>(RECENT_EXPENSES_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 10,
        filters: [
          ...(dateRange.startDate
            ? [
                {
                  key: "date",
                  operator: MatchOperator.Gte,
                  value: dateRange.startDate,
                },
              ]
            : []),
          ...(dateRange.endDate
            ? [
                {
                  key: "date",
                  operator: MatchOperator.Lte,
                  value: dateRange.endDate,
                },
              ]
            : []),
        ],
      },
    },
    fetchPolicy: "cache-and-network",
  });

  // Fetch recent purchases (last 10)
  const { data: purchasesData, loading: purchasesLoading } = useQuery<{
    inventory__productPurchases: ProductPurchasesWithPagination;
  }>(RECENT_PURCHASES_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 10,
        filters: [
          ...(dateRange.startDate
            ? [
                {
                  key: "purchaseDate",
                  operator: MatchOperator.Gte,
                  value: dateRange.startDate,
                },
              ]
            : []),
          ...(dateRange.endDate
            ? [
                {
                  key: "purchaseDate",
                  operator: MatchOperator.Lte,
                  value: dateRange.endDate,
                },
              ]
            : []),
        ],
      },
    },
    fetchPolicy: "cache-and-network",
  });

  // Fetch recent sales (last 10)
  const { data: salesData, loading: salesLoading } = useQuery<{
    inventory__productInvoices: ProductInvoicesWithPagination;
  }>(RECENT_SALES_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 10,
        filters: [
          ...(dateRange.startDate
            ? [
                {
                  key: "date",
                  operator: MatchOperator.Gte,
                  value: dateRange.startDate,
                },
              ]
            : []),
          ...(dateRange.endDate
            ? [
                {
                  key: "date",
                  operator: MatchOperator.Lte,
                  value: dateRange.endDate,
                },
              ]
            : []),
        ],
      },
    },
    fetchPolicy: "cache-and-network",
  });

  // Net profit is derived in ExecutiveKpiCards when rendering.

  return (
    <>
      <PageTitle title="Reports Dashboard" />

      <div className="mb-6">
        <Text size="xl" fw={600}>
          Reports Dashboard
        </Text>
        <Text size="sm" c="dimmed">
          Executive overview and recent business activity (Last 1 year)
        </Text>
      </div>

      <DateRangeFilter
        startDate={startDateVal}
        endDate={endDateVal}
        onChange={(s, e) => {
          setStartDateVal(s);
          setEndDateVal(e);
        }}
      />

      <ExecutiveKpiCards
        summaryLoading={summaryLoading}
        salesSummary={summaryData?.salesSummary}
        expenseSummary={summaryData?.expenseSummary}
        stockSummary={summaryData?.stockSummary}
      />

      <QuickStatsRow
        summaryLoading={summaryLoading}
        salesSummary={summaryData?.salesSummary}
        stockSummary={summaryData?.stockSummary}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LatestExpenses
          loading={expensesLoading}
          expenses={expensesData?.accounting__expenses}
          onViewAll={() => navigate("../expense-report")}
        />
        <RecentPurchases
          loading={purchasesLoading}
          purchases={purchasesData?.inventory__productPurchases}
          onViewAll={() =>
            navigate(`/${params.tenant}/inventory-management/purchases`)
          }
        />
        <RecentSales
          loading={salesLoading}
          sales={salesData?.inventory__productInvoices}
          onViewAll={() =>
            navigate(`/${params.tenant}/inventory-management/invoices`)
          }
        />
      </div>

      <QuickAccessReports
        onSalesAnalytics={() => navigate("../sales-analytics")}
        onExpenseReport={() => navigate("../expense-report")}
        onCurrentStock={() => navigate("../current-stock")}
        onFinancialReports={() => navigate("../financial-reports")}
      />
    </>
  );
};

export default ReportsDashboardPage;
