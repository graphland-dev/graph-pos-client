 The DataTable component is used in 24 different pages across the application. Here are the main
  areas where it's used:

  Inventory Management:
  - products-list/productsList.page.tsx:221 (where you selected)
  - quotations/quotations.page.tsx
  - invoices/invoices.page.tsx
  - purchases/purchase-list/purchase-list.page.tsx
  - payments/invoice-payments/invoice-payments.page.tsx
  - payments/purchase-payments/purchase-payments.page.tsx
  - Settings pages: vat/vat.page.tsx, unit/unit.page.tsx, brand/brand.page.tsx

  People Management:
  - suppliers/suppliers.page.tsx
  - employees/employees/employees.page.tsx
  - employees/increments/increments.page.tsx
  - client/client.page.tsx
  - Employee detail components for payrolls and increments
  - Supplier details for purchases

  Accounting:
  - cashbook/accounts/accounts.page.tsx
  - expense/expenseList/expenseList.page.tsx
  - expense/expenseCategory/expenseCategory.page.tsx
  - cashbook/transfers/transfer.page.tsx
  - cashbook/statements/statements.page.tsx
  - cashbook/payroll/payroll.page.tsx
  - cashbook/adjustment/adjustment.page.tsx

  The component definition is in src/commons/components/DataTable.tsx.