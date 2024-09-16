import { atomWithStorage } from "jotai/utils";

export const navbarIsCollapsedAtom = atomWithStorage<boolean>(
  "graph360__navbarIsCollapsedAtom",
  false
);
