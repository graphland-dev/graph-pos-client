import { userTenantsAtom } from '@/commons/states/user.atom';
import {
  ActionIcon,
  Avatar,
  Button,
  Code,
  Drawer,
  Image,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { IconSettings, IconSwitchVertical } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { Link, useParams } from 'react-router-dom';
import { ArrowDownUp, CircleCheck, Cog } from 'lucide-react';
import { getFileUrl } from '../../../utils/getFileUrl';
import clsx from 'clsx';
import { modals } from '@mantine/modals';

const TenantDropdown = () => {
  const params = useParams<{ tenant: string }>();
  const myTenants = useAtomValue(userTenantsAtom);
  const [modalOpened, modelHandler] = useDisclosure(false);

  const [, setCurrentTenant] = useLocalStorage({
    key: 'graphland.dev.pos.current-tenant',
    getInitialValueInEffect: true,
  });

  const getTenantByUId = (tenantId: string) => {
    const tenant = myTenants?.find((tenant) => tenant.uid === tenantId);
    return tenant;
  };

  function handleSwitchTenant(uid: string): void {
    setCurrentTenant(uid);
    window.location.href = `/${uid}`;
  }

  function handleSwitchTenantSetting(uid: string): void {
    window.location.href = `/${uid}/tenant-settings`;
  }

  return (
    <>
      <div className="flex items-center gap-2 px-2 py-1 rounded-md tenant-dropdown">
        <UnstyledButton
          onClick={() => modelHandler.open()}
          className="flex items-center gap-2 px-4 py-1 rounded-md bg-primary-600"
        >
          <p className="text-primary-foreground">
            {getTenantByUId(params.tenant!)?.name || 'Select tenant'}
          </p>

          <IconSwitchVertical size={22} className="text-primary-foreground" />
        </UnstyledButton>

        <Link to={`/${params.tenant}/tenant-settings`}>
          <IconSettings size={22} className="tenant-dropdown__setting-icon" />
        </Link>
      </div>
      <Drawer
        opened={modalOpened}
        onClose={modelHandler.close}
        title="Select Organization"
      >
        <div className="flex flex-col gap-3">
          {myTenants?.map((tenant, key) => (
            <div
              key={key}
              className={clsx('flex items-center gap-2 py-1', {
                'bg-muted': tenant.uid === params.tenant,
              })}
            >
              <Avatar size={55} variant="gradient" className="cursor-pointer">
                <Image src={getFileUrl(tenant.logo!)} />
              </Avatar>
              <div className="flex items-center justify-between flex-1">
                <div>
                  <p className="font-semibold">{tenant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    org-uuid: <Code>{tenant.uid}</Code>
                  </p>
                </div>

                {tenant.uid === params.tenant ? (
                  <div className="flex items-center gap-2">
                    <CircleCheck size={20} className="text-primary" />
                    <ActionIcon
                      onClick={() => handleSwitchTenantSetting(tenant.uid!)}
                    >
                      <Cog />
                    </ActionIcon>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Tooltip label="Enter this organization">
                      <ActionIcon
                        onClick={() => handleSwitchTenant(tenant.uid!)}
                      >
                        <ArrowDownUp />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Organization Settings">
                      <ActionIcon
                        onClick={() => handleSwitchTenantSetting(tenant.uid!)}
                      >
                        <Cog />
                      </ActionIcon>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          mt={'lg'}
          onClick={() =>
            modals.openConfirmModal({
              title: 'Want to create a new organization?',
              children: (
                <>
                  <p>
                    To create new origanization, you need to contact our
                    support.
                  </p>

                  <p>
                    Phone: +880 1836980760 <br />
                  </p>
                </>
              ),
              labels: { confirm: 'Damnn OK', cancel: 'OK' },
              onCancel: () => console.log('Cancel'),
              onConfirm: () => console.log('Confirmed'),
            })
          }
        >
          Create New Organization
        </Button>
      </Drawer>
    </>
  );
};

export default TenantDropdown;
