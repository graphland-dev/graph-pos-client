import { Header } from "@mantine/core";
import { Link, Outlet } from "react-router-dom";
import ThemeSwitcher from "./componants/ThemeSwitcher";
import UserMenu from "./componants/UserMenu";

const BaseLayout = () => {
  return (
    <>
      <Header height={45} className="flex items-center justify-between px-10">
        <Link className="no-underline" to={"/"}>
          Graph ERP
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </Header>
      <Outlet />
    </>
  );
};

export default BaseLayout;
