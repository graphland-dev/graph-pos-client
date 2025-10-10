import { Box } from '@mantine/core';
import { Link, Outlet } from 'react-router-dom';
import ThemeSwitcher from './componants/ThemeSwitcher';
import UserMenu from './componants/UserMenu';

const BaseLayout = () => {
  return (
    <>
      <Box component="header" className="flex items-center justify-between px-10 h-[45px]">
        <Link className="no-underline" to={'/'}>
          Graph ERP
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </Box>
      <Outlet />
    </>
  );
};

export default BaseLayout;
