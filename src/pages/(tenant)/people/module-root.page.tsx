import ModuleMenu from "@/commons/components/Modulemenu.tsx";
import { useParams } from "react-router-dom";

const PeopleModuleRoot = () => {
  const params = useParams<{ tenant: string }>();
  return (
    <div className="mt-10">
      <ModuleMenu
        moduleName={"People"}
        items={[
          {
            name: "Clients",
            iconPath: "/menu-icons/client.png",
            linkPath: `/${params.tenant}/people/client`,
          },
          {
            name: "Suppliers",
            iconPath: "/menu-icons/supplier.png",
            linkPath: `/${params.tenant}/people/suppliers`,
          },
          {
            name: "Employees",
            iconPath: "/menu-icons/employees.png",
            linkPath: `/${params.tenant}/people/employees/employees`,
          },
        ]}
      />
    </div>
  );
};

export default PeopleModuleRoot;
