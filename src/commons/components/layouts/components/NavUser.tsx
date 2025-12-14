'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/commons/shadcn/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/commons/shadcn/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/commons/shadcn/components/ui/sidebar';
import { userAtom } from '@/commons/states/user.atom';
import { getFileUrl } from '@/commons/utils/getFileUrl';
import { TokenService } from '@/commons/utils/TokenService';
import { openConfirmModal } from '@mantine/modals';
import { useAtom } from 'jotai';
import { ChevronsUpDown, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NavUser() {
  const { isMobile } = useSidebar();
  const [currentUser] = useAtom(userAtom);

  function handleLogout(): void {
    openConfirmModal({
      title: 'Sure to Logout?',
      labels: {
        cancel: 'Cancel',
        confirm: 'Logout',
      },
      onConfirm: () => {
        TokenService.removeToken();
        window.location.href = '/auth/login';
      },
    });
  }

  if (!currentUser) {
    return null;
  }

  const avatarUrl = currentUser.avatar?.path
    ? getFileUrl(currentUser.avatar)
    : `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name || 'User'}`;

  const initials =
    currentUser.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt={currentUser.name || 'User'} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {currentUser.name || 'User'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentUser.email || ''}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={avatarUrl}
                    alt={currentUser.name || 'User'}
                  />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentUser.name || 'User'}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {currentUser.email || ''}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/auth/my-profile" className="flex items-center gap-2">
                  <User className="size-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
