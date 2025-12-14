import { AppNavLink } from "@/commons/models/AppNavLink.type";
import {
  IconTableShare,
  IconBrandProducthunt,
  IconShoppingCart,
  IconFriends,
  IconReport,
  IconSettings,
  IconFile3d,
  IconReceipt2,
  IconCoin,
  IconRotate2 as IconRefund,
  IconAdjustments,
} from "@tabler/icons-react";

export const modulesNavlinks: AppNavLink[] = [
  {
    label: "Accounting",
    icon: IconTableShare,
    href: "accounting",
    children: [
      {
        label: "Cashbook",
        href: "accounting/cashbook",
        children: [
          { label: "Accounts", href: "accounting/cashbook/accounts" },
          { label: "Adjustments", href: "accounting/cashbook/adjustments" },
          { label: "Transfers", href: "accounting/cashbook/transfers" },
          { label: "Statements", href: "accounting/cashbook/statements" },
          { label: "Payroll", href: "accounting/cashbook/payroll" },
        ],
      },
      {
        label: "Expense",
        href: "accounting/expense",
        children: [
          { label: "Expense List", href: "accounting/expense/expense-list" },
          { label: "Expense Category", href: "accounting/expense/expense-category" },
        ],
      },
    ],
  },
  {
    label: "Inventory Management",
    icon: IconBrandProducthunt,
    href: "inventory-management",
    children: [
      { label: "POS", href: "inventory-management/pos" },
      { label: "Invoices", href: "inventory-management/invoices" },
      { label: "Quotations", href: "inventory-management/quotations" },
      {
        label: "Products",
        href: "inventory-management/products",
        children: [
          { label: "Products List", href: "inventory-management/products/products-list" },
          { label: "Products Category", href: "inventory-management/products/products-category" },
          { label: "Barcode", href: "inventory-management/products/barcode" },
        ],
      },
      {
        label: "Purchases",
        href: "inventory-management/purchases",
        children: [
          { label: "Purchases List", href: "inventory-management/purchases" },
          { label: "Return", href: "inventory-management/purchases/return" },
        ],
      },
      {
        label: "Payments",
        href: "inventory-management/payments",
        children: [
          { label: "Purchase Payments", href: "inventory-management/payments/purchase-payments" },
          { label: "Invoice Payments", href: "inventory-management/payments/invoice-payments" },
        ],
      },
      { label: "Returns", href: "inventory-management/returns" },
      {
        label: "Settings",
        href: "inventory-management/settings",
        children: [
          { label: "Vat Profiles", href: "inventory-management/settings/vat-profiles" },
          { label: "Units", href: "inventory-management/settings/units" },
          { label: "Brands", href: "inventory-management/settings/brands" },
        ],
      },
    ],
  },
  {
    label: "People",
    icon: IconFriends,
    href: "people",
    children: [
      { label: "Clients", href: "people/client" },
      { label: "Suppliers", href: "people/suppliers" },
      {
        label: "Employees",
        href: "people/employees",
        children: [
          { label: "Departments", href: "people/employees/departments" },
          { label: "Employees", href: "people/employees/employees" },
          { label: "Increments", href: "people/employees/increments" },
        ],
      },
    ],
  },
  {
    label: "Reports",
    icon: IconReport,
    href: "reports",
    children: [
      { label: "Report", href: "reports/reports" },
      { label: "Expense Report", href: "reports/expense-report" },
      { label: "Sales Analytics", href: "reports/sales-analytics" },
      { label: "Current Stock", href: "reports/current-stock" },
      { label: "Financial Reports", href: "reports/financial-reports" },
    ],
  },
  {
    label: "Organization Settings",
    icon: IconSettings,
    href: "tenant-settings",
    children: [
      { label: "Overview", href: "tenant-settings" },
      { label: "Roles", href: "tenant-settings/roles" },
      { label: "Users", href: "tenant-settings/users" },
    ],
  },
];

