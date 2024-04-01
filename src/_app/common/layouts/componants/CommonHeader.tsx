import { Burger, Header, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import classnames from "classnames";
import { Link, useParams } from "react-router-dom";
import TenantDropdown from "./TenantDropdown";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";
import { useAtom } from "jotai";
import { navbarIsCollapsedAtom } from "@/_app/states/navbar.atom";

const CommonHeader = () => {
  // const { colorScheme } = useMantineColorScheme();
  const params = useParams<{ tenant: string }>();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  // const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [desktopNavbarCollapsed, setDesktopNavbarCollapsed] = useAtom(
    navbarIsCollapsedAtom
  );

  return (
    <Header
      height={45}
      className="flex items-center justify-between px-2 border-0 app-common-header"
    >
      <div className="flex items-center gap-2">
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          className="sm:hidden"
          size="sm"
        />
        <Burger
          opened={!desktopNavbarCollapsed}
          onClick={() => setDesktopNavbarCollapsed(!desktopNavbarCollapsed)}
          className="hidden sm:block"
          size="sm"
          color="white"
        />
        <Link
          className="no-underline uppercase app-common-header__logo"
          to={params?.tenant ? `/${params.tenant}/` : "/"}
        >
          Graph360
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <UnstyledButton
          onClick={() => spotlight.open()}
          className={classnames(
            "flex items-center w-[200px] justify-between px-2 py-1 rounded-md spotlight"
          )}
        >
          <IconSearch className="spotlight__search-icon" size={15} />
          <div
            className={classnames(
              "p-1 text-xs rounded-md spotlight__command-label"
            )}
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
