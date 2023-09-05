import CommonHeader from "@/_app/common/layouts/componants/CommonHeader";
import { Paper, Text } from "@mantine/core";
import {
  IconAdjustments,
  IconBuildingWarehouse,
  IconCashBanknote,
  IconUsers,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    path: "accounting",
    label: "Accounting",
    icon: IconCashBanknote,
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
    path: "settings",
    label: "Settings",
    icon: IconAdjustments,
  },
];

const ModulesPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <CommonHeader />
      <div className="grid lg:grid-cols-4 p-10 gap-10">
        {modules.map((module) => (
          <Paper
            onClick={() => navigate(module.path)}
            withBorder
            p={"md"}
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
