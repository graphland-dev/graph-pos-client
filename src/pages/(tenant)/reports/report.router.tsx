import { RouteObject } from "react-router-dom";
import CurrentStockPage from "./pages/current-stock/currentStock.page";
import ExpenseReport from "./pages/expense-report/expenseReport.page";
import FinancialReportsPage from "./pages/financial-reports/financialReports.page";
import ReportsDashboardPage from "./pages/reports-dashboard/reportsDashboard.page";
import SalesAnalyticsPage from "./pages/sales-analytics/salesAnalytics.page";
import SummeryReport from "./pages/summary-report/summaryReport.page";

export const reportsModuleRouter: RouteObject[] = [
  {
    path: "reports",
    element: <ReportsDashboardPage />,
  },
  {
    path: "summary-report",
    element: <SummeryReport />,
  },
  {
    path: "expense-report",
    element: <ExpenseReport />,
  },
  {
    path: "sales-analytics",
    element: <SalesAnalyticsPage />,
  },
  {
    path: "current-stock",
    element: <CurrentStockPage />,
  },
  {
    path: "financial-reports",
    element: <FinancialReportsPage />,
  },
];
