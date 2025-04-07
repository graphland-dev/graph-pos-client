import { AppNavLink } from '@/commons/models/AppNavLink.type';
import { navbarIsCollapsedAtom } from '@/commons/states/navbar.atom';
import { AppShell, NavLink } from '@mantine/core';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import React from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import CommonHeader from './componants/CommonHeader';

interface Prop {
  navlinks: AppNavLink[];
  title?: string;
  path: string;
}

const DashboardLayout: React.FC<Prop> = ({ path, navlinks, title }) => {
  const { pathname } = useLocation();
  const params = useParams<{ tenant: string }>();

  const [desktopNavbarCollapsed, setDesktopNavbarCollapsed] = useAtom(
    navbarIsCollapsedAtom,
  );

  const linkWithTenant = (link: string) => {
    if (params.tenant) return `/${params.tenant}/${link}`;
    return `/${link}`;
  };

  return (
    <AppShell
      layout="alt"
      classNames={{
        root: 'app-shell-root',
        main: 'app-shell-main',
      }}
      styles={{
        root: {
          '--mantine-navbar-width': desktopNavbarCollapsed ? '1px' : '18.75rem',
        },
      }}
    >
      <AppShell.Header>
        <CommonHeader />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navlinks.map((item, index) => (
          <NavLink
            key={index}
            label={item.label}
            component={Link}
            to={linkWithTenant(`${path}/${item?.href}`)}
            leftSection={
              item.icon ? (
                <item.icon size="1.2rem" className="app-navbar-item__icon" />
              ) : undefined
            }
            className={clsx('text-white rounded-md app-shell__navbar-item')}
            active={pathname.includes(item?.href as string)}
          >
            {item?.children &&
              item.children.map((_item, key) => (
                <NavLink
                  key={key}
                  label={_item.label}
                  component={Link}
                  px={'xs'}
                  py={2}
                  className="app-navbar-item"
                  active={pathname.startsWith(
                    linkWithTenant(`${path}/${item?.href}/${_item.href}`),
                  )}
                  to={linkWithTenant(`${path}/${item?.href}/${_item.href}`)}
                />
              ))}
          </NavLink>
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );

  // const [opened, { toggle }] = useDisclosure();

  // return (
  //   <AppShell
  //     header={{ height: 60 }}
  //     navbar={{
  //       width: 300,
  //       breakpoint: 'sm',
  //       collapsed: { mobile: !opened },
  //     }}
  //     padding="md"
  //   >
  //     <AppShell.Header>
  //       <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
  //       <div>Logo</div>
  //     </AppShell.Header>

  //     <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

  //     <AppShell.Main>Main</AppShell.Main>
  //   </AppShell>
  // );
};

export default DashboardLayout;
