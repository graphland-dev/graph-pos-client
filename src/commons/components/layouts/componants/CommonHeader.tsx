import { Header, UnstyledButton } from '@mantine/core';
import { spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { Link, useParams } from 'react-router-dom';
import TenantDropdown from './TenantDropdown';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from './UserMenu';

const CommonHeader = () => {
  // const { colorScheme } = useMantineColorScheme();
  const params = useParams<{ tenant: string }>();
  // const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  // const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <Header
      height={45}
      className="flex items-center justify-between px-2 border-0 app-common-header"
    >
      <div className="flex items-center gap-2">
        <HamburgerButton />
        <Link
          className="no-underline uppercase app-common-header__logo"
          to={params?.tenant ? `/${params.tenant}/` : '/'}
        >
          Graph POS
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <UnstyledButton
          onClick={() => spotlight.open()}
          className={clsx(
            'flex items-center w-[200px] justify-between px-2 py-1 rounded-md spotlight',
          )}
        >
          <IconSearch className="spotlight__search-icon" size={15} />
          <div
            className={clsx(
              'p-1 text-xs rounded-md spotlight__command-label',
            )}
          >
            ⌘ + k
          </div>
        </UnstyledButton>

        <ThemeSwitcher />
        <TenantDropdown />
        <UserMenu />
      </div>
    </Header>
  );
};

const HamburgerButton = () => {
  return (
    <div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default CommonHeader;
