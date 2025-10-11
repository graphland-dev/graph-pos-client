export const rolesWithPermissions = [
  {
    name: "Accounting",
    description:
      "Manage financial operations including accounts, expenses, payments, payroll, and transactions. Controls access to cashbook and financial records.",
    collections: [
      "accounting__Account",
      "accounting__Expense",
      "accounting__ExpenseCategory",
      "accounting__InventoryInvoicePayment",
      "accounting__Payroll",
      "accounting__PurchasePayment",
      "accounting__ReturnPayment",
      "accounting__Transaction",
      "accounting__Transfer",
    ],
  },
  {
    name: "People",
    description:
      "Manage contacts and human resources including clients, employees, suppliers, departments, and employee salary increments.",
    collections: [
      "people__Client",
      "people__Employee",
      "people__EmployeeDepartment",
      "people__EmployeeIncrement",
      "people__Supplier",
    ],
  },
  {
    name: "Inventory",
    description:
      "Control product management, stock levels, purchases, sales invoices, quotations, and product returns. Essential for POS and inventory operations.",
    collections: [
      "inventory__Product",
      "inventory__ProductCategory",
      "inventory__ProductInvoice",
      "inventory__ProductPurchase",
      "inventory__ProductQuotation",
      "inventory__ProductReturn",
      "inventory__ProductStock",
    ],
  },
  {
    name: "Setup",
    description:
      "Configure system-wide settings including brands, units of measurement, and tax (VAT) configurations.",
    collections: ["setup__Brand", "setup__Unit", "setup__Vat"],
  },
  {
    name: "Identity",
    description:
      "Manage system security and access control including tenant settings, user roles, and permissions. Admin-level access required.",
    collections: ["identity__Tenant", "identity__Role", "identity__Permission"],
  },
];
