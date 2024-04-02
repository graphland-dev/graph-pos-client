import { AppNavLink } from "@/_app/models/AppNavLink.type";
import { Icon3dRotate, IconFriends, IconUsersGroup } from "@tabler/icons-react";

export const peopleNavlinks: AppNavLink[] = [
  {
    label: "Client",
    icon: IconFriends,
    href: "client",
  },
  {
    label: "Suppliers",
    icon: Icon3dRotate,
    href: "suppliers",
  },
  {
    label: "Employees",
    icon: IconUsersGroup,
    href: "employees",
    children: [
      {
        label: "Departments",
        href: "departments",
      },
      {
        label: "Employees",
        href: "employees",
      },
      {
        label: "Increments",
        href: "increments",
      },
    ],
  },
];
