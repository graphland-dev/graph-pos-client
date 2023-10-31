/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  _Any: { input: any; output: any; }
  federation__FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
};

export enum Accounting_Transaction_Source {
  BalanceAdjustment = 'BALANCE_ADJUSTMENT',
  BalanceTransfer = 'BALANCE_TRANSFER',
  ClientInvoicePayment = 'CLIENT_INVOICE_PAYMENT',
  EmployeeSalary = 'EMPLOYEE_SALARY',
  Expense = 'EXPENSE',
  LoanPayment = 'LOAN_PAYMENT',
  Payroll = 'PAYROLL'
}

export enum Accounting_Transaction_Type {
  Credit = 'CREDIT',
  Debit = 'DEBIT'
}

export type Account = {
  __typename?: 'Account';
  _id: Scalars['ID']['output'];
  brunchName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  creditAmount?: Maybe<Scalars['Float']['output']>;
  debitAmount?: Maybe<Scalars['Float']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  openedAt?: Maybe<Scalars['DateTime']['output']>;
  referenceNumber?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AccountsWithPagination = {
  __typename?: 'AccountsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Account>>;
};

export type Brand = {
  __typename?: 'Brand';
  _id: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type BrandsWithPagination = {
  __typename?: 'BrandsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Brand>>;
};

export type Client = {
  __typename?: 'Client';
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  contactNumber: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ClientsWithPagination = {
  __typename?: 'ClientsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Client>>;
};

export type CommonFindDocumentDto = {
  and?: InputMaybe<Array<CommonFindDocumentDto>>;
  key: Scalars['String']['input'];
  operator: MatchOperator;
  or?: InputMaybe<Array<CommonFindDocumentDto>>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CommonMutationResponse = {
  __typename?: 'CommonMutationResponse';
  _id: Scalars['ID']['output'];
};

export type CommonPaginationDto = {
  filterOperator?: InputMaybe<Where_Operator>;
  filters?: InputMaybe<Array<CommonFindDocumentDto>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortType>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAccountInput = {
  brunchName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  openedAt?: InputMaybe<Scalars['DateTime']['input']>;
  referenceNumber: Scalars['String']['input'];
};

export type CreateBrandInput = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateClientInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contactNumber: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateEmployeeDepartmentInput = {
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEmployeeIncrementInput = {
  amount: Scalars['Float']['input'];
  date?: InputMaybe<Scalars['DateTime']['input']>;
  employeeId: Scalars['ID']['input'];
  note: Scalars['String']['input'];
};

export type CreateEmployeeInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  appointmentDate?: InputMaybe<Scalars['DateTime']['input']>;
  bloodGroup?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  departmentId: Scalars['String']['input'];
  designation?: InputMaybe<Scalars['String']['input']>;
  docs?: InputMaybe<Scalars['String']['input']>;
  gender: User_Gender;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  joiningDate?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  religion?: InputMaybe<Scalars['String']['input']>;
  startingSalary?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateExpenseCategoryInput = {
  name: Scalars['String']['input'];
};

export type CreateExpenseInput = {
  accountId: Scalars['ID']['input'];
  amount: Scalars['Float']['input'];
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  checkNo?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  purpose: Scalars['String']['input'];
  voucherNo?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePayrollInput = {
  accountId: Scalars['String']['input'];
  employeeId: Scalars['String']['input'];
  opportunities: Array<PayrollOpportunityInput>;
  salaryDate: Scalars['DateTime']['input'];
  salaryMonth: Month_Name;
};

export type CreateProductCategoryInput = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProductInput = {
  brandId?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  code: Scalars['String']['input'];
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  discountMode?: InputMaybe<ProductDiscountMode>;
  discountPercentage?: InputMaybe<Scalars['Float']['input']>;
  modelName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  unitId?: InputMaybe<Scalars['String']['input']>;
  vatId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProductPurchaseInput = {
  costAmount: Scalars['Float']['input'];
  costs?: InputMaybe<Array<ProductPurchaseCostInput>>;
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  discountMode?: InputMaybe<ProductDiscountMode>;
  discountPercentage?: InputMaybe<Scalars['Float']['input']>;
  netTotal: Scalars['Float']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  products: Array<PurchaseProductItemInput>;
  purchaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  purchaseOrderDate?: InputMaybe<Scalars['DateTime']['input']>;
  subTotal: Scalars['Float']['input'];
  supplierId: Scalars['String']['input'];
  taxAmount: Scalars['Float']['input'];
  taxRate: Scalars['Float']['input'];
};

export type CreateProductStockInput = {
  note?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  source: ProductStockSource;
  type: ProductStockType;
};

export type CreatePurchasePaymentInput = {
  accountId: Scalars['String']['input'];
  checkNo?: InputMaybe<Scalars['String']['input']>;
  items: Array<PurchasePaymentReferenceInput>;
  note?: InputMaybe<Scalars['String']['input']>;
  receptNo?: InputMaybe<Scalars['String']['input']>;
  supplierId: Scalars['String']['input'];
};

export type CreateSupplierInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  contactNumber: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTransactionInput = {
  accountId: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  date?: InputMaybe<Scalars['DateTime']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Accounting_Transaction_Source>;
  type: Accounting_Transaction_Type;
};

export type CreateTransferInput = {
  amount: Scalars['Float']['input'];
  date?: InputMaybe<Scalars['DateTime']['input']>;
  fromAccountId: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  toAccountId: Scalars['ID']['input'];
};

export type CreateUnitInput = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVatInput = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  percentage: Scalars['Float']['input'];
};

export type Employee = {
  __typename?: 'Employee';
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  appointmentDate?: Maybe<Scalars['DateTime']['output']>;
  bloodGroup?: Maybe<Scalars['String']['output']>;
  contactNumber?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  department?: Maybe<EmployeeDepartment>;
  designation?: Maybe<Scalars['String']['output']>;
  docs?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<User_Gender>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  joiningDate?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  religion?: Maybe<Scalars['String']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  startingSalary?: Maybe<Scalars['Float']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EmployeeDepartment = {
  __typename?: 'EmployeeDepartment';
  _id: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EmployeeDepartmentWithPagination = {
  __typename?: 'EmployeeDepartmentWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<EmployeeDepartment>>;
};

export type EmployeeIncrement = {
  __typename?: 'EmployeeIncrement';
  _id: Scalars['ID']['output'];
  amount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  employee: Employee;
  note: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EmployeeIncrementsWithPagination = {
  __typename?: 'EmployeeIncrementsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<EmployeeIncrement>>;
};

export type EmployeesWithPagination = {
  __typename?: 'EmployeesWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Employee>>;
};

export type Expense = {
  __typename?: 'Expense';
  _id: Scalars['ID']['output'];
  account?: Maybe<Account>;
  amount?: Maybe<Scalars['Float']['output']>;
  category?: Maybe<Scalars['ID']['output']>;
  checkNo?: Maybe<Scalars['String']['output']>;
  coRelationId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  purpose: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  voucherNo?: Maybe<Scalars['String']['output']>;
};

export type ExpenseCategory = {
  __typename?: 'ExpenseCategory';
  _id: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExpenseCategorysWithPagination = {
  __typename?: 'ExpenseCategorysWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<ExpenseCategory>>;
};

export type ExpensesWithPagination = {
  __typename?: 'ExpensesWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Expense>>;
};

export enum Month_Name {
  April = 'APRIL',
  August = 'AUGUST',
  December = 'DECEMBER',
  February = 'FEBRUARY',
  January = 'JANUARY',
  July = 'JULY',
  June = 'JUNE',
  March = 'MARCH',
  May = 'MAY',
  November = 'NOVEMBER',
  October = 'OCTOBER',
  September = 'SEPTEMBER'
}

export enum MatchOperator {
  Contains = 'contains',
  Eq = 'eq',
  Exists = 'exists',
  Gt = 'gt',
  Gte = 'gte',
  In = 'in',
  Lt = 'lt',
  Lte = 'lte',
  Ne = 'ne',
  Nin = 'nin'
}

export type Mutation = {
  __typename?: 'Mutation';
  accounting__createAccount: CommonMutationResponse;
  accounting__createExpense: CommonMutationResponse;
  accounting__createExpenseCategory: CommonMutationResponse;
  accounting__createPayroll: CommonMutationResponse;
  accounting__createPurchasePayment: CommonMutationResponse;
  accounting__createTransaction: CommonMutationResponse;
  accounting__removeAccount: Scalars['Boolean']['output'];
  accounting__removeExpense: Scalars['Boolean']['output'];
  accounting__removeExpenseCategory: Scalars['Boolean']['output'];
  accounting__removePayroll: Scalars['Boolean']['output'];
  accounting__removeTransaction: Scalars['Boolean']['output'];
  accounting__removeTransfer: Scalars['Boolean']['output'];
  accounting__updateAccount: Scalars['Boolean']['output'];
  accounting__updateExpenseCategory: Scalars['Boolean']['output'];
  accounting__updateTransaction: Scalars['Boolean']['output'];
  acounting__createTransfer: CommonMutationResponse;
  inventory__createProduct: CommonMutationResponse;
  inventory__createProductCategory: CommonMutationResponse;
  inventory__createProductPurchase: CommonMutationResponse;
  inventory__createProductStock: CommonMutationResponse;
  inventory__removeProduct: Scalars['Boolean']['output'];
  inventory__removeProductCategory: Scalars['Boolean']['output'];
  inventory__removeProductPurchase: Scalars['Boolean']['output'];
  inventory__removeProductStock: Scalars['Boolean']['output'];
  inventory__updateProduct: Scalars['Boolean']['output'];
  inventory__updateProductCategory: Scalars['Boolean']['output'];
  people__createClient: CommonMutationResponse;
  people__createEmployee: CommonMutationResponse;
  people__createEmployeeDepartment: CommonMutationResponse;
  people__createEmployeeIncrement: CommonMutationResponse;
  people__createSupplier: CommonMutationResponse;
  people__removeClient: Scalars['Boolean']['output'];
  people__removeEmployeeDepartment: Scalars['Boolean']['output'];
  people__removeEmployeeIncrement: Scalars['Boolean']['output'];
  people__removeSupplier: Scalars['Boolean']['output'];
  people__updateClient: Scalars['Boolean']['output'];
  people__updateEmployeeDepartment: Scalars['Boolean']['output'];
  people__updateEmployeeIncrement: Scalars['Boolean']['output'];
  people__updateSupplier: Scalars['Boolean']['output'];
  pingMutation: Scalars['String']['output'];
  pingMutationWithInput: Scalars['String']['output'];
  removeEmployee: Scalars['Boolean']['output'];
  setup__createBrand: CommonMutationResponse;
  setup__createUnit: CommonMutationResponse;
  setup__createVat: CommonMutationResponse;
  setup__removeBrand: Scalars['Boolean']['output'];
  setup__removeUnit: Scalars['Boolean']['output'];
  setup__removeVat: Scalars['Boolean']['output'];
  setup__updateBrand: Scalars['Boolean']['output'];
  setup__updateUnit: Scalars['Boolean']['output'];
  setup__updateVat: Scalars['Boolean']['output'];
  updateEmployee: Scalars['Boolean']['output'];
};


export type MutationAccounting__CreateAccountArgs = {
  body: CreateAccountInput;
};


export type MutationAccounting__CreateExpenseArgs = {
  body: CreateExpenseInput;
};


export type MutationAccounting__CreateExpenseCategoryArgs = {
  body: CreateExpenseCategoryInput;
};


export type MutationAccounting__CreatePayrollArgs = {
  body: CreatePayrollInput;
};


export type MutationAccounting__CreatePurchasePaymentArgs = {
  body: CreatePurchasePaymentInput;
};


export type MutationAccounting__CreateTransactionArgs = {
  body: CreateTransactionInput;
};


export type MutationAccounting__RemoveAccountArgs = {
  where?: InputMaybe<CommonFindDocumentDto>;
};


export type MutationAccounting__RemoveExpenseArgs = {
  where: CommonFindDocumentDto;
};


export type MutationAccounting__RemoveExpenseCategoryArgs = {
  where: CommonFindDocumentDto;
};


export type MutationAccounting__RemovePayrollArgs = {
  where: CommonFindDocumentDto;
};


export type MutationAccounting__RemoveTransactionArgs = {
  where?: InputMaybe<CommonFindDocumentDto>;
};


export type MutationAccounting__RemoveTransferArgs = {
  where: CommonFindDocumentDto;
};


export type MutationAccounting__UpdateAccountArgs = {
  body?: InputMaybe<UpdateAccountInput>;
  where?: InputMaybe<CommonFindDocumentDto>;
};


export type MutationAccounting__UpdateExpenseCategoryArgs = {
  body: UpdateExpenseCategoryInput;
  where: CommonFindDocumentDto;
};


export type MutationAccounting__UpdateTransactionArgs = {
  body?: InputMaybe<UpdateTransactionInput>;
  where?: InputMaybe<CommonFindDocumentDto>;
};


export type MutationAcounting__CreateTransferArgs = {
  body: CreateTransferInput;
};


export type MutationInventory__CreateProductArgs = {
  body: CreateProductInput;
};


export type MutationInventory__CreateProductCategoryArgs = {
  body: CreateProductCategoryInput;
};


export type MutationInventory__CreateProductPurchaseArgs = {
  body: CreateProductPurchaseInput;
};


export type MutationInventory__CreateProductStockArgs = {
  body: CreateProductStockInput;
};


export type MutationInventory__RemoveProductArgs = {
  where: CommonFindDocumentDto;
};


export type MutationInventory__RemoveProductCategoryArgs = {
  where: CommonFindDocumentDto;
};


export type MutationInventory__RemoveProductPurchaseArgs = {
  where: CommonFindDocumentDto;
};


export type MutationInventory__RemoveProductStockArgs = {
  where: CommonFindDocumentDto;
};


export type MutationInventory__UpdateProductArgs = {
  body: UpdateProductInput;
  where: CommonFindDocumentDto;
};


export type MutationInventory__UpdateProductCategoryArgs = {
  body: UpdateProductCategoryInput;
  where: CommonFindDocumentDto;
};


export type MutationPeople__CreateClientArgs = {
  body: CreateClientInput;
};


export type MutationPeople__CreateEmployeeArgs = {
  body: CreateEmployeeInput;
};


export type MutationPeople__CreateEmployeeDepartmentArgs = {
  body: CreateEmployeeDepartmentInput;
};


export type MutationPeople__CreateEmployeeIncrementArgs = {
  body: CreateEmployeeIncrementInput;
};


export type MutationPeople__CreateSupplierArgs = {
  body: CreateSupplierInput;
};


export type MutationPeople__RemoveClientArgs = {
  where: CommonFindDocumentDto;
};


export type MutationPeople__RemoveEmployeeDepartmentArgs = {
  where: CommonFindDocumentDto;
};


export type MutationPeople__RemoveEmployeeIncrementArgs = {
  where: CommonFindDocumentDto;
};


export type MutationPeople__RemoveSupplierArgs = {
  where: CommonFindDocumentDto;
};


export type MutationPeople__UpdateClientArgs = {
  body: UpdateClientInput;
  where: CommonFindDocumentDto;
};


export type MutationPeople__UpdateEmployeeDepartmentArgs = {
  body: UpdateEmployeeDepartmentInput;
  where: CommonFindDocumentDto;
};


export type MutationPeople__UpdateEmployeeIncrementArgs = {
  body: UpdateEmployeeIncrementInput;
  where: CommonFindDocumentDto;
};


export type MutationPeople__UpdateSupplierArgs = {
  body: UpdateSupplierInput;
  where: CommonFindDocumentDto;
};


export type MutationPingMutationWithInputArgs = {
  input: PingInput;
};


export type MutationRemoveEmployeeArgs = {
  where: CommonFindDocumentDto;
};


export type MutationSetup__CreateBrandArgs = {
  body: CreateBrandInput;
};


export type MutationSetup__CreateUnitArgs = {
  body: CreateUnitInput;
};


export type MutationSetup__CreateVatArgs = {
  body: CreateVatInput;
};


export type MutationSetup__RemoveBrandArgs = {
  where: CommonFindDocumentDto;
};


export type MutationSetup__RemoveUnitArgs = {
  where: CommonFindDocumentDto;
};


export type MutationSetup__RemoveVatArgs = {
  where: CommonFindDocumentDto;
};


export type MutationSetup__UpdateBrandArgs = {
  body: UpdateBrandInput;
  where: CommonFindDocumentDto;
};


export type MutationSetup__UpdateUnitArgs = {
  body: UpdateUnitInput;
  where: CommonFindDocumentDto;
};


export type MutationSetup__UpdateVatArgs = {
  body: UpdateVatInput;
  where: CommonFindDocumentDto;
};


export type MutationUpdateEmployeeArgs = {
  body: UpdateEmployeeInput;
  where: CommonFindDocumentDto;
};

export type PagniationMeta = {
  __typename?: 'PagniationMeta';
  currentPage: Scalars['Float']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Float']['output'];
  totalPages: Scalars['Float']['output'];
};

export type Payroll = {
  __typename?: 'Payroll';
  _id: Scalars['ID']['output'];
  account: Account;
  amount?: Maybe<Scalars['Float']['output']>;
  coRelationId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  employee: Employee;
  opportunities: Array<PayrollOpportunity>;
  salaryDate: Scalars['DateTime']['output'];
  salaryMonth: Month_Name;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PayrollOpportunity = {
  __typename?: 'PayrollOpportunity';
  amount: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type PayrollOpportunityInput = {
  amount: Scalars['Float']['input'];
  name: Scalars['String']['input'];
};

export type PayrollsWithPagination = {
  __typename?: 'PayrollsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Payroll>>;
};

export type PingInput = {
  age: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type Product = {
  __typename?: 'Product';
  _id: Scalars['ID']['output'];
  brand?: Maybe<Brand>;
  category?: Maybe<ProductCategory>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  discountMode?: Maybe<ProductDiscountMode>;
  discountPercentage?: Maybe<Scalars['Float']['output']>;
  modelName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  stockInQuantity: Scalars['Int']['output'];
  stockOutQuantity: Scalars['Int']['output'];
  taxType?: Maybe<ProductTaxType>;
  unit?: Maybe<Unit>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  vat?: Maybe<Vat>;
};

export type ProductCategory = {
  __typename?: 'ProductCategory';
  _id: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductCategorysWithPagination = {
  __typename?: 'ProductCategorysWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<ProductCategory>>;
};

export enum ProductDiscountMode {
  Amount = 'AMOUNT',
  Percentage = 'PERCENTAGE'
}

export type ProductPurchase = {
  __typename?: 'ProductPurchase';
  _id: Scalars['ID']['output'];
  costAmount: Scalars['Float']['output'];
  costs: Array<ProductPurchaseCostReference>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  discountMode?: Maybe<ProductDiscountMode>;
  discountPercentage?: Maybe<Scalars['Float']['output']>;
  dueAmount?: Maybe<Scalars['Float']['output']>;
  netTotal: Scalars['Float']['output'];
  note?: Maybe<Scalars['String']['output']>;
  paidAmount?: Maybe<Scalars['Float']['output']>;
  products: Array<PurchaseProductItemReference>;
  purchaseDate?: Maybe<Scalars['DateTime']['output']>;
  purchaseOrderDate?: Maybe<Scalars['DateTime']['output']>;
  subTotal: Scalars['Float']['output'];
  supplier?: Maybe<Supplier>;
  taxAmount: Scalars['Float']['output'];
  taxRate: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductPurchaseCostInput = {
  amount: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type ProductPurchaseCostReference = {
  __typename?: 'ProductPurchaseCostReference';
  amount: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
};

export type ProductPurchasesWithPagination = {
  __typename?: 'ProductPurchasesWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<ProductPurchase>>;
};

export type ProductStock = {
  __typename?: 'ProductStock';
  _id: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  product: Product;
  quantity: Scalars['Int']['output'];
  source: ProductStockSource;
  type: ProductStockType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum ProductStockSource {
  Adjustment = 'ADJUSTMENT',
  Purchase = 'PURCHASE'
}

export enum ProductStockType {
  StockIn = 'STOCK_IN',
  StockOut = 'STOCK_OUT'
}

export type ProductStocksWithPagination = {
  __typename?: 'ProductStocksWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<ProductStock>>;
};

export enum ProductTaxType {
  Exclusive = 'EXCLUSIVE',
  Inclusive = 'INCLUSIVE'
}

export type ProductsWithPagination = {
  __typename?: 'ProductsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Product>>;
};

export type PurchasePayment = {
  __typename?: 'PurchasePayment';
  _id: Scalars['ID']['output'];
  account: Account;
  checkNo?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  items: Array<PurchasePaymentReference>;
  note?: Maybe<Scalars['String']['output']>;
  paidAmount: Scalars['Float']['output'];
  receptNo?: Maybe<Scalars['String']['output']>;
  supplier: Supplier;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PurchasePaymentReference = {
  __typename?: 'PurchasePaymentReference';
  amount: Scalars['Float']['output'];
  purchase: ProductPurchase;
};

export type PurchasePaymentReferenceInput = {
  amount: Scalars['Float']['input'];
  purchaseId: Scalars['String']['input'];
};

export type PurchasePaymentsWithPagination = {
  __typename?: 'PurchasePaymentsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<PurchasePayment>>;
};

export type PurchaseProductItemInput = {
  name: Scalars['String']['input'];
  netAmount: Scalars['Float']['input'];
  quantity: Scalars['Int']['input'];
  referenceId: Scalars['ID']['input'];
  subAmount: Scalars['Float']['input'];
  taxAmount: Scalars['Float']['input'];
  taxRate: Scalars['Float']['input'];
  taxType: ProductTaxType;
  unitPrice: Scalars['Float']['input'];
};

export type PurchaseProductItemReference = {
  __typename?: 'PurchaseProductItemReference';
  name: Scalars['String']['output'];
  netAmount: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  referenceId: Scalars['ID']['output'];
  taxAmount: Scalars['Float']['output'];
  taxRate: Scalars['Float']['output'];
  taxType: ProductTaxType;
  unitPrice: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  accounting__account: Account;
  accounting__accounts: AccountsWithPagination;
  accounting__expense: Expense;
  accounting__expenseCategory: ExpenseCategory;
  accounting__expenseCategorys: ExpenseCategorysWithPagination;
  accounting__expenses: ExpensesWithPagination;
  accounting__payrolls: PayrollsWithPagination;
  accounting__purchasePayments: PurchasePaymentsWithPagination;
  accounting__transaction: Transaction;
  accounting__transactions: TransactionsWithPagination;
  acounting__transfer: Transfer;
  acounting__transfers: TransfersWithPagination;
  inventory__product: Product;
  inventory__productCategories: ProductCategorysWithPagination;
  inventory__productCategory: ProductCategory;
  inventory__productPurchase: ProductPurchase;
  inventory__productPurchases: ProductPurchasesWithPagination;
  inventory__productStocks: ProductStocksWithPagination;
  inventory__products: ProductsWithPagination;
  people__client: Client;
  people__clients: ClientsWithPagination;
  people__employee: Employee;
  people__employeeDepartment: EmployeeDepartment;
  people__employeeDepartments: EmployeeDepartmentWithPagination;
  people__employeeIncrement: EmployeeIncrement;
  people__employeeIncrements: EmployeeIncrementsWithPagination;
  people__employees: EmployeesWithPagination;
  people__supplier: Supplier;
  people__suppliers: SuppliersWithPagination;
  pingQuery: Scalars['String']['output'];
  setup__brand: Brand;
  setup__brands: BrandsWithPagination;
  setup__unit: Unit;
  setup__units: UnitsWithPagination;
  setup__vats: VatsWithPagination;
};


export type QueryAccounting__AccountArgs = {
  where?: InputMaybe<CommonFindDocumentDto>;
};


export type QueryAccounting__AccountsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryAccounting__ExpenseArgs = {
  where: CommonFindDocumentDto;
};


export type QueryAccounting__ExpenseCategoryArgs = {
  where: CommonFindDocumentDto;
};


export type QueryAccounting__ExpenseCategorysArgs = {
  where: CommonPaginationDto;
};


export type QueryAccounting__ExpensesArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryAccounting__PayrollsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryAccounting__PurchasePaymentsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryAccounting__TransactionArgs = {
  where?: InputMaybe<CommonFindDocumentDto>;
};


export type QueryAccounting__TransactionsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryAcounting__TransferArgs = {
  where: CommonFindDocumentDto;
};


export type QueryAcounting__TransfersArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryInventory__ProductArgs = {
  where: CommonFindDocumentDto;
};


export type QueryInventory__ProductCategoriesArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryInventory__ProductCategoryArgs = {
  where: CommonFindDocumentDto;
};


export type QueryInventory__ProductPurchaseArgs = {
  where: CommonFindDocumentDto;
};


export type QueryInventory__ProductPurchasesArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryInventory__ProductStocksArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryInventory__ProductsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryPeople__ClientArgs = {
  where: CommonFindDocumentDto;
};


export type QueryPeople__ClientsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryPeople__EmployeeArgs = {
  where: CommonFindDocumentDto;
};


export type QueryPeople__EmployeeDepartmentArgs = {
  where: CommonFindDocumentDto;
};


export type QueryPeople__EmployeeDepartmentsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryPeople__EmployeeIncrementArgs = {
  where: CommonFindDocumentDto;
};


export type QueryPeople__EmployeeIncrementsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryPeople__EmployeesArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryPeople__SupplierArgs = {
  where: CommonFindDocumentDto;
};


export type QueryPeople__SuppliersArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QuerySetup__BrandArgs = {
  where?: InputMaybe<CommonFindDocumentDto>;
};


export type QuerySetup__BrandsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QuerySetup__UnitArgs = {
  where: CommonFindDocumentDto;
};


export type QuerySetup__UnitsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QuerySetup__VatsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};

export enum SortType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Supplier = {
  __typename?: 'Supplier';
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  contactNumber: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SuppliersWithPagination = {
  __typename?: 'SuppliersWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Supplier>>;
};

export type Transaction = {
  __typename?: 'Transaction';
  _id: Scalars['ID']['output'];
  account?: Maybe<Account>;
  amount?: Maybe<Scalars['Float']['output']>;
  coRelationId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Accounting_Transaction_Source>;
  type?: Maybe<Accounting_Transaction_Type>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TransactionsWithPagination = {
  __typename?: 'TransactionsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Transaction>>;
};

export type Transfer = {
  __typename?: 'Transfer';
  _id: Scalars['ID']['output'];
  amount: Scalars['Float']['output'];
  coRelationId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  fromAccount?: Maybe<Account>;
  note?: Maybe<Scalars['String']['output']>;
  toAccount?: Maybe<Account>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TransfersWithPagination = {
  __typename?: 'TransfersWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Transfer>>;
};

export enum User_Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  NonBinary = 'NON_BINARY',
  Other = 'OTHER',
  PreferNotToSay = 'PREFER_NOT_TO_SAY'
};

export enum Generate_Barcode_Type{
  Code128 = "code128",
  CodeBar = "code39",
  Msi = "mis",
  PharmaCode ="pharmacode"
};

export type Unit = {
  __typename?: 'Unit';
  _id: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UnitsWithPagination = {
  __typename?: 'UnitsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Unit>>;
};

export type UpdateAccountInput = {
  brunchName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  openedAt?: InputMaybe<Scalars['DateTime']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBrandInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateClientInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployeeDepartmentInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployeeIncrementInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  employeeId?: InputMaybe<Scalars['ID']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployeeInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  appointmentDate?: InputMaybe<Scalars['DateTime']['input']>;
  bloodGroup?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  designation?: InputMaybe<Scalars['String']['input']>;
  docs?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<User_Gender>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  joiningDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  religion?: InputMaybe<Scalars['String']['input']>;
  startingSalary?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateExpenseCategoryInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductCategoryInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  brandId?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  discountMode?: InputMaybe<ProductDiscountMode>;
  discountPercentage?: InputMaybe<Scalars['Float']['input']>;
  modelName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  unitId?: InputMaybe<Scalars['String']['input']>;
  vatId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSupplierInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTransactionInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Accounting_Transaction_Source>;
  type?: InputMaybe<Accounting_Transaction_Type>;
};

export type UpdateUnitInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVatInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  percentage?: InputMaybe<Scalars['Float']['input']>;
};

export type Vat = {
  __typename?: 'Vat';
  _id: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  percentage: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type VatsWithPagination = {
  __typename?: 'VatsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Vat>>;
};

export enum Where_Operator {
  And = 'and',
  Or = 'or'
}

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}

export type Setup__BrandsQueryVariables = Exact<{ [key: string]: never; }>;


export type Setup__BrandsQuery = { __typename?: 'Query', setup__brands: { __typename?: 'BrandsWithPagination', meta?: { __typename?: 'PagniationMeta', totalCount: number } | null, nodes?: Array<{ __typename?: 'Brand', _id: string, code: string, createdAt?: any | null, name: string, note?: string | null, updatedAt?: any | null }> | null } };

export type Setup__CreateBrandMutationVariables = Exact<{
  body: CreateBrandInput;
}>;


export type Setup__CreateBrandMutation = { __typename?: 'Mutation', setup__createBrand: { __typename?: 'CommonMutationResponse', _id: string } };

export type Setup__UpdateBrandMutationVariables = Exact<{
  where: CommonFindDocumentDto;
  body: UpdateBrandInput;
}>;


export type Setup__UpdateBrandMutation = { __typename?: 'Mutation', setup__updateBrand: boolean };

export type Setup__RemoveBrandMutationVariables = Exact<{
  where: CommonFindDocumentDto;
}>;


export type Setup__RemoveBrandMutation = { __typename?: 'Mutation', setup__removeBrand: boolean };


export const Setup__BrandsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Setup__brands"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setup__brands"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<Setup__BrandsQuery, Setup__BrandsQueryVariables>;
export const Setup__CreateBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Setup__createBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBrandInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setup__createBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<Setup__CreateBrandMutation, Setup__CreateBrandMutationVariables>;
export const Setup__UpdateBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Setup__updateBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommonFindDocumentDto"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBrandInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setup__updateBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}}]}]}}]} as unknown as DocumentNode<Setup__UpdateBrandMutation, Setup__UpdateBrandMutationVariables>;
export const Setup__RemoveBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Setup__removeBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommonFindDocumentDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setup__removeBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}]}]}}]} as unknown as DocumentNode<Setup__RemoveBrandMutation, Setup__RemoveBrandMutationVariables>;