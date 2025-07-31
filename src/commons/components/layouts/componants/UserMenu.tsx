import { userAtom } from "@/commons/states/user.atom";
import { Avatar, Image, Menu } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { getFileUrl } from "../../../utils/getFileUrl";
import { TokenService } from "@/commons/utils/TokenService";

const UserMenu = () => {
  const [currentUser] = useAtom(userAtom);
  function handleLogout(): void {
    openConfirmModal({
      title: "Sure to Logout?",
      labels: {
        cancel: "Cancel",
        confirm: "Logout",
      },
      onConfirm: () => {
        TokenService.removeToken();
        window.location.href = "/auth/login";
      },
    });
  }

  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          {currentUser?.avatar?.path ? (
            <div className="w-8 h-8 cursor-pointer">
              <Image
                fit="cover"
                width={32}
                height={32}
                className="overflow-hidden rounded"
                src={getFileUrl(currentUser?.avatar ?? {})}
              />
            </div>
          ) : (
            <Avatar size={32.8} variant="gradient" className="cursor-pointer">
              <Image
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.name}`}
              />
            </Avatar>
          )}
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{currentUser?.name || "No Name"}</Menu.Label>
          <Menu.Item component={Link} to={"/auth/my-profile"}>
            Profile Settings
          </Menu.Item>
          <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default UserMenu;
