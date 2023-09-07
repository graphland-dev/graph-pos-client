import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/_404.page";
import { accountingModuleRouter } from "./pages/accounting/accounting.router";
import ModulesPage from "./pages/modules.page";
import { inventoryModuleRouter } from "./pages/inventory-management/inventory.router";

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
    path: "*",
    element: <NotFoundPage />,
  },
]);
