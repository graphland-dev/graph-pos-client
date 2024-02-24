import { AppNavLink } from "@/_app/models/AppNavLink.type";
import {
  IconExchange,
  IconTableShare
} from "@tabler/icons-react";

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
        label: "Adjustments",
        href: "adjustments",
      },
      // {
      //   label: "Invoice generator",
      //   href: "invoice-generator",
      // },
      {
        label: "Transfers",
        href: "transfers",
      },
      {
        label: "Statements",
        href: "statements",
      },
      {
        label: "Payroll",
        href: "payroll",
      },
    ],
  },
  {
    label: "Expense",
    icon: <IconExchange />,
    href: "expense",
    children: [
      {
        label: "Expense List",
        href: "expense-list",
      },
      {
        label: "Expense Category",
        href: "expense-category",
      },
    ],
  },
  // {
  //   label: "Load Management",
  //   icon: <IconLoadBalancer />,
  //   href: "load-Management",
  //   children: [
  //     {
  //       label: "Authorities",
  //       href: "authorities",
  //     },
  //     {
  //       label: "Loans",
  //       href: "loans",
  //     },
  //     {
  //       label: "Payments",
  //       href: "payments",
  //     },
  //   ],
  // },
  // {
  //   label: "Asset Management",
  //   icon: <IconVectorTriangle />,
  //   href: "asset-Management",
  //   children: [
  //     {
  //       label: "Types",
  //       href: "types",
  //     },
  //     {
  //       label: "Assets",
  //       href: "assets",
  //     },
  //   ],
  // },
];
