import { AppNavLink } from "@/_app/models/AppNavLink.type";
import { AppShell, NavLink, Navbar, ScrollArea } from "@mantine/core";
import classNames from "classnames";
import React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import CommonHeader from "./componants/CommonHeader";

interface Prop {
  navlinks: AppNavLink[];
  title?: string;
  path: string;
}

const DashboardLayout: React.FC<Prop> = ({ navlinks, title, path }) => {
  const { pathname } = useLocation();
  const params = useParams<{ tenant: string }>();

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
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          width={{ sm: 200, lg: 300 }}
          className="app-sidebar"
        >
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
