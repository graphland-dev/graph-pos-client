import {
  RolePermission,
  TenantsWithPagination,
  User,
} from "@/_app/graphql-models/graphql";
import {
  userAtom,
  userPermissionsAtom,
  userTenantsAtom,
} from "@/_app/states/user.atom";
import { gql, useQuery } from "@apollo/client";
import { LoadingOverlay } from "@mantine/core";
import { useAtom } from "jotai";
import React, { PropsWithChildren } from "react";
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
        createdAt
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

  const { loading } = useQuery<{
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
    },
  });

  return (
    <div className="relative">
      <LoadingOverlay visible={loading} opacity={10000} overlayBlur={1000} />
      {children}
    </div>
  );
};
