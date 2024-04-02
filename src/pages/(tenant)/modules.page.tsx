import CommonHeader from "@/_app/common/layouts/componants/CommonHeader";
import { Button, Text } from "@mantine/core";
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
            className="flex flex-col items-center justify-center gap-2 p-5 py-12 border-2 rounded cursor-pointer bg-base border-stone-300"
          >
            <module.icon />
            <Text className="text-xl ">{module.label}</Text>
          </div>
        ))}
      </div>

      <div className="flex gap-3 p-10">
        <Button color="theme.0">Button 0</Button>
        <Button color="theme.1">Button 1</Button>
        <Button color="theme.2">Button 2</Button>
        <Button color="theme.3">Button 3</Button>
        <Button color="theme.4">Button 4</Button>
        <Button color="theme.5">Button 5</Button>
        <Button color="theme.6">Button 6</Button>
        <Button color="theme.7">Button 7</Button>
        <Button color="theme.8">Button 8</Button>
        <Button color="theme.9">Button 9</Button>
      </div>
    </>
  );
};

export default ModulesPage;
