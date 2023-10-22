import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/_404.page";

import { inventoryModuleRouter } from "./pages/inventory-management/inventory.router";
import ModulesPage from "./pages/modules.page";
import { reportsModuleRouter } from "./pages/reports/report.router";
import { peopleModuleRouter } from "./pages/people/people.route";
import { accountingModuleRouter } from "./pages/accounting/accounting.router";
import { settingModuleRouter } from "./pages/settings/settings.route";

export const rootRouter = createBrowserRouter([
  {
    path: "",
    element: <ModulesPage />,
  },
  {
    path: "accounting",
    children: accountingModuleRouter,
  },
  {
    path: "inventory-Management",
    children: inventoryModuleRouter,
  },
  {
    path: "people",
    children: peopleModuleRouter,
  },
  {
    path: "reports",
    children: reportsModuleRouter,
  },
  {
    path: "settings",
    children: settingModuleRouter,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
