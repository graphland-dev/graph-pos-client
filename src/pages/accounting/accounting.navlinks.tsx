import { AppNavLink } from "@/_app/models/AppNavLink.type";
import { IconTableShare } from "@tabler/icons-react";

export const accountingNavlinks: AppNavLink[] = [
  {
    label: "Cashbook",
    icon: <IconTableShare />,
    href: "cashbook",
    children: [
      {
        label: "Accounts",
        href: "accounts",
      },
      {
        label: "Adjustment",
        href: "adjustment",
      },
    ],
  },
];
