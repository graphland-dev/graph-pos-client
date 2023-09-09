import { SpotlightAction } from "@mantine/spotlight";
import { IconBrandProducthunt, IconDashboard, IconExchange, IconForklift, IconHome, IconLoadBalancer, IconShoppingCart, IconTableShare, IconVectorTriangle, IconWallet } from "@tabler/icons-react";

export const spotlightItems: SpotlightAction[] = [
  {
    title: "Home",
    description: "Get to home page",
    onTrigger: () => {
      window.location.href = "/";
    },
    icon: <IconHome size="1.2rem" />,
  },
  {
    title: "Accounting",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting";
    },
    icon: <IconDashboard size="1.2rem" />,
  },
  {
    title: "Accounting > Cashbook > Accounts",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/cashbook/accounts";
    },
    icon: <IconTableShare size="1.2rem" />,
  },
  {
    title: "Accounting > Cashbook > Adjustments",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/cashbook/adjustments";
    },
    icon: <IconTableShare size="1.2rem" />,
  },
  {
    title: "Accounting > Cashbook > transfer",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/cashbook/transfer";
    },
    icon: <IconTableShare size="1.2rem" />,
  },
  {
    title: "Accounting > Cashbook > ledger",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/cashbook/ledger";
    },
    icon: <IconTableShare size="1.2rem" />,
  },
  {
    title: "Accounting > Expense > Expense-List",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/expense/expense-list";
    },
    icon: <IconExchange size="1.2rem" />,
  },
  {
    title: "Accounting > Expense > Expense-Category",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/expense/expense-category";
    },
    icon: <IconExchange size="1.2rem" />,
  },
  {
    title: "Accounting > Load-Management > Authorities",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/load-Management/authorities";
    },
    icon: <IconLoadBalancer size="1.2rem" />,
  },
  {
    title: "Accounting > Load-Management > Loans",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/load-Management/loans";
    },
    icon: <IconLoadBalancer size="1.2rem" />,
  },
  {
    title: "Accounting > Load-Management > Payments",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/load-Management/payments";
    },
    icon: <IconLoadBalancer size="1.2rem" />,
  },
  {
    title: "Accounting > Asset-Management > Types",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/asset-Management/types";
    },
    icon: <IconVectorTriangle size="1.2rem" />,
  },
  {
    title: "Accounting > Asset-Management > Assets",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/asset-Management/assets";
    },
    icon: <IconVectorTriangle size="1.2rem" />,
  },
  {
    title: "Accounting > Payroll",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/payroll";
    },
    icon: <IconWallet size="1.2rem" />,
  },

  //Inventory-management
  {
    title: "Inventory-Management",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/inventory-management";
    },
    icon: <IconForklift size="1.2rem" />,
  },

  //Products
  {
    title: "Inventory-Management > Products > Products-List",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/inventory-management/products/products-list";
    },
    icon: <IconBrandProducthunt size="1.2rem" />,
  },
  {
    title: "Inventory-Management > Products > Products-Category",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/inventory-management/products/products-category";
    },
    icon: <IconBrandProducthunt size="1.2rem" />,
  },
  {
    title: "Inventory-Management > Products > Barcode",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/inventory-management/products/barcode";
    },
    icon: <IconBrandProducthunt size="1.2rem" />,
  },

  //purchases
  {
    title: "Inventory-Management > Purchases > Purchases-List",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "inventory-management/purchases/purchases-list";
    },
    icon: <IconShoppingCart size="1.2rem" />,
  },
  {
    title: "Inventory-Management > Purchases > Return",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/inventory-management/purchases/return";
    },
    icon: <IconShoppingCart size="1.2rem" />,
  },

  //Inventory
  {
    title: "Inventory-Management > Inventory > Inventory-list",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/inventory-management/inventory/inventory-list";
    },
    icon: <IconShoppingCart size="1.2rem" />,
  },
  {
    title: "Inventory-Management > Inventory > Adjustment",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/inventory-management/inventory/adjustment";
    },
    icon: <IconShoppingCart size="1.2rem" />,
  },
];
