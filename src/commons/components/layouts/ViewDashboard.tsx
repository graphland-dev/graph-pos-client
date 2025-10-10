import { AppShell, Burger, ScrollArea, UnstyledButton } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useAtom } from "jotai";
import { navbarIsCollapsedAtom } from "@/commons/states/navbar.atom";
import { useLocation } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import clsx from "clsx";

interface Prop {
  TopSection: React.ReactNode;
  NavSection: React.ReactNode;
}

const ViewDashboardLayout: React.FC<PropsWithChildren<Prop>> = ({
  children,
  TopSection,
  NavSection,
}) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [collapsed, setCollapsed] = useAtom(navbarIsCollapsedAtom);
  const { pathname } = useLocation();

  const moduleTitle = (() => {
    if (pathname.includes("/inventory-management")) return "Inventory";
    if (pathname.includes("/accounting")) return "Accounting";
    if (pathname.includes("/people")) return "People";
    if (pathname.includes("/reports")) return "Reports";
    return "Module";
  })();

  return (
    <AppShell
      m={0}
      navbar={{
        width: collapsed ? 72 : 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: collapsed },
      }}
      padding={0}
    >
      <AppShell.Navbar
        p="md"
        className={clsx({ "app-navbar-collapsed": collapsed })}
      >
        <UnstyledButton
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "absolute top-4 -right-4 z-10 bg-primary text-white rounded-full p-1 shadow-md hover:bg-primary-600 transition-colors",
            "hidden sm:flex items-center justify-center",
            { "-right-6": collapsed }
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <IconChevronLeft
            size={20}
            className={clsx("transition-all duration-300", {
              "rotate-180": collapsed,
            })}
          />
        </UnstyledButton>

        <div className="sm:hidden mb-4">
          <Burger opened={mobileOpened} onClick={toggleMobile} size="sm" />
        </div>

        <div className="p-2 mb-4">
          <p className="font-semibold uppercase text-sm tracking-wide app-module-title">
            {moduleTitle}
          </p>
        </div>

        {TopSection && <div className="p-sm">{TopSection}</div>}
        {NavSection && (
          <ScrollArea style={{ flex: 1 }}>{NavSection}</ScrollArea>
        )}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default ViewDashboardLayout;
