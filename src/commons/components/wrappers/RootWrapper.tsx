import { gql, useQuery } from '@apollo/client';
import { useAtom } from 'jotai/index';
import {
  loadingUserAtom,
  userAtom,
  userTenantsAtom,
} from '@/commons/states/user.atom.ts';
import {
  TenantsWithPagination,
  User,
} from '@/commons/graphql-models/graphql.ts';
import React, { PropsWithChildren, useEffect } from 'react';
import { $triggerRefetchMe } from '@/commons/rxjs-controllers.ts';
import { LoadingOverlay } from '@mantine/core';

const ROOT_QUERY = gql`
  query ROOT_QUERY {
    identity__me {
      _id
      email
      name
      memberships {
        tenant
        roles
      }
      avatar {
        meta
        path
        provider
      }
    }
    #    identity__myPermissions(tenant: $tenant) {
    #      collectionName
    #      actions
    #    }

    identity__myTenants {
      nodes {
        _id
        name
        uid
        address
        businessPhoneNumber
        description
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

const RootWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  // const params = useParams<{ tenant: string }>();
  const [, setGlobalUser] = useAtom(userAtom);
  // const [, setUserPermissions] = useAtom(userPermissionsAtom);
  const [, setUserTenants] = useAtom(userTenantsAtom);
  const [, setUserLoading] = useAtom(loadingUserAtom);

  const { loading, refetch } = useQuery<{
    identity__me: User;
    // identity__myPermissions: RolePermission[];
    identity__myTenants: TenantsWithPagination;
  }>(ROOT_QUERY, {
    // skip: !params?.tenant,
    // variables: {
    //   tenant: params?.tenant,
    // },
    onCompleted(data) {
      setGlobalUser(data?.identity__me);
      setUserTenants(data?.identity__myTenants?.nodes || []);
      setUserLoading(false);
      // setUserPermissions(data?.identity__myPermissions);
    },
    onError: () => {
      setUserLoading(false);
      // localStorage.removeItem('erp:accessToken');
      // window.location.href = '/auth/login';
    },
  });

  useEffect(() => {
    $triggerRefetchMe.subscribe(() => {
      refetch();
    });
  }, []);

  return (
    <div area-label="root-app-wrapper" className="relative">
      <LoadingOverlay visible={loading} opacity={10000} overlayBlur={1000} />
      {children}
    </div>
  );
};

export default RootWrapper;
