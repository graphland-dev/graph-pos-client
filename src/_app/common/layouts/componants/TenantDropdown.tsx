import { Menu, Text } from "@mantine/core";

const TenantDropdown = () => {
  //   const [tenant, setTenant] = useState(null);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <div className="flex">
          <Text>tenant</Text>
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
