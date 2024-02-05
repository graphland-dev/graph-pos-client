export const rolesWithPermissions = [
  {
    name: "Accounting",
    collections: [
      "accounting__Account",
      "accounting__Expense",
      "accounting__ExpenseCategory",
      "accounting__Payroll",
      "accounting__Transaction",
      "accounting__Transfer",
    ],
  },
  {
    name: "People",
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
    collections: [
      "inventory__Product",
      "inventory__ProductCategory",
      "inventory__ProductPurchase",
      "inventory__ProductStock",
    ],
  },
  {
    name: "Setup",
    collections: ["setup__Brand", "setup__Unit", "setup__Vat"],
  },
];
