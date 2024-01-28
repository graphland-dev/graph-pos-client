import { Navigate, createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/_404.page";

import { inventoryModuleRouter } from "./pages/(tenant)/inventory-management/inventory.router";
import ModulesPage from "./pages/(tenant)/modules.page";
import { reportsModuleRouter } from "./pages/(tenant)/reports/report.router";
import { peopleModuleRouter } from "./pages/(tenant)/people/people.route";
import { accountingModuleRouter } from "./pages/(tenant)/accounting/accounting.router";
import { settingModuleRouter } from "./pages/(tenant)/settings/settings.route";
import { authRouter } from "./pages/auth/auth.router";
import SelectOrganization from "./pages/select-organization.page";
import TenantResolver from "./pages/(tenant)/tenant-resolver";
import { AuthGuardedWrapper } from "./_app/common/components/AuthGuardedWrapper";

export const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/select-tenant" />,
  },
  {
    path: "/select-tenant",
    element: <SelectOrganization />,
  },
  {
    path: "/auth",
    children: authRouter,
  },
  {
    path: "/:tenant",
    element: (
      <AuthGuardedWrapper>
        <TenantResolver />
      </AuthGuardedWrapper>
    ),
    children: [
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
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
