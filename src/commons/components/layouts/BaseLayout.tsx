import { AppShell } from '@mantine/core';
import { Link, Outlet } from 'react-router-dom';
import ThemeSwitcher from './componants/ThemeSwitcher';
import UserMenu from './componants/UserMenu';

const BaseLayout = () => {
  return (
    <>
      <AppShell.Header className="flex items-center justify-between px-10">
        <Link className="no-underline" to={'/'}>
          Graph POS
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </AppShell.Header>
      <Outlet />
    </>
  );
};

export default BaseLayout;
