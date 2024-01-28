import { atom } from "jotai";
import { RolePermission, User } from "../graphql-models/graphql";

export const userAtom = atom<User | null>(null);
export const userPermissionsAtom = atom<RolePermission[] | null>(null);

// interface ICanParams {
//   collectionName: string;
//   actions: string[];
// }

// export const can = (param: ICanParams) => {};
