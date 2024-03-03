import CommonHeader from "@/_app/common/layouts/componants/CommonHeader";
import { Paper, Text } from "@mantine/core";
import {
  IconAdjustments,
  IconBuildingWarehouse,
  IconPremiumRights,
  IconReportAnalytics,
  IconUsers,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";

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
];

const ModulesPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string }>();
  return (
    <>
      <CommonHeader />
      <div className="grid gap-5 p-10 lg:grid-cols-4">
        {modules.map((module, key) => (
          <Paper
            key={key}
            onClick={() => navigate(`/${params?.tenant}/${module.path}`)}
            withBorder
            p={"xl"}
            className="flex flex-col items-center gap-3 cursor-pointer bg-base"
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
