import { getFileUrl } from '@/commons/utils/getFileUrl';
import { TenantsWithPagination } from '@/commons/graphql-models/graphql';
import { gql, useQuery } from '@apollo/client';
import { Image, LoadingOverlay, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect } from 'react';

const MY_TENANTS = gql`
  query Identity__myTenants {
    identity__myTenants {
      nodes {
        _id
        name
        uid
        createdAt
        logo {
          meta
          path
          provider
        }
      }
    }
  }
`;

const SelectOrganization = () => {
  const [currentTenantFromStorage] = useLocalStorage({
    key: 'graphland.dev.pos.current-tenant',
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    if (currentTenantFromStorage) {
      window.location.href = `/${currentTenantFromStorage}`;
    }
  }, [currentTenantFromStorage]);

  const { data } = useQuery<{ identity__myTenants: TenantsWithPagination }>(
    MY_TENANTS,
    {
      onError() {
        // window.location.href = '/auth/login';
      },
    },
  );

  return (
    <div className="relative p-14">
      <LoadingOverlay visible={!data} overlayBlur={1000} />
      <Title order={2}>Select Organization</Title>
      <div className="grid content-center gap-4 mt-8 md:grid-cols-3">
        {data?.identity__myTenants.nodes?.map((tenant, idx) => (
          <Link
            key={idx}
            to={`/${tenant.uid}`}
            className="flex flex-col items-center justify-center gap-2 p-5 py-10 bg-white rounded"
          >
            <Image
              fit="cover"
              width={80}
              height={80}
              className="overflow-hidden rounded"
              src={getFileUrl(tenant.logo ?? {})}
            />
            <Text className="text-3xl ">{tenant.name}</Text>
          </Link>
        ))}
        <div className="flex flex-col items-center justify-center gap-2 p-5 py-10 border-2 rounded text-neutral-primary border-neutral-primary">
          <IconPlus size={30} />
        </div>
      </div>
    </div>
  );
};

export default SelectOrganization;
