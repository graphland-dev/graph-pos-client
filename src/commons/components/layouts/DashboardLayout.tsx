import { AppNavLink } from "@/commons/models/AppNavLink.type";
import {
  AppShell,
  NavLink,
  ScrollArea,
  UnstyledButton,
  Burger,
  Tooltip,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import CommonHeader from "./componants/CommonHeader";
import { navbarIsCollapsedAtom } from "@/commons/states/navbar.atom";
import { useAtom } from "jotai";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import clsx from "clsx";

interface Prop {
  navlinks: AppNavLink[];
  title?: string;
  path: string;
}

const DashboardLayout: React.FC<Prop> = ({ navlinks, title, path }) => {
  const { pathname } = useLocation();
  const params = useParams<{ tenant: string }>();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopNavbarCollapsed, setDesktopNavbarCollapsed] = useAtom(
    navbarIsCollapsedAtom
  );

  const linkWithTenant = (link: string) => {
    if (params.tenant) return `/${params.tenant}/${link}`;
    return `/${link}`;
  };

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: desktopNavbarCollapsed ? 80 : 280,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header>
        <CommonHeader />
      </AppShell.Header>

      <AppShell.Navbar className="border-r border-border bg-card!">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {!desktopNavbarCollapsed && title && (
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-card-foreground truncate">
                {title}
              </h2>
              <p className="text-xs text-muted-foreground">Module Navigation</p>
            </div>
          )}

          {desktopNavbarCollapsed && title && (
            <Tooltip label={title} position="right" withArrow>
              <div className="flex items-center justify-center w-full">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {title.substring(0, 2).toUpperCase()}
                </div>
              </div>
            </Tooltip>
          )}

          {/* Desktop Collapse Toggle */}
          <UnstyledButton
            onClick={() => setDesktopNavbarCollapsed(!desktopNavbarCollapsed)}
            className={clsx(
              "hidden sm:flex items-center justify-center",
              "w-8 h-8 rounded-lg",
              "hover:bg-muted",
              "transition-colors",
              { "ml-auto": !desktopNavbarCollapsed }
            )}
          >
            {desktopNavbarCollapsed ? (
              <IconChevronRight size={18} className="text-muted-foreground" />
            ) : (
              <IconChevronLeft size={18} className="text-muted-foreground" />
            )}
          </UnstyledButton>

          {/* Mobile Burger */}
          <div className="sm:hidden">
            <Burger opened={mobileOpened} onClick={toggleMobile} size="sm" />
          </div>
        </div>

        <Divider className="hidden sm:block border-border" />

        {/* Navigation Links */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {navlinks.map((item, index) => {
              const isActive = pathname.includes(item?.href as string);
              const navItem = (
                <NavLink
                  key={index}
                  label={desktopNavbarCollapsed ? undefined : item.label}
                  component={Link}
                  to={linkWithTenant(`${path}/${item?.href}`)}
                  leftSection={
                    item.icon ? (
                      <item.icon
                        size={20}
                        className={clsx(
                          "transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                        style={
                          isActive ? { color: "var(--primary)" } : undefined
                        }
                      />
                    ) : undefined
                  }
                  className={clsx(
                    "rounded-lg transition-all duration-200 font-medium",
                    desktopNavbarCollapsed ? "justify-center px-0" : "px-3",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-card-foreground hover:bg-muted"
                  )}
                  active={isActive}
                  onClick={() => {
                    if (mobileOpened) toggleMobile();
                  }}
                  styles={{
                    root: {
                      borderRadius: "0.5rem",
                      marginBottom: "0.25rem",
                    },
                    label: {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    },
                  }}
                >
                  {item?.children &&
                    !desktopNavbarCollapsed &&
                    item.children.map((_item, key) => {
                      const isChildActive = pathname.startsWith(
                        linkWithTenant(`${path}/${item?.href}/${_item.href}`)
                      );
                      return (
                        <NavLink
                          key={key}
                          label={_item.label}
                          component={Link}
                          to={linkWithTenant(
                            `${path}/${item?.href}/${_item.href}`
                          )}
                          className={clsx(
                            "rounded-md text-sm transition-all duration-200",
                            isChildActive
                              ? "bg-accent/70 text-accent-foreground"
                              : "text-muted-foreground hover:bg-muted/50"
                          )}
                          active={isChildActive}
                          onClick={() => {
                            if (mobileOpened) toggleMobile();
                          }}
                          styles={{
                            root: {
                              paddingLeft: "2.5rem",
                              marginTop: "0.25rem",
                            },
                          }}
                        />
                      );
                    })}
                </NavLink>
              );

              // Wrap with Tooltip when collapsed
              if (desktopNavbarCollapsed) {
                return (
                  <Tooltip
                    key={index}
                    label={item.label}
                    position="right"
                    withArrow
                    disabled={false}
                  >
                    {navItem}
                  </Tooltip>
                );
              }

              return navItem;
            })}
          </div>
        </ScrollArea>

        {/* Footer Section */}
        {!desktopNavbarCollapsed && (
          <div className="px-4 py-3 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              Graph POS © 2025
            </div>
          </div>
        )}
      </AppShell.Navbar>

      <AppShell.Main className="bg-background">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
