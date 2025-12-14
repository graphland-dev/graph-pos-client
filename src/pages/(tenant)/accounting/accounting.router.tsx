import { RouteObject } from "react-router-dom";
import AccountsPage from "./pages/cashbook/accounts/accounts.page";
import AdjustmentPage from "./pages/cashbook/adjustment/adjustment.page";
import PayrollPage from "./pages/cashbook/payroll/payroll.page";
import StatementPage from "./pages/cashbook/statements/statements.page";
import TransferPage from "./pages/cashbook/transfers/transfer.page";
import ExpenseCategoryPage from "./pages/expense/expenseCategory/expenseCategory.page";
import ExpenseListPage from "./pages/expense/expenseList/expenseList.page";
import AccountingRoot from "./module-root.page";

export const accountingModuleRouter: RouteObject[] = [
  {
    path: "",
    element: <AccountingRoot />,
  },
  {
    path: "cashbook",
    children: [
      {
        path: "accounts",
        element: <AccountsPage />,
      },
      {
        path: "adjustments",
        element: <AdjustmentPage />,
      },
      {
        path: "transfers",
        element: <TransferPage />,
      },
      {
        path: "statements",
        element: <StatementPage />,
      },
      {
        path: "payroll",
        element: <PayrollPage />,
      },
    ],
  },
  {
    path: "expense",
    children: [
      {
        path: "expense-list",
        element: <ExpenseListPage />,
      },
      {
        path: "expense-category",
        element: <ExpenseCategoryPage />,
      },
    ],
  },
];
