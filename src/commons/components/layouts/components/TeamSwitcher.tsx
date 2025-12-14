import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/commons/shadcn/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { userTenantsAtom } from '@/commons/states/user.atom';
import { getFileUrl } from '@/commons/utils/getFileUrl';
import { useLocalStorage } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useAtomValue } from 'jotai';
import { ChevronsUpDown, Plus, Settings } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const params = useParams<{ tenant: string }>();
  const myTenants = useAtomValue(userTenantsAtom);
  const navigate = useNavigate();

  const [, setCurrentTenant] = useLocalStorage({
    key: 'graphland.dev.pos.current-tenant',
    getInitialValueInEffect: true,
  });

  const currentTenant = myTenants?.find(
    (tenant) => tenant.uid === params.tenant,
  );

  const handleSwitchTenant = (uid: string) => {
    setCurrentTenant(uid);
    navigate(`/${uid}`);
  };

  const handleSwitchTenantSetting = (uid: string) => {
    navigate(`/${uid}/tenant-settings`);
  };

  if (!currentTenant) {
    return null;
  }

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
                <AvatarImage
                  src={
                    currentTenant.logo
                      ? getFileUrl(currentTenant.logo)
                      : undefined
                  }
                  alt={currentTenant.name || 'Organization'}
                />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {currentTenant.name?.substring(0, 2).toUpperCase() || 'ORG'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {currentTenant.name || 'Organization'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentTenant.uid}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {myTenants?.map((tenant) => (
              <DropdownMenuItem
                key={tenant.uid}
                onClick={() => handleSwitchTenant(tenant.uid!)}
                className={tenant.uid === params.tenant ? 'bg-accent' : ''}
              >
                <Avatar className="h-6 w-6 rounded-sm mr-2">
                  <AvatarImage
                    src={tenant.logo ? getFileUrl(tenant.logo) : undefined}
                    alt={tenant.name || 'Organization'}
                  />
                  <AvatarFallback className="rounded-sm text-xs">
                    {tenant.name?.substring(0, 2).toUpperCase() || 'ORG'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {tenant.uid}
                  </div>
                </div>
                {tenant.uid === params.tenant && (
                  <span className="text-xs text-primary">✓</span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleSwitchTenantSetting(params.tenant!)}
              className="gap-2"
            >
              <Settings className="size-4" />
              <span>Organization Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                modals.openConfirmModal({
                  title: 'Want to create a new organization?',
                  children: (
                    <>
                      <p>
                        To create new organization, you need to contact our
                        support.
                      </p>
                      <p>
                        Phone: +880 1836980760 <br />
                      </p>
                    </>
                  ),
                  labels: { confirm: 'OK', cancel: 'Cancel' },
                  onCancel: () => console.log('Cancel'),
                  onConfirm: () => console.log('Confirmed'),
                })
              }
              className="gap-2"
            >
              <Plus className="size-4" />
              <span>Create New Organization</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
