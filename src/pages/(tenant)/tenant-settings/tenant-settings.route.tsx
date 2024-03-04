import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { RouteObject } from "react-router-dom";
import OrganizationOverviewPage from "./organization-overview/organization-overview.page";
import RolesPage from "./roles/roles.page";
import { tenantSettingsNavlinks } from "./tenant-settings.navlinks";
import UsersPage from "./users/users.page";

export const tenantSettingRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout
        navlinks={tenantSettingsNavlinks}
        title="Organization Settings"
        path={"tenant-settings"}
      />
    ),
    children: [
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
    ],
  },
];
