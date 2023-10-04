import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { Navigate, RouteObject } from "react-router-dom";
import { settingsNavlinks } from "./settings.navlinks";
import VatPage from "./pages/vat/vat.page";
import UnitPage from "./pages/unit/unit.page";
import BrandPage from "./pages/brand/brand.page";

export const settingModuleRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout
        navlinks={settingsNavlinks}
        title="Settings"
        path="settings"
      />
    ),
    children: [
      {
        path: "",
        element: <Navigate to={"/settings/vat-profiles"} />,
      },
      {
        path: "vat-profiles",
        element: <VatPage />,
      },
      {
        path: "units",
        element: <UnitPage />,
      },
      {
        path: "brands",
        element: <BrandPage />,
      },
    ],
  },
];
