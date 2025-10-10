import { Modal, UnstyledButton, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { spotlight } from "@mantine/spotlight";
import { IconSearch, IconMenu2 } from "@tabler/icons-react";
import { clsx } from "clsx";
import { LayoutGridIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MegaMenu } from "../../MegaMenu";
import TenantDropdown from "./TenantDropdown";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";

const CommonHeader = () => {
  const params = useParams<{ tenant: string }>();
  const [mobileMenuOpened, mobileMenuHandler] = useDisclosure(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <HamburgerButton onClick={mobileMenuHandler.toggle} />
          <Link
            className="flex items-center gap-2 no-underline transition-opacity hover:opacity-80"
            to={params?.tenant ? `/${params.tenant}/` : "/"}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-sm">
              GP
            </div>
            <span className="hidden sm:inline-block text-lg font-semibold tracking-tight">
              Graph POS
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Tooltip label="Search (⌘K)" position="bottom">
            <UnstyledButton
              onClick={() => spotlight.open()}
              className={clsx(
                "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg",
                "border border-gray-300 dark:border-gray-600",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                "transition-colors duration-200",
                "min-w-[200px] justify-between"
              )}
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <IconSearch size={16} />
                <span className="text-sm">Search...</span>
              </div>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                ⌘K
              </kbd>
            </UnstyledButton>
          </Tooltip>

          {/* Mobile Search Icon */}
          <Tooltip label="Search" position="bottom">
            <UnstyledButton
              onClick={() => spotlight.open()}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <IconSearch size={20} />
            </UnstyledButton>
          </Tooltip>

          {/* Apps Menu */}
          <MegaMenuWrapper />

          {/* Theme Switcher */}
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>

          {/* Tenant Dropdown */}
          <TenantDropdown />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu opened={mobileMenuOpened} onClose={mobileMenuHandler.close} />
    </header>
  );
};

interface HamburgerButtonProps {
  onClick?: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick }) => {
  return (
    <Tooltip label="Menu" position="bottom">
      <UnstyledButton
        onClick={onClick}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        <IconMenu2 size={20} className="text-gray-700 dark:text-gray-300" />
      </UnstyledButton>
    </Tooltip>
  );
};

const MegaMenuWrapper = () => {
  const [opened, handler] = useDisclosure(false);
  return (
    <>
      <Tooltip label="Apps" position="bottom">
        <UnstyledButton
          onClick={handler.toggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open apps menu"
        >
          <LayoutGridIcon className="size-5 text-gray-700 dark:text-gray-300" />
        </UnstyledButton>
      </Tooltip>
      <Modal
        opened={opened}
        size="80%"
        onClose={handler.close}
        title={
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-sm">
              GP
            </div>
            <span className="text-lg font-semibold">Graph POS</span>
          </div>
        }
        centered
      >
        <MegaMenu />
      </Modal>
    </>
  );
};

interface MobileMenuProps {
  opened: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ opened }) => {
  if (!opened) return null;

  return (
    <div className="border-t lg:hidden">
      <div className="p-4 space-y-4">
        <div className="sm:hidden">
          <ThemeSwitcher />
        </div>
        {/* Add more mobile menu items here */}
      </div>
    </div>
  );
};

export default CommonHeader;
