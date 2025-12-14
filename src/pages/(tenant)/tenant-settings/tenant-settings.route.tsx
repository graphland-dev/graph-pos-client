import { RouteObject } from "react-router-dom";
import OrganizationOverviewPage from "./organization-overview/organization-overview.page";
import RolesPage from "./roles/roles.page";
import UsersPage from "./users/users.page";

export const tenantSettingRouter: RouteObject[] = [
  {
    path: "",
    element: <OrganizationOverviewPage />,
  },
  {
    path: "roles",
    element: <RolesPage />,
  },
  {
    path: "users",
    element: <UsersPage />,
  },
];
