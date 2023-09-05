import { Header } from "@mantine/core";
import { Link, Outlet } from "react-router-dom";
import ThemeSwitcher from "./componants/ThemeSwitcher";
import UserMenu from "./componants/UserMenu";

const BaseLayout = () => {
  return (
    <>
      <Header height={45} className="flex px-10 items-center justify-between">
        <Link className="no-underline" to={"/"}>
          Graph ERP
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </Header>

      <Outlet />
    </>
  );
};

export default BaseLayout;
