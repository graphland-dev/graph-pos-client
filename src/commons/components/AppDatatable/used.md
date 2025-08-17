 The DataTable component is used in 24 different pages across the application. Here are the main
  areas where it's used:

  Inventory Management:
  ✅ - products-list/productsList.page.tsx:221 (CONVERTED to AppDatatable)
  ✅ quotations/quotations.page.tsx
  ✅ - invoices/invoices.page.tsx (CONVERTED to AppDatatable)
  - purchases/purchase-list/purchase-list.page.tsx
  - payments/invoice-payments/invoice-payments.page.tsx
  - payments/purchase-payments/purchase-payments.page.tsx
  - Settings pages: vat/vat.page.tsx, unit/unit.page.tsx, brand/brand.page.tsx

  People Management:
  - suppliers/suppliers.page.tsx
  ✅ - employees/employees/employees.page.tsx (CONVERTED to AppDatatable)
  ✅ - employees/increments/increments.page.tsx (CONVERTED to AppDatatable)
  ✅ - client/client.page.tsx (CONVERTED to AppDatatable)
  - Employee detail components for payrolls and increments
  - Supplier details for purchases

  Accounting:
  ✅ - cashbook/accounts/accounts.page.tsx (CONVERTED to AppDatatable)
  ✅ - expense/expenseList/expenseList.page.tsx (CONVERTED to AppDatatable)
  - expense/expenseCategory/expenseCategory.page.tsx
  ✅ - cashbook/transfers/transfer.page.tsx (CONVERTED to AppDatatable)
  ✅ - cashbook/statements/statements.page.tsx (CONVERTED to AppDatatable)
  ✅ - cashbook/payroll/payroll.page.tsx (CONVERTED to AppDatatable)
  ✅ - cashbook/adjustment/adjustment.page.tsx (CONVERTED to AppDatatable)

  The component definition is in src/commons/components/DataTable.tsx.