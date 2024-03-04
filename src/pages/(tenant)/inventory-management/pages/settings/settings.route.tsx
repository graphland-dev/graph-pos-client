import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { RouteObject } from "react-router-dom";
import BrandPage from "./pages/brand/brand.page";
import UnitPage from "./pages/unit/unit.page";
import VatPage from "./pages/vat/vat.page";
import { settingsNavlinks } from "./settings.navlinks";

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
      // {
      //   path: "",
      //   element: <Navigate to={"/settings/vat-profiles"} />,
      // },
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
