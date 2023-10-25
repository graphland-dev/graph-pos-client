import { AppNavLink } from "@/_app/models/AppNavLink.type";
import { IconExplicit, IconFileInvoice, IconMoodConfuzed, IconPageBreak, IconReport } from "@tabler/icons-react";

export const reportNavlinks: AppNavLink[] = [
  {
    label: "Report",
    icon: <IconReport />,
    href: "reports",
  },
  {
    label: "Balance Shit",
    href: "balance-shit",
    icon: <IconFileInvoice />,
  },
  {
    label: "Summary Report",
    href: "summary-report",
    icon: <IconPageBreak />,
  },
  {
    label: "Expense Report",
    href: "expense-report",
    icon: <IconExplicit />,
  },
  {
    label: "Loss Profit Report",
    href: "loss-profit-report",
    icon: <IconMoodConfuzed />,
  },
];
