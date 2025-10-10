import { Modal, Tooltip, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2 } from "@tabler/icons-react";
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
    <header className="sticky top-0 z-50 w-full bg-card border-primary border-b">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <HamburgerButton onClick={mobileMenuHandler.toggle} />
          <Link
            className="flex items-center gap-2 no-underline transition-opacity hover:opacity-80"
            to={params?.tenant ? `/${params.tenant}/` : "/"}
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
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
          className="p-2 rounded-lg transition-colors"
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
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
