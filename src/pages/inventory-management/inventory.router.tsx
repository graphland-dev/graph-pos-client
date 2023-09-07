import { RouteObject } from "react-router-dom";
import AccountsPage from "../accounting/pages/cashbook/accounts/accounts.page";
import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { inventoryNavlinks } from "./inventory.navlinks";

export const inventoryModuleRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout
        navlinks={inventoryNavlinks}
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
        ],
      },
    ],
  },
];
