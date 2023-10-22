import { AppNavLink } from "@/_app/models/AppNavLink.type";
import { IconReport } from "@tabler/icons-react";

export const reportNavlinks: AppNavLink[] = [
  {
    label: "Report",
    icon: <IconReport />,
    href: "reports",
    children: [
      {
        label: "Balance Shit",
        href: "balance-shit",
      },
      {
        label: "Summary Report",
        href: "summary-report",
      },
      {
        label: "Expense Report",
        href: "expense-report",
      },
      {
        label: "Loss Profit Report",
        href: "loss-profit-report",
      },
    ],
  },
];
