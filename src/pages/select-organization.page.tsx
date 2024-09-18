import { getFileUrl } from '@/commons/utils/getFileUrl';
import { TenantsWithPagination } from '@/commons/graphql-models/graphql';
import { gql, useQuery } from '@apollo/client';
import { Image, LoadingOverlay, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
      <div className="grid md:grid-cols-3 gap-4  mt-8 content-center ">
        {data?.identity__myTenants.nodes?.map((tenant, idx) => (
          <Link
            key={idx}
            to={`/${tenant.uid}`}
            className=" border-2 rounded text-neutral-primary border-neutral-primary p-5 py-10 flex flex-col justify-center items-center gap-2"
          >
            <Image
              fit="cover"
              width={80}
              height={80}
              className="rounded overflow-hidden"
              src={getFileUrl(tenant.logo ?? {})}
            />
            <Text className=" text-3xl ">{tenant.name}</Text>
          </Link>
        ))}
        <div className=" border-2 rounded text-neutral-primary border-neutral-primary p-5 py-10 flex flex-col justify-center items-center gap-2">
          <IconPlus size={30} />
        </div>
      </div>
    </div>
  );
};

export default SelectOrganization;
