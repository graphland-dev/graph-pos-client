import { Avatar, Menu } from "@mantine/core";

const UserMenu = () => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar title="R" size={"sm"} color="blue" variant="filled" />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
