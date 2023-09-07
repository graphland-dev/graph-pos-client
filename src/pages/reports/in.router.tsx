import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { reportNavlinks } from "./report.navlinks";
import { RouteObject } from "react-router-dom";
import BalanceShit from "../inventory-management/pages/report/balance-shit/balanceShit.page";
import SummeryReport from "../inventory-management/pages/report/summary-report/summaryReport.page";
import ExpenseReport from "../inventory-management/pages/report/expense-report/expenseReport.page";
import LossProfitReport from "../inventory-management/pages/report/loss-profit-report/lossProfitReport.page";

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
      {
        path: "reports",
        children: [
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
    ],
  },
];
