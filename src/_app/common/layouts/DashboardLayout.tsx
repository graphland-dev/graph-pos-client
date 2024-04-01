import { AppNavLink } from "@/_app/models/AppNavLink.type";
import {
  AppShell,
  NavLink,
  Navbar,
  ScrollArea,
  UnstyledButton,
  clsx,
} from "@mantine/core";
import classNames from "classnames";
import React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import CommonHeader from "./componants/CommonHeader";
import { navbarIsCollapsedAtom } from "@/_app/states/navbar.atom";
import { useAtom } from "jotai";
import { IconChevronLeft } from "@tabler/icons-react";

interface Prop {
  navlinks: AppNavLink[];
  title?: string;
  path: string;
}

const DashboardLayout: React.FC<Prop> = ({ navlinks, title, path }) => {
  const { pathname } = useLocation();
  const params = useParams<{ tenant: string }>();

  const [desktopNavbarCollapsed, setDesktopNavbarCollapsed] = useAtom(
    navbarIsCollapsedAtom
  );

  const linkWithTenant = (link: string) => {
    if (params.tenant) return `/${params.tenant}/${link}`;
    return `/${link}`;
  };

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      header={<CommonHeader />}
      layout="alt"
      styles={{
        root: {
          "--mantine-navbar-width": desktopNavbarCollapsed ? "1px" : "18.75rem",
        },
        main: {
          // paddingTop: 0,
        },
      }}
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          width={{ sm: 300 }}
          className="transition-all duration-300 border-0 app-sidebar"
          left={desktopNavbarCollapsed ? -300 : 0}
        >
          <UnstyledButton
            onClick={() => setDesktopNavbarCollapsed(!desktopNavbarCollapsed)}
            className={clsx(
              "absolute top-14 -right-4 bg-theme-primary text-theme-light",
              {
                "-right-6": desktopNavbarCollapsed,
              }
            )}
          >
            <IconChevronLeft
              size={30}
              className={clsx("transition-all duration-300", {
                "rotate-180": desktopNavbarCollapsed,
              })}
            />
          </UnstyledButton>

          {title && (
            <Navbar.Section p={"sm"}>
              <p className="font-semibold uppercase app-module-title">
                {title}
              </p>
            </Navbar.Section>
          )}
          <Navbar.Section grow mt="md" component={ScrollArea}>
            {navlinks.map((item, index) => (
              <NavLink
                key={index}
                label={item.label}
                component={Link}
                to={linkWithTenant(`${path}/${item?.href}`)}
                icon={
                  item.icon ? (
                    <item.icon
                      size="1.2rem"
                      className="app-navbar-item__icon"
                    />
                  ) : undefined
                }
                className={classNames("text-white rounded-md app-navbar-item")}
                active={pathname.includes(item?.href as string)}
              >
                {item?.children &&
                  item.children.map((_item, key) => (
                    <NavLink
                      key={key}
                      label={_item.label}
                      component={Link}
                      px={"xs"}
                      py={2}
                      className="app-navbar-item"
                      active={pathname.startsWith(
                        linkWithTenant(`${path}/${item?.href}/${_item.href}`)
                      )}
                      to={linkWithTenant(`${path}/${item?.href}/${_item.href}`)}
                    />
                  ))}
              </NavLink>
            ))}
          </Navbar.Section>
        </Navbar>
      }
    >
      <Outlet />
    </AppShell>
  );
};

export default DashboardLayout;
