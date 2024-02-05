import { Header, UnstyledButton, useMantineColorScheme } from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import classnames from "classnames";
import { Link, useParams } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";
import TenantDropdown from "./TenantDropdown";

const CommonHeader = () => {
  const { colorScheme } = useMantineColorScheme();
  const params = useParams<{ tenant: string }>();

  return (
    <Header height={45} className="flex items-center justify-between px-10">
      <div className="flex items-center gap-2">
        <Link
          className="no-underline"
          to={params?.tenant ? `/${params.tenant}/` : "/"}
        >
          Graph360
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <UnstyledButton
          onClick={() => spotlight.open()}
          className={classnames(
            "flex items-center w-[200px] justify-between px-2 py-1 border border-solid rounded-md",
            {
              "border-gray-200": colorScheme == "light",
              "border-gray-700": colorScheme == "dark",
            }
          )}
        >
          <IconSearch
            className={classnames({
              "text-gray-400": colorScheme == "light",
              "text-gray-700": colorScheme == "dark",
            })}
            size={15}
          />
          <div
            className={classnames("p-1 text-xs rounded-md", {
              "bg-gray-100": colorScheme === "light",
              "bg-gray-700": colorScheme === "dark",
            })}
          >
            ⌘ + k
          </div>
        </UnstyledButton>

        <ThemeSwitcher />
        <TenantDropdown />
        <UserMenu />
      </div>
    </Header>
  );
};

export default CommonHeader;
