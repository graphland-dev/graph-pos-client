import { Breadcrumbs } from '@/commons/components/layouts/components/Breadcrumbs';
import { AppNavLink } from '@/commons/models/AppNavLink.type';
import { Separator } from '@/commons/shadcn/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/commons/shadcn/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './components/AppSidebar';
import { HeaderSearch } from './components/HeaderSearch';
import { HeaderThemeSwitcher } from './components/HeaderThemeSwitcher';

interface UnifiedDashboardLayoutProps {
  navlinks: AppNavLink[];
  title?: string;
  path: string;
}

export function UnifiedDashboardLayout({
  navlinks,
  title,
  path,
}: UnifiedDashboardLayoutProps) {
  return (
    <SidebarProvider className="h-svh w-full overflow-hidden">
      <AppSidebar navlinks={navlinks} title={title} path={path} />
      <SidebarInset className="flex flex-col min-w-0 h-svh">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border/30 bg-background px-4 w-[calc(100vw-var(--sidebar-width))] peer-data-[state=collapsed]:w-[calc(100vw-var(--sidebar-width-icon))] ml-auto transition-[width] duration-200">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-border/30" />
          <Breadcrumbs />
          <div className="ml-auto flex items-center gap-2">
            <HeaderSearch />
            <HeaderThemeSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pt-6 min-h-0 w-[calc(100vw-var(--sidebar-width))] peer-data-[state=collapsed]:w-[calc(100vw-var(--sidebar-width-icon))] ml-auto transition-[width] duration-200">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
