import { AppNavLink } from "@/commons/models/AppNavLink.type";
import {
  IconChartBar,
  IconExplicit,
  IconPackages,
  IconReport,
  IconReportMoney,
} from "@tabler/icons-react";

export const reportNavlinks: AppNavLink[] = [
  {
    label: "Report",
    icon: IconReport,
    href: "reports",
  },
  {
    label: "Expense Report",
    href: "expense-report",
    icon: IconExplicit,
  },
  {
    label: "Sales Analytics",
    href: "sales-analytics",
    icon: IconChartBar,
  },
  {
    label: "Current Stock",
    href: "current-stock",
    icon: IconPackages,
  },
  {
    label: "Financial Reports",
    href: "financial-reports",
    icon: IconReportMoney,
  },
];
