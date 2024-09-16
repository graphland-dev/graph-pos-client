import { atom } from 'jotai';
import { RolePermission, Tenant, User } from '../graphql-models/graphql';

// export const userAtom = atomWithStorage<User | null>('current-user', null);
export const userAtom = atom<User | null>(null);

export const loadingUserAtom = atom<boolean>(true);
export const userPermissionsAtom = atom<RolePermission[] | null>(null);
export const userTenantsAtom = atom<Tenant[] | null>(null);

// interface ICanParams {
//   collectionName: string;
//   actions: string[];
// }

// export const can = (param: ICanParams) => {};
