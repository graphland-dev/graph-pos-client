import * as React from "react";
import { AppNavLink } from "@/commons/models/AppNavLink.type";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/commons/shadcn/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavUser } from "./NavUser";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navlinks: AppNavLink[];
  title?: string;
  path: string;
}

export function AppSidebar({
  navlinks,
  title,
  path,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navlinks} path={path} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

