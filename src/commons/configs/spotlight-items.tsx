import { SpotlightActionData } from '@mantine/spotlight';
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
} from '@tabler/icons-react';

export const getSpotlightItems = (tenant: string): SpotlightActionData[] => {
  return [
    {
      id: 'home',
      title: 'Home',
      description: 'Get to home page',
      onClick: () => {
        window.location.href = `/${tenant}`;
      },
      leftSection: <IconHome size="1.2rem" />,
    },

    // ------ Accounting Module ------
    {
      id: 'accounting',
      title: 'Accounting',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/accounting`;
      },
      leftSection: <IconDashboard size="1.2rem" />,
    },
    {
      id: 'accounts',
      title: 'Accounting > Cashbook > Accounts',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/accounting/cashbook/accounts`;
      },
      leftSection: <IconTableShare size="1.2rem" />,
    },
    {
      id: 'adjustments',
      title: 'Accounting > Cashbook > Adjustments',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/accounting/cashbook/adjustments`;
      },
      leftSection: <IconTableShare size="1.2rem" />,
    },
    {
      id: 'transfers',
      title: 'Accounting > Cashbook > transfer',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/accounting/cashbook/transfers`;
      },
      leftSection: <IconTableShare size="1.2rem" />,
    },
    {
      id: 'statements',
      title: 'Accounting > Cashbook > Statements',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/accounting/cashbook/statements`;
      },
      leftSection: <IconTableShare size="1.2rem" />,
    },
    {
      id: 'payroll',
      title: 'Accounting > Cashbook > Payroll',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/accounting/cashbook/payroll`;
      },
      leftSection: <IconWallet size="1.2rem" />,
    },
    {
      id: 'ledger',
      title: 'Accounting > Cashbook > ledger',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = '/accounting/cashbook/ledger';
      },
      leftSection: <IconTableShare size="1.2rem" />,
    },
    {
      id: 'expense',
      title: 'Accounting > Expense > Expense-List',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/accounting/expense/expense-list`;
      },
      leftSection: <IconExchange size="1.2rem" />,
    },
    {
      id: 'expense-category',
      title: 'Accounting > Expense > Expense-Category',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/accounting/expense/expense-category`;
      },
      leftSection: <IconExchange size="1.2rem" />,
    },
    // {
    //   title: "Accounting > Load-Management > Authorities",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/accounting/load-Management/authorities";
    //   },
    //   icon: <IconLoadBalancer size="1.2rem" />,
    // },
    // {
    //   title: "Accounting > Load-Management > Loans",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/accounting/load-Management/loans";
    //   },
    //   icon: <IconLoadBalancer size="1.2rem" />,
    // },
    // {
    //   title: "Accounting > Load-Management > Payments",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/accounting/load-Management/payments";
    //   },
    //   icon: <IconLoadBalancer size="1.2rem" />,
    // },
    // {
    //   title: "Accounting > Asset-Management > Types",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/accounting/asset-Management/types";
    //   },
    //   icon: <IconVectorTriangle size="1.2rem" />,
    // },
    // {
    //   title: "Accounting > Asset-Management > Assets",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/accounting/asset-Management/assets";
    //   },
    //   icon: <IconVectorTriangle size="1.2rem" />,
    // },

    //==================================Inventory-management=========================
    {
      id: 'inventory-management',
      title: 'Inventory-Management',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management`;
      },
      leftSection: <IconForklift size="1.2rem" />,
    },

    //Products
    {
      id: 'pos',
      title: 'Inventory-Management > pos',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/products/pos`;
      },
      leftSection: <IconCash size="1.2rem" />,
    },
    {
      id: 'products-list',
      title: 'Inventory-Management > Products > Products-List',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/products/products-list`;
      },
      leftSection: <IconBrandProducthunt size="1.2rem" />,
    },
    {
      id: 'products-category',
      title: 'Inventory-Management > Products > Products-Category',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/products/products-category`;
      },
      leftSection: <IconBrandProducthunt size="1.2rem" />,
    },
    {
      id: 'barcode',
      title: 'Inventory-Management > Products > Barcode',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/products/barcode`;
      },
      leftSection: <IconBrandProducthunt size="1.2rem" />,
    },

    {
      id: 'purchases',
      title: 'Inventory-Management > Purchases',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/purchases`;
      },
      leftSection: <IconShoppingCart size="1.2rem" />,
    },
    {
      id: 'return',
      title: 'Inventory-Management > Purchases > Return',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/purchases/return`;
      },
      leftSection: <IconShoppingCart size="1.2rem" />,
    },

    {
      id: 'purchase-payments',
      title: 'Inventory-Management > Payments > Purchase-payments',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/payments/purchase-payments`;
      },
      leftSection: <IconShoppingCart size="1.2rem" />,
    },
    // ===========================settings==========================================
    {
      id: 'vat-profiles',
      title: 'Inventory-Management > Settings > Vat-profiles ',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/settings/vat-profiles`;
      },
      leftSection: <IconSettingsCheck size="1.2rem" />,
    },
    {
      id: 'units',
      title: 'Inventory-Management > Settings > Units ',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/settings/units`;
      },
      leftSection: <IconSettingsCheck size="1.2rem" />,
    },
    {
      id: 'brands',
      title: 'Inventory-Management > Settings  > Brands ',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/inventory-management/settings/brands`;
      },
      leftSection: <IconSettingsCheck size="1.2rem" />,
    },

    //====================================PEOPLE============================================
    // {
    //   title: "People",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/people";
    //   },
    //   icon: <IconFriends size="1.2rem" />,
    // },

    {
      id: 'people__client',
      title: 'People > Client',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/people/client`;
      },
      leftSection: <IconFriends size="1.2rem" />,
    },
    {
      id: 'people__suppliers',
      title: 'People > Suppliers',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/people/suppliers`;
      },
      leftSection: <Icon3dRotate size="1.2rem" />,
    },
    {
      id: 'people__employees__departments',
      title: 'People > Employees > Departments',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/people/employees/departments`;
      },
      leftSection: <IconUsersGroup size="1.2rem" />,
    },
    {
      id: 'people__employees__employees',
      title: 'People > Employees > Employees',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/people/employees/employees`;
      },
      leftSection: <IconUsersGroup size="1.2rem" />,
    },
    {
      id: 'people__employees__increments',
      title: 'People > Employees > Increments',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/people/employees/increments`;
      },
      leftSection: <IconUsersGroup size="1.2rem" />,
    },
    //Report
    {
      id: 'reports',
      title: 'Reports',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/reports`;
      },
      leftSection: <IconReport size="1.2rem" />,
    },
    {
      id: 'reports__balance-shit',
      title: 'Report > Reports > Balance-shit',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/reports/balance-shit`;
      },
      leftSection: <IconReport size="1.2rem" />,
    },
    {
      id: 'reports__summary-report',
      title: 'Report > Reports > Summary-Report',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/reports/summary-report`;
      },
      leftSection: <IconReport size="1.2rem" />,
    },
    {
      id: 'reports__expense-report',
      title: 'Report > Reports > Expense-Report',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/reports/expense-report`;
      },
      leftSection: <IconReport size="1.2rem" />,
    },
    {
      id: 'reports__loss-profit-report',
      title: 'Report > Reports > Loss-Profit-Report',
      description: 'Get full information about current system status',
      onClick: () => {
        window.location.href = `/${tenant}/reports/loss-profit-report`;
      },
      leftSection: <IconReport size="1.2rem" />,
    },

    //SETTINGS
    // {
    //   title: "Settings",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/settings";
    //   },
    //   icon: <IconSettingsCheck size="1.2rem" />,
    // },
    // {
    //   title: "Settings > Vat-Profile",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/settings";
    //   },
    //   icon: <IconSettingsCheck size="1.2rem" />,
    // },
    // {
    //   title: "Settings > Units",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/settings/units";
    //   },
    //   icon: <IconSettingsCheck size="1.2rem" />,
    // },
    // {
    //   title: "Settings > Brands",
    //   description: "Get full information about current system status",
    //   onClick: () => {
    //     window.location.href = "/settings/brands";
    //   },
    //   icon: <IconSettingsCheck size="1.2rem" />,
    // },
  ];
};
