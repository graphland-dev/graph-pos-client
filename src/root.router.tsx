import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/_404.page";
import { accountingModuleRouter } from "./pages/accounting/accounting.router";
import ModulesPage from "./pages/modules.page";

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
    path: "*",
    element: <NotFoundPage />,
  },
]);
