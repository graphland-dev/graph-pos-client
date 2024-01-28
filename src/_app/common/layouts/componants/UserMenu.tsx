import { userAtom } from "@/_app/states/user.atom";
import { Avatar, Menu } from "@mantine/core";
import { useAtom } from "jotai";

const UserMenu = () => {
  const [currentUser] = useAtom(userAtom);
  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Avatar size={"sm"} color="blue" variant="filled">
            {currentUser?.name?.slice(0, 1)}
          </Avatar>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default UserMenu;
