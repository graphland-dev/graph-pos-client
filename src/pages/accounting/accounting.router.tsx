import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { RouteObject } from "react-router-dom";
import { accountingNavlinks } from "./accounting.navlinks";
import AccountsPage from "./pages/cashbook/accounts/accounts.page";
import AdjustmentPage from "./pages/cashbook/adjustment/adjustment.page";

export const accountingModuleRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout
        navlinks={accountingNavlinks}
        title="Accounting"
        path="accounting"
      />
    ),
    children: [
      {
        path: "cashbook",
        children: [
          {
            path: "accounts",
            element: <AccountsPage />,
          },
          {
            path: "adjustment",
            element: <AdjustmentPage />,
          },
        ],
      },
    ],
  },
];
