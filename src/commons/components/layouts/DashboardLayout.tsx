import { AppNavLink } from '@/commons/models/AppNavLink.type';
import {
  AppShell,
  NavLink,
  ScrollArea,
  UnstyledButton,
  Burger,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import CommonHeader from './componants/CommonHeader';
import { navbarIsCollapsedAtom } from '@/commons/states/navbar.atom';
import { useAtom } from 'jotai';
import { IconChevronLeft } from '@tabler/icons-react';
import clsx from 'clsx';

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
    navbarIsCollapsedAtom,
  );

  const linkWithTenant = (link: string) => {
    if (params.tenant) return `/${params.tenant}/${link}`;
    return `/${link}`;
  };

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: desktopNavbarCollapsed ? 72 : 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: desktopNavbarCollapsed },
      }}
      padding="md"
    >
      <AppShell.Header>
        <CommonHeader />
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        className="transition-all duration-300 border-0 app-shell__navbar"
      >
        {/* Desktop Collapse Button */}
        <UnstyledButton
          onClick={() => setDesktopNavbarCollapsed(!desktopNavbarCollapsed)}
          className={clsx(
            'absolute top-14 -right-4 z-10 bg-primary-500 text-white rounded-full p-1 shadow-md hover:bg-primary-600 transition-colors',
            'hidden sm:flex items-center justify-center',
            {
              '-right-6': desktopNavbarCollapsed,
            },
          )}
        >
          <IconChevronLeft
            size={24}
            className={clsx('transition-all duration-300', {
              'rotate-180': desktopNavbarCollapsed,
            })}
          />
        </UnstyledButton>

        {/* Mobile Burger (hidden on desktop) */}
        <div className="sm:hidden mb-4">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            size="sm"
          />
        </div>

        {/* Title Section */}
        {title && (
          <div className="p-2 mb-4">
            <p className="font-semibold uppercase text-sm tracking-wide app-module-title">
              {title}
            </p>
          </div>
        )}

        {/* Navigation Links */}
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {navlinks.map((item, index) => (
              <NavLink
                key={index}
                label={desktopNavbarCollapsed ? undefined : item.label}
                component={Link}
                to={linkWithTenant(`${path}/${item?.href}`)}
                leftSection={
                  item.icon ? (
                    <item.icon
                      size={20}
                      className="app-navbar-item__icon"
                    />
                  ) : undefined
                }
                className={clsx(
                  'rounded-md app-shell__navbar-item',
                )}
                active={pathname.includes(item?.href as string)}
                onClick={() => {
                  // Close mobile menu when clicking a link
                  if (mobileOpened) toggleMobile();
                }}
              >
                {item?.children &&
                  item.children.map((_item, key) => (
                    <NavLink
                      key={key}
                      label={desktopNavbarCollapsed ? undefined : _item.label}
                      component={Link}
                      className="app-navbar-item text-sm"
                      active={pathname.startsWith(
                        linkWithTenant(`${path}/${item?.href}/${_item.href}`),
                      )}
                      to={linkWithTenant(`${path}/${item?.href}/${_item.href}`)}
                      onClick={() => {
                        // Close mobile menu when clicking a child link
                        if (mobileOpened) toggleMobile();
                      }}
                    />
                  ))}
              </NavLink>
            ))}
          </div>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
