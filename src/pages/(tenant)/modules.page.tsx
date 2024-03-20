import CommonHeader from "@/_app/common/layouts/componants/CommonHeader";
import { Text } from "@mantine/core";
import {
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
  // {
  //   path: "settings",
  //   label: "Settings",
  //   icon: IconAdjustments,
  // },
];

const ModulesPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string }>();
  return (
    <>
      <CommonHeader />
      <div className="grid gap-5 p-10 lg:grid-cols-4">
        {modules.map((module, key) => (
          <div
            key={key}
            onClick={() => navigate(`/${params?.tenant}/${module.path}`)}
            className="flex flex-col  cursor-pointer bg-base border-2 border-stone-300 rounded  p-5 py-12  justify-center items-center gap-2"
          >
            <module.icon />
            <Text className=" text-xl">{module.label}</Text>
          </div>
        ))}
      </div>
    </>
  );
};

export default ModulesPage;
