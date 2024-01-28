import { userTenantsAtom } from "@/_app/states/user.atom";
import { Menu, Text } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";

const TenantDropdown = () => {
  const params = useParams<{ tenant: string }>();
  const [tenants] = useAtom(userTenantsAtom);

  const getTenantByUId = (tenantId: string) => {
    const tenant = tenants?.find((tenant) => tenant.uid === tenantId);
    return tenant;
  };

  function handleSwitchTenant(uid: string): void {
    window.location.href = `/${uid}`;
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <div className="flex items-center cursor-pointer">
          <Text>{getTenantByUId(params.tenant!)?.name || "Select tenant"}</Text>
          <IconArrowDown size={15} />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Choose Organization</Menu.Label>
        {tenants?.map((tenant, key) => (
          <Menu.Item
            component="button"
            onClick={() => handleSwitchTenant(tenant.uid!)}
            key={key}
          >
            {tenant.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default TenantDropdown;
