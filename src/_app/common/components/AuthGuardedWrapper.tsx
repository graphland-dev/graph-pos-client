import {
  RolePermission,
  TenantsWithPagination,
  User,
} from "@/_app/graphql-models/graphql";
import { $triggerRefetchMe } from "@/_app/rxjs-controllers";
import {
  userAtom,
  userPermissionsAtom,
  userTenantsAtom,
} from "@/_app/states/user.atom";
import { gql, useQuery } from "@apollo/client";
import { LoadingOverlay } from "@mantine/core";
import { useAtom } from "jotai";
import React, { PropsWithChildren, useEffect } from "react";
import { useParams } from "react-router-dom";

const GET_USER_QUERIES = gql`
  query GET_USER_QUERIES($tenant: String!) {
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
    identity__myPermissions(tenant: $tenant) {
      collectionName
      actions
    }

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

export const AuthGuardedWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const params = useParams<{ tenant: string }>();
  const [, setGlobalUser] = useAtom(userAtom);
  const [, setUserPermissions] = useAtom(userPermissionsAtom);
  const [, setUserTenants] = useAtom(userTenantsAtom);

  const { loading, refetch } = useQuery<{
    identity__me: User;
    identity__myPermissions: RolePermission[];
    identity__myTenants: TenantsWithPagination;
  }>(GET_USER_QUERIES, {
    skip: !params?.tenant,
    variables: {
      tenant: params?.tenant,
    },
    onCompleted(data) {
      setGlobalUser(data?.identity__me);
      setUserPermissions(data?.identity__myPermissions);
      setUserTenants(data?.identity__myTenants?.nodes || []);
    },
    onError: (error) => {
      console.log(error);
      window.location.href = "/auth/login";
    },
  });

  useEffect(() => {
    $triggerRefetchMe.subscribe(() => {
      refetch();
    });
  }, []);

  return (
    <div className="relative">
      <LoadingOverlay visible={loading} opacity={10000} overlayBlur={1000} />
      {children}
    </div>
  );
};
