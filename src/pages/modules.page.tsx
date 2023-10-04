import CommonHeader from "@/_app/common/layouts/componants/CommonHeader";
import { Paper, Text } from "@mantine/core";
import {
  IconAdjustments,
  IconBuildingWarehouse,
  IconPremiumRights,
  IconReportAnalytics,
  IconSettingsCog,
  IconUsers,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    path: "accounting",
    label: "Accounting",
    icon: IconPremiumRights,
  },
  {
    path: "inventory-management",
    label: "Inventory Management",
    icon: IconBuildingWarehouse,
  },
  {
    path: "people",
    label: "People",
    icon: IconUsers,
  },
  {
    path: "reports",
    label: "Reports",
    icon: IconReportAnalytics,
  },
  {
    path: "settings",
    label: "Settings",
    icon: IconAdjustments,
  },
  {
    path: "global-setting",
    label: "Global Settings",
    icon: IconSettingsCog,
  },
];

const ModulesPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <CommonHeader />
      <div className="grid gap-5 p-10 lg:grid-cols-4">
        {modules.map((module, key) => (
          <Paper
            key={key}
            onClick={() => navigate(module.path)}
            withBorder
            p={"xl"}
            className="flex flex-col items-center gap-3 cursor-pointer"
          >
            <module.icon />
            <Text fz={"lg"}>{module.label}</Text>
          </Paper>
        ))}
      </div>
    </>
  );
};

export default ModulesPage;
