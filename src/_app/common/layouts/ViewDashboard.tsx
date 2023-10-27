import { AppShell, Navbar, ScrollArea } from "@mantine/core";
import React, { PropsWithChildren } from "react";

interface Prop {
  TopSection: React.ReactNode;
  NavSection: React.ReactNode;
}

const ViewDashboardLayout: React.FC<PropsWithChildren<Prop>> = ({
  children,
  TopSection,
  NavSection,
}) => {
  
  return (
    <AppShell
      m={0}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
          {TopSection && <Navbar.Section p={"sm"}>{TopSection}</Navbar.Section>}
          {NavSection && (
            <Navbar.Section grow mt="md" component={ScrollArea}>
              {NavSection}
            </Navbar.Section>
          )}
        </Navbar>
      }
    >
      {children}
    </AppShell>
  );
};

export default ViewDashboardLayout;
