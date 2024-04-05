import ModuleMenu from "@/_app/common/components/Modulemenu";
import CommonHeader from "@/_app/common/layouts/componants/CommonHeader";
import { useParams } from "react-router-dom";

const ModulesPage = () => {
  const params = useParams<{ tenant: string }>();
  return (
    <>
      <CommonHeader />
      {/* <div className="grid gap-5 p-10 lg:grid-cols-4">
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
      </div> */}
      <div className="m-10">
        <ModuleMenu
          moduleName={"Graph360 Apps"}
          items={[
            {
              name: "Accounting",
              iconPath: "/menu-icons/budget.png",
              linkPath: `/${params.tenant}/accounting`,
            },
            {
              name: "Inventory",
              iconPath: "/menu-icons/warehouse.png",
              linkPath: `/${params.tenant}/inventory-management`,
            },
            {
              name: "Pos",
              iconPath: "/menu-icons/pos-terminal.png",
              linkPath: `/${params.tenant}/inventory-management/pos`,
            },
            {
              name: "People",
              iconPath: "/menu-icons/supplier.png",
              linkPath: `/${params.tenant}/people`,
            },
            {
              name: "Reports",
              iconPath: "/menu-icons/report.png",
              linkPath: `/${params.tenant}/reports`,
            },
          ]}
        />
      </div>

      {/* <div className="flex gap-3 p-10">
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
      </div> */}
    </>
  );
};

export default ModulesPage;
