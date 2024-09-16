import React, { PropsWithChildren } from 'react';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { loadingUserAtom, userAtom } from '@/commons/states/user.atom.ts';

interface RouteGuardWrapperProps {
  guard: 'public' | 'private';
}

export const RouteGuardWrapper: React.FC<
  PropsWithChildren<RouteGuardWrapperProps>
> = ({ children, guard }) => {
  const navigate = useNavigate();
  const authUser = useAtomValue(userAtom);
  const authUserLoading = useAtomValue(loadingUserAtom);

  switch (guard) {
    case 'public':
      if (!authUserLoading && authUser) {
        navigate('/');
      }
      break;
    case 'private':
      if (!authUserLoading && !authUser) {
        navigate('/auth/login');
      }
      break;
  }

  return <>{children}</>;
};
