import { Menu, Text } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import { useParams } from "react-router-dom";

const TenantDropdown = () => {
  const params = useParams<{ tenant: string }>();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <div className="flex items-center cursor-pointer">
          <Text>{params.tenant}</Text>
          <IconArrowDown size={15} />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Label>Danger zone</Menu.Label>
      </Menu.Dropdown>
    </Menu>
  );
};

export default TenantDropdown;
