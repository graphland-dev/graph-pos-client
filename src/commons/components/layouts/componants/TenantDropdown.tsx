import { userTenantsAtom } from '@/commons/states/user.atom';
import { Flex, Image, Menu, UnstyledButton } from '@mantine/core';
import { IconSettings, IconSwitchVertical } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { Link, useParams } from 'react-router-dom';
import { getFileUrl } from '../../../utils/getFileUrl';

const TenantDropdown = () => {
  const params = useParams<{ tenant: string }>();
  const [tenants] = useAtom(userTenantsAtom);

  const getTenantByUId = (tenantId: string) => {
    const tenant = tenants?.find((tenant) => tenant.uid === tenantId);
    return tenant;
  };

  function handleSwitchTenant(uid: string): void {
    window.location.href = `/${uid}`;
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-md tenant-dropdown">
      <Flex gap={'xs'} align={'center'}>
        {getTenantByUId(params.tenant!)?.logo?.path ? (
          <Image
            radius={'lg'}
            width={25}
            height={25}
            src={getFileUrl(getTenantByUId(params.tenant!)?.logo ?? {})}
          />
        ) : (
          <Image
            src="https://freelogopng.com/images/all_img/1657952440google-logo-png-transparent.png"
            width={25}
            height={25}
            radius={'lg'}
          />
        )}

        <p className="tenant-dropdown__name">
          {getTenantByUId(params.tenant!)?.name || 'Select tenant'}
        </p>
      </Flex>

      <Menu shadow="md" width={200}>
        <Menu.Target>
          <UnstyledButton>
            <IconSwitchVertical
              size={22}
              className="text-neutral-primary tenant-dropdown__switch-icon"
            />
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Choose Organization</Menu.Label>
          {tenants?.map((tenant, key) => (
            <Menu.Item
              component="button"
              onClick={() => handleSwitchTenant(tenant.uid!)}
              key={key}
            >
              {tenant.name}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Link to={`/${params.tenant}/tenant-settings`}>
        <IconSettings size={22} className="tenant-dropdown__setting-icon" />
      </Link>
    </div>
  );
};

export default TenantDropdown;
