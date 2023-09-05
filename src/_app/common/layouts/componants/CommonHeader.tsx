import { Header } from "@mantine/core";
import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";

const CommonHeader = () => {
  return (
    <Header height={45} className="flex px-10 items-center justify-between">
      <Link className="no-underline" to={"/"}>
        Graph ERP
      </Link>
      <div className="flex gap-4 items-center">
        <ThemeSwitcher />
        <UserMenu />
      </div>
    </Header>
  );
};

export default CommonHeader;
