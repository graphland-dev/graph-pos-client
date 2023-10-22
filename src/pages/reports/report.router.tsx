import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { RouteObject } from "react-router-dom";
import BalanceShit from "./pages/balance-shit/balanceShit.page";
import ExpenseReport from "./pages/expense-report/expenseReport.page";
import LossProfitReport from "./pages/loss-profit-report/lossProfitReport.page";
import SummeryReport from "./pages/summary-report/summaryReport.page";
import { reportNavlinks } from "./report.navlinks";

export const reportsModuleRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout
        navlinks={reportNavlinks}
        title="Reports"
        path="reports"
      />
    ),
    children: [
      // {
      //   path: "",
      //   element: <Navigate to={"/reports/balance-shit"} />,
      // },
      {
        path: "reports",
      },
      {
        path: "balance-shit",
        element: <BalanceShit />,
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
        path: "loss-profit-report",
        element: <LossProfitReport />,
      },
    ],
  },
];
