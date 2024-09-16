import {
  Icon3dRotate,
  IconBrandProducthunt,
  IconCash,
  IconDashboard,
  IconExchange,
  IconForklift,
  IconFriends,
  IconHome,
  IconReport,
  IconSettingsCheck,
  IconShoppingCart,
  IconTableShare,
  IconUsersGroup,
  IconWallet,
} from "@tabler/icons-react";

export const getSpotlightItems = (tenant: string) => {
  return [
    {
      title: "Home",
      description: "Get to home page",
      onTrigger: () => {
        window.location.href = `/${tenant}`;
      },
      icon: <IconHome size="1.2rem" />,
    },

    // ------ Accounting Module ------
    {
      title: "Accounting",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/accounting`;
      },
      icon: <IconDashboard size="1.2rem" />,
    },
    {
      title: "Accounting > Cashbook > Accounts",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/accounting/cashbook/accounts`;
      },
      icon: <IconTableShare size="1.2rem" />,
    },
    {
      title: "Accounting > Cashbook > Adjustments",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/accounting/cashbook/adjustments`;
      },
      icon: <IconTableShare size="1.2rem" />,
    },
    {
      title: "Accounting > Cashbook > transfer",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/accounting/cashbook/transfers`;
      },
      icon: <IconTableShare size="1.2rem" />,
    },
    {
      title: "Accounting > Cashbook > Statements",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/accounting/cashbook/statements`;
      },
      icon: <IconTableShare size="1.2rem" />,
    },
    {
      title: "Accounting > Cashbook > Payroll",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/accounting/cashbook/payroll`;
      },
      icon: <IconWallet size="1.2rem" />,
    },
    // {
    //   title: "Accounting > Cashbook > ledger",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/accounting/cashbook/ledger";
    //   },
    //   icon: <IconTableShare size="1.2rem" />,
    // },
    {
      title: "Accounting > Expense > Expense-List",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/accounting/expense/expense-list`;
      },
      icon: <IconExchange size="1.2rem" />,
    },
    {
      title: "Accounting > Expense > Expense-Category",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/accounting/expense/expense-category`;
      },
      icon: <IconExchange size="1.2rem" />,
    },
    // {
    //   title: "Accounting > Load-Management > Authorities",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/accounting/load-Management/authorities";
    //   },
    //   icon: <IconLoadBalancer size="1.2rem" />,
    // },
    // {
    //   title: "Accounting > Load-Management > Loans",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/accounting/load-Management/loans";
    //   },
    //   icon: <IconLoadBalancer size="1.2rem" />,
    // },
    // {
    //   title: "Accounting > Load-Management > Payments",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/accounting/load-Management/payments";
    //   },
    //   icon: <IconLoadBalancer size="1.2rem" />,
    // },
    // {
    //   title: "Accounting > Asset-Management > Types",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/accounting/asset-Management/types";
    //   },
    //   icon: <IconVectorTriangle size="1.2rem" />,
    // },
    // {
    //   title: "Accounting > Asset-Management > Assets",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/accounting/asset-Management/assets";
    //   },
    //   icon: <IconVectorTriangle size="1.2rem" />,
    // },

    //==================================Inventory-management=========================
    {
      title: "Inventory-Management",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management`;
      },
      icon: <IconForklift size="1.2rem" />,
    },

    //Products
    {
      title: "Inventory-Management > pos",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/products/pos`;
      },
      icon: <IconCash size="1.2rem" />,
    },
    {
      title: "Inventory-Management > Products > Products-List",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/products/products-list`;
      },
      icon: <IconBrandProducthunt size="1.2rem" />,
    },
    {
      title: "Inventory-Management > Products > Products-Category",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/products/products-category`;
      },
      icon: <IconBrandProducthunt size="1.2rem" />,
    },
    {
      title: "Inventory-Management > Products > Barcode",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/products/barcode`;
      },
      icon: <IconBrandProducthunt size="1.2rem" />,
    },

    {
      title: "Inventory-Management > Purchases",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/purchases`;
      },
      icon: <IconShoppingCart size="1.2rem" />,
    },
    {
      title: "Inventory-Management > Purchases > Return",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/purchases/return`;
      },
      icon: <IconShoppingCart size="1.2rem" />,
    },

    {
      title: "Inventory-Management > Payments > Purchase-payments",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/payments/purchase-payments`;
      },
      icon: <IconShoppingCart size="1.2rem" />,
    },
    // ===========================settings==========================================
    {
      title: "Inventory-Management > Settings > Vat-profiles ",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/settings/vat-profiles`;
      },
      icon: <IconSettingsCheck size="1.2rem" />,
    },
    {
      title: "Inventory-Management > Settings > Units ",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/settings/units`;
      },
      icon: <IconSettingsCheck size="1.2rem" />,
    },
    {
      title: "Inventory-Management > Settings  > Brands ",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/inventory-management/settings/brands`;
      },
      icon: <IconSettingsCheck size="1.2rem" />,
    },

    //====================================PEOPLE============================================
    // {
    //   title: "People",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/people";
    //   },
    //   icon: <IconFriends size="1.2rem" />,
    // },

    {
      title: "People > Client",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/people/client`;
      },
      icon: <IconFriends size="1.2rem" />,
    },
    {
      title: "People > Suppliers",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href =  `/${tenant}/people/suppliers`;
      },
      icon: <Icon3dRotate size="1.2rem" />,
    },
    {
      title: "People > Employees > Departments",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href =  `/${tenant}/people/employees/departments`;
      },
      icon: <IconUsersGroup size="1.2rem" />,
    },
    {
      title: "People > Employees > Employees",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href =
          `/${tenant}/people/employees/employees`;
      },
      icon: <IconUsersGroup size="1.2rem" />,
    },
    {
      title: "People > Employees > Increments",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/people/employees/increments`;
      },
      icon: <IconUsersGroup size="1.2rem" />,
    },
    //Report
    {
      title: "Reports",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href =  `/${tenant}/reports`;
      },
      icon: <IconReport size="1.2rem" />,
    },
    {
      title: "Report > Reports > Balance-shit",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/reports/balance-shit`;
      },
      icon: <IconReport size="1.2rem" />,
    },
    {
      title: "Report > Reports > Summary-Report",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/reports/summary-report`;
      },
      icon: <IconReport size="1.2rem" />,
    },
    {
      title: "Report > Reports > Expense-Report",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href = `/${tenant}/reports/expense-report`;
      },
      icon: <IconReport size="1.2rem" />,
    },
    {
      title: "Report > Reports > Loss-Profit-Report",
      description: "Get full information about current system status",
      onTrigger: () => {
        window.location.href =`/${tenant}/reports/loss-profit-report`;
      },
      icon: <IconReport size="1.2rem" />,
    },

    //SETTINGS
    // {
    //   title: "Settings",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/settings";
    //   },
    //   icon: <IconSettingsCheck size="1.2rem" />,
    // },
    // {
    //   title: "Settings > Vat-Profile",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/settings";
    //   },
    //   icon: <IconSettingsCheck size="1.2rem" />,
    // },
    // {
    //   title: "Settings > Units",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/settings/units";
    //   },
    //   icon: <IconSettingsCheck size="1.2rem" />,
    // },
    // {
    //   title: "Settings > Brands",
    //   description: "Get full information about current system status",
    //   onTrigger: () => {
    //     window.location.href = "/settings/brands";
    //   },
    //   icon: <IconSettingsCheck size="1.2rem" />,
    // },
  ];
};
