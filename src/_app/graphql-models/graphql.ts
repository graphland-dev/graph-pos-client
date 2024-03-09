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
  Payroll = 'PAYROLL',
  PurchasePayment = 'PURCHASE_PAYMENT'
}

export enum Accounting_Transaction_Type {
  Credit = 'CREDIT',
  Debit = 'DEBIT'
}

export type Account = {
  __typename?: 'Account';
  _id: Scalars['ID']['output'];
  attachments?: Maybe<Array<ServerFileReference>>;
  brunchName?: Maybe<Scalars['String']['output']>;
  committedBy?: Maybe<UserReference>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  creditAmount?: Maybe<Scalars['Float']['output']>;
  debitAmount?: Maybe<Scalars['Float']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  openedAt?: Maybe<Scalars['DateTime']['output']>;
  referenceNumber?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AccountsWithPagination = {
  __typename?: 'AccountsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Account>>;
};

export type AddUserToTenantInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Brand = {
  __typename?: 'Brand';
  _id: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
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
  attachments?: Maybe<Array<ServerFileReference>>;
  contactNumber: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ClientsWithPagination = {
  __typename?: 'ClientsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Client>>;
};

export type CommonFindDocumentDto = {
  and?: InputMaybe<Array<CommonFindDocumentDto>>;
  key?: InputMaybe<Scalars['String']['input']>;
  operator?: InputMaybe<MatchOperator>;
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

export type CostItemReference = {
  __typename?: 'CostItemReference';
  amount: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
};

export type CostItemReferenceInput = {
  amount: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAccountInput = {
  attachments?: InputMaybe<Array<ServerFileInput>>;
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
  attachments?: InputMaybe<Array<ServerFileInput>>;
  contactNumber: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateEmployeeDepartmentInput = {
  attachments?: InputMaybe<Array<ServerFileInput>>;
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEmployeeIncrementInput = {
  amount: Scalars['Float']['input'];
  attachments?: InputMaybe<Array<ServerFileInput>>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  employeeId: Scalars['ID']['input'];
  note: Scalars['String']['input'];
};

export type CreateEmployeeInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  appointmentDate?: InputMaybe<Scalars['DateTime']['input']>;
  attachments?: InputMaybe<Array<ServerFileInput>>;
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
  attachments?: InputMaybe<Array<ServerFileInput>>;
  name: Scalars['String']['input'];
};

export type CreateExpenseInput = {
  accountId: Scalars['ID']['input'];
  amount: Scalars['Float']['input'];
  attachments?: InputMaybe<Array<ServerFileInput>>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  checkNo?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  purpose: Scalars['String']['input'];
  voucherNo?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePayrollInput = {
  accountId: Scalars['String']['input'];
  attachments?: InputMaybe<Array<ServerFileInput>>;
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
  gallery?: InputMaybe<Array<ServerFileInput>>;
  modelName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  thumbnail?: InputMaybe<ServerFileInput>;
  unitId?: InputMaybe<Scalars['String']['input']>;
  vatId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProductInvoiceInput = {
  clientId: Scalars['String']['input'];
  costAmount: Scalars['Float']['input'];
  costs?: InputMaybe<Array<CostItemReferenceInput>>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  discountMode?: InputMaybe<ProductDiscountMode>;
  discountPercentage?: InputMaybe<Scalars['Float']['input']>;
  netTotal: Scalars['Float']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  products: Array<ProductItemReferenceInput>;
  subTotal: Scalars['Float']['input'];
  taxAmount?: InputMaybe<Scalars['Float']['input']>;
  taxRate?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateProductPurchaseInput = {
  costAmount: Scalars['Float']['input'];
  costs?: InputMaybe<Array<CostItemReferenceInput>>;
  discountAmount?: InputMaybe<Scalars['Float']['input']>;
  discountMode?: InputMaybe<ProductDiscountMode>;
  discountPercentage?: InputMaybe<Scalars['Float']['input']>;
  netTotal: Scalars['Float']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  products: Array<ProductItemReferenceInput>;
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
  attachments?: InputMaybe<Array<ServerFileInput>>;
  checkNo?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  items: Array<PurchasePaymentReferenceInput>;
  note?: InputMaybe<Scalars['String']['input']>;
  receptNo?: InputMaybe<Scalars['String']['input']>;
  supplierId: Scalars['String']['input'];
};

export type CreateRoleInput = {
  name: Scalars['String']['input'];
  permissions?: InputMaybe<Array<RolePermissionInput>>;
  tenantId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSupplierInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  attachments?: InputMaybe<Array<ServerFileInput>>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  contactNumber: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTenantInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  businessPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  /** Tenant name */
  name: Scalars['String']['input'];
  /** Tenant UID */
  uid: Scalars['String']['input'];
};

export type CreateTransactionInput = {
  accountId: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  attachments?: InputMaybe<Array<ServerFileInput>>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Accounting_Transaction_Source>;
  type: Accounting_Transaction_Type;
};

export type CreateTransferInput = {
  amount: Scalars['Float']['input'];
  attachments?: InputMaybe<Array<ServerFileInput>>;
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

export type CreateUserInput = {
  avatar?: InputMaybe<ServerFileInput>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  tenants?: InputMaybe<Array<UserTenantInput>>;
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
  attachments?: Maybe<Array<ServerFileReference>>;
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
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EmployeeDepartment = {
  __typename?: 'EmployeeDepartment';
  _id: Scalars['ID']['output'];
  attachments?: Maybe<Array<ServerFileReference>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
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
  attachments?: Maybe<Array<ServerFileReference>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  employee: Employee;
  note: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
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
  attachments?: Maybe<Array<ServerFileReference>>;
  category?: Maybe<Scalars['ID']['output']>;
  checkNo?: Maybe<Scalars['String']['output']>;
  coRelationId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  purpose: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  voucherNo?: Maybe<Scalars['String']['output']>;
};

export type ExpenseCategory = {
  __typename?: 'ExpenseCategory';
  _id: Scalars['ID']['output'];
  attachments?: Maybe<Array<ServerFileReference>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['ID']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
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

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponseDto = {
  __typename?: 'LoginResponseDto';
  accessToken: Scalars['String']['output'];
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
  accounting__createTransfer: CommonMutationResponse;
  accounting__removeAccount: Scalars['Boolean']['output'];
  accounting__removeExpense: Scalars['Boolean']['output'];
  accounting__removeExpenseCategory: Scalars['Boolean']['output'];
  accounting__removePayroll: Scalars['Boolean']['output'];
  accounting__removeTransaction: Scalars['Boolean']['output'];
  accounting__removeTransfer: Scalars['Boolean']['output'];
  accounting__updateAccount: Scalars['Boolean']['output'];
  accounting__updateExpenseCategory: Scalars['Boolean']['output'];
  accounting__updateTransaction: Scalars['Boolean']['output'];
  identity__BootstrapRoles: Scalars['Boolean']['output'];
  identity__addUserToCurrentTenant: Scalars['Boolean']['output'];
  identity__createRole: CommonMutationResponse;
  identity__createTenant: CommonMutationResponse;
  identity__createUser: CommonMutationResponse;
  identity__login: LoginResponseDto;
  identity__removeUserTenantMembership: Scalars['Boolean']['output'];
  identity__updateCurrentTenant: Scalars['Boolean']['output'];
  identity__updateCurrentTenantUserRole: Scalars['Boolean']['output'];
  identity__updateMe?: Maybe<Scalars['Boolean']['output']>;
  identity__updateMyPassword?: Maybe<Scalars['Boolean']['output']>;
  identity__updateRole: Scalars['Boolean']['output'];
  identity__updateTenant: CommonMutationResponse;
  inventory__createProduct: CommonMutationResponse;
  inventory__createProductCategory: CommonMutationResponse;
  inventory__createProductInvoice: CommonMutationResponse;
  inventory__createProductPurchase: CommonMutationResponse;
  inventory__createProductStock: CommonMutationResponse;
  inventory__loadDemoProducts: Scalars['Boolean']['output'];
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


export type MutationAccounting__CreateTransferArgs = {
  body: CreateTransferInput;
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


export type MutationIdentity__AddUserToCurrentTenantArgs = {
  input: AddUserToTenantInput;
};


export type MutationIdentity__CreateRoleArgs = {
  body: CreateRoleInput;
};


export type MutationIdentity__CreateTenantArgs = {
  input: CreateTenantInput;
};


export type MutationIdentity__CreateUserArgs = {
  input: CreateUserInput;
};


export type MutationIdentity__LoginArgs = {
  input: LoginInput;
};


export type MutationIdentity__RemoveUserTenantMembershipArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationIdentity__UpdateCurrentTenantArgs = {
  input: UpdateTenantInput;
};


export type MutationIdentity__UpdateCurrentTenantUserRoleArgs = {
  roles: Array<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};


export type MutationIdentity__UpdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationIdentity__UpdateMyPasswordArgs = {
  input: UpdateMyPasswordInput;
};


export type MutationIdentity__UpdateRoleArgs = {
  body: UpdateRoleInput;
  where: CommonFindDocumentDto;
};


export type MutationIdentity__UpdateTenantArgs = {
  input: UpdateTenantInput;
  where?: InputMaybe<CommonFindDocumentDto>;
};


export type MutationInventory__CreateProductArgs = {
  body: CreateProductInput;
};


export type MutationInventory__CreateProductCategoryArgs = {
  body: CreateProductCategoryInput;
};


export type MutationInventory__CreateProductInvoiceArgs = {
  input: CreateProductInvoiceInput;
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

export enum Product_Sell_Source {
  Ecommerce = 'ECOMMERCE',
  Pos = 'POS',
  Quatation = 'QUATATION'
}

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
  attachments?: Maybe<Array<ServerFileReference>>;
  coRelationId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  employee: Employee;
  opportunities: Array<PayrollOpportunity>;
  salaryDate: Scalars['DateTime']['output'];
  salaryMonth: Month_Name;
  tenant?: Maybe<Scalars['String']['output']>;
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
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  discountMode?: Maybe<ProductDiscountMode>;
  discountPercentage?: Maybe<Scalars['Float']['output']>;
  gallery?: Maybe<Array<ServerFileReference>>;
  isDemo?: Maybe<Scalars['Boolean']['output']>;
  modelName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  stockInQuantity: Scalars['Int']['output'];
  stockOutQuantity: Scalars['Int']['output'];
  taxType?: Maybe<ProductTaxType>;
  tenant?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<ServerFileReference>;
  unit?: Maybe<Unit>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  vat?: Maybe<Vat>;
};

export type ProductCategory = {
  __typename?: 'ProductCategory';
  _id: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  isDemo?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
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

export type ProductInvoice = {
  __typename?: 'ProductInvoice';
  _id: Scalars['ID']['output'];
  client?: Maybe<Client>;
  committedBy?: Maybe<UserReference>;
  costAmount: Scalars['Float']['output'];
  costs: Array<CostItemReference>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  discountMode?: Maybe<ProductDiscountMode>;
  discountPercentage?: Maybe<Scalars['Float']['output']>;
  invoiceUID?: Maybe<Scalars['String']['output']>;
  netTotal: Scalars['Float']['output'];
  note?: Maybe<Scalars['String']['output']>;
  paidAmount?: Maybe<Scalars['Float']['output']>;
  products: Array<ProductItemReference>;
  purchaseDate?: Maybe<Scalars['DateTime']['output']>;
  purchaseOrderDate?: Maybe<Scalars['DateTime']['output']>;
  source?: Maybe<Product_Sell_Source>;
  subTotal: Scalars['Float']['output'];
  taxAmount: Scalars['Float']['output'];
  taxRate: Scalars['Float']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductInvoicesWithPagination = {
  __typename?: 'ProductInvoicesWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<ProductInvoice>>;
};

export type ProductItemReference = {
  __typename?: 'ProductItemReference';
  code?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  netAmount: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  referenceId: Scalars['ID']['output'];
  taxAmount: Scalars['Float']['output'];
  taxRate: Scalars['Float']['output'];
  taxType: ProductTaxType;
  unitPrice: Scalars['Float']['output'];
};

export type ProductItemReferenceInput = {
  code?: InputMaybe<Scalars['String']['input']>;
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

export type ProductPurchase = {
  __typename?: 'ProductPurchase';
  _id: Scalars['ID']['output'];
  costAmount: Scalars['Float']['output'];
  costs: Array<CostItemReference>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  discountMode?: Maybe<ProductDiscountMode>;
  discountPercentage?: Maybe<Scalars['Float']['output']>;
  netTotal: Scalars['Float']['output'];
  note?: Maybe<Scalars['String']['output']>;
  paidAmount?: Maybe<Scalars['Float']['output']>;
  paymentHistory?: Maybe<Array<ProductPurchasePaymentHistoryReference>>;
  products: Array<ProductItemReference>;
  purchaseDate?: Maybe<Scalars['DateTime']['output']>;
  purchaseOrderDate?: Maybe<Scalars['DateTime']['output']>;
  purchaseUID?: Maybe<Scalars['String']['output']>;
  subTotal: Scalars['Float']['output'];
  supplier?: Maybe<Supplier>;
  taxAmount: Scalars['Float']['output'];
  taxRate: Scalars['Float']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductPurchasePaymentHistoryReference = {
  __typename?: 'ProductPurchasePaymentHistoryReference';
  amount?: Maybe<Scalars['Float']['output']>;
  committedBy?: Maybe<UserReference>;
  date?: Maybe<Scalars['DateTime']['output']>;
  paymentUID?: Maybe<Scalars['String']['output']>;
  referenceId?: Maybe<Scalars['String']['output']>;
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
  invoiceUID?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  product: Product;
  purchaseUID?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Int']['output'];
  source: ProductStockSource;
  tenant?: Maybe<Scalars['String']['output']>;
  type: ProductStockType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum ProductStockSource {
  Adjustment = 'ADJUSTMENT',
  Invoice = 'INVOICE',
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
  attachments?: Maybe<Array<ServerFileReference>>;
  checkNo?: Maybe<Scalars['String']['output']>;
  committedBy?: Maybe<UserReference>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  items: Array<PurchasePaymentItemReference>;
  note?: Maybe<Scalars['String']['output']>;
  paidAmount: Scalars['Float']['output'];
  paymentUID?: Maybe<Scalars['String']['output']>;
  receptNo?: Maybe<Scalars['String']['output']>;
  supplier: Supplier;
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PurchasePaymentItemReference = {
  __typename?: 'PurchasePaymentItemReference';
  amount: Scalars['Float']['output'];
  purchase: ProductPurchase;
  purchaseUID?: Maybe<Scalars['String']['output']>;
};

export type PurchasePaymentReferenceInput = {
  amount: Scalars['Float']['input'];
  attachments?: InputMaybe<Array<ServerFileInput>>;
  purchaseId: Scalars['String']['input'];
  purchaseUID?: InputMaybe<Scalars['String']['input']>;
};

export type PurchasePaymentsWithPagination = {
  __typename?: 'PurchasePaymentsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<PurchasePayment>>;
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
  accounting__transfer: Transfer;
  accounting__transfers: TransfersWithPagination;
  identity__currentTenantRoles: Array<Role>;
  identity__currentTenantUsers?: Maybe<UsersWithPagination>;
  identity__me?: Maybe<User>;
  identity__myPermissions?: Maybe<Array<RolePermission>>;
  identity__myTenants: TenantsWithPagination;
  identity__roles: RolesWithPagination;
  identity__tenants: TenantsWithPagination;
  identity__users: UsersWithPagination;
  inventory__product: Product;
  inventory__productCategories: ProductCategorysWithPagination;
  inventory__productCategory: ProductCategory;
  inventory__productInvoice: ProductInvoice;
  inventory__productInvoices: ProductInvoicesWithPagination;
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


export type QueryAccounting__TransferArgs = {
  where: CommonFindDocumentDto;
};


export type QueryAccounting__TransfersArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryIdentity__CurrentTenantUsersArgs = {
  input?: InputMaybe<CommonPaginationDto>;
};


export type QueryIdentity__MyPermissionsArgs = {
  tenant: Scalars['String']['input'];
};


export type QueryIdentity__RolesArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryIdentity__TenantsArgs = {
  where?: InputMaybe<CommonPaginationDto>;
};


export type QueryIdentity__UsersArgs = {
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


export type QueryInventory__ProductInvoiceArgs = {
  where: CommonFindDocumentDto;
};


export type QueryInventory__ProductInvoicesArgs = {
  where?: InputMaybe<CommonPaginationDto>;
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

export type Role = {
  __typename?: 'Role';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  permissions: Array<RolePermission>;
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type RolePermission = {
  __typename?: 'RolePermission';
  actions: Array<Scalars['String']['output']>;
  collectionName: Scalars['String']['output'];
};

export type RolePermissionInput = {
  actions: Array<Scalars['String']['input']>;
  collectionName: Scalars['String']['input'];
};

export type RolesWithPagination = {
  __typename?: 'RolesWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Role>>;
};

export type ServerFileInput = {
  meta?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<ServerFileProvider>;
};

export enum ServerFileProvider {
  Cloudinary = 'CLOUDINARY',
  Direct = 'DIRECT',
  S3 = 'S3'
}

export type ServerFileReference = {
  __typename?: 'ServerFileReference';
  externalUrl?: Maybe<Scalars['String']['output']>;
  meta?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<ServerFileProvider>;
};

export enum SortType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Supplier = {
  __typename?: 'Supplier';
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  attachments?: Maybe<Array<ServerFileReference>>;
  companyName?: Maybe<Scalars['String']['output']>;
  contactNumber: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SuppliersWithPagination = {
  __typename?: 'SuppliersWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Supplier>>;
};

export type Tenant = {
  __typename?: 'Tenant';
  _id: Scalars['ID']['output'];
  address?: Maybe<Scalars['String']['output']>;
  businessPhoneNumber?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<ServerFileReference>;
  name: Scalars['String']['output'];
  uid?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TenantsWithPagination = {
  __typename?: 'TenantsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Tenant>>;
};

export type Transaction = {
  __typename?: 'Transaction';
  _id: Scalars['ID']['output'];
  account?: Maybe<Account>;
  amount?: Maybe<Scalars['Float']['output']>;
  attachments?: Maybe<Array<ServerFileReference>>;
  coRelationId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Accounting_Transaction_Source>;
  tenant?: Maybe<Scalars['String']['output']>;
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
  attachments?: Maybe<Array<ServerFileReference>>;
  coRelationId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  fromAccount?: Maybe<Account>;
  note?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
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
}

export type Unit = {
  __typename?: 'Unit';
  _id: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UnitsWithPagination = {
  __typename?: 'UnitsWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<Unit>>;
};

export type UpdateAccountInput = {
  attachments?: InputMaybe<Array<ServerFileInput>>;
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
  attachments?: InputMaybe<Array<ServerFileInput>>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployeeDepartmentInput = {
  attachments?: InputMaybe<Array<ServerFileInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployeeIncrementInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  attachments?: InputMaybe<Array<ServerFileInput>>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  employeeId?: InputMaybe<Scalars['ID']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEmployeeInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  appointmentDate?: InputMaybe<Scalars['DateTime']['input']>;
  attachments?: InputMaybe<Array<ServerFileInput>>;
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
  attachments?: InputMaybe<Array<ServerFileInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMeInput = {
  avatar?: InputMaybe<ServerFileInput>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMyPasswordInput = {
  confirmNewPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
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
  gallery?: InputMaybe<Array<ServerFileInput>>;
  modelName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  thumbnail?: InputMaybe<ServerFileInput>;
  unitId?: InputMaybe<Scalars['String']['input']>;
  vatId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<RolePermissionInput>>;
  tenantId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSupplierInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  attachments?: InputMaybe<Array<ServerFileInput>>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTenantInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  businessPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<ServerFileInput>;
  /** Tenant name */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTransactionInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  attachments?: InputMaybe<Array<ServerFileInput>>;
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

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  avatar?: Maybe<ServerFileReference>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  memberships?: Maybe<Array<UserTenant>>;
  name?: Maybe<Scalars['String']['output']>;
  systemRoles?: Maybe<Array<Scalars['String']['output']>>;
  tenant?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserReference = {
  __typename?: 'UserReference';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  referenceId?: Maybe<Scalars['ID']['output']>;
};

export type UserTenant = {
  __typename?: 'UserTenant';
  roles?: Maybe<Array<Scalars['String']['output']>>;
  tenant?: Maybe<Scalars['String']['output']>;
};

export type UserTenantInput = {
  roles?: InputMaybe<Scalars['String']['input']>;
  tenantId?: InputMaybe<Scalars['String']['input']>;
};

export type UsersWithPagination = {
  __typename?: 'UsersWithPagination';
  meta?: Maybe<PagniationMeta>;
  nodes?: Maybe<Array<User>>;
};

export type Vat = {
  __typename?: 'Vat';
  _id: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  percentage: Scalars['Float']['output'];
  tenant?: Maybe<Scalars['String']['output']>;
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

export type Get_User_QueriesQueryVariables = Exact<{
  tenant: Scalars['String']['input'];
}>;


export type Get_User_QueriesQuery = { __typename?: 'Query', identity__me?: { __typename?: 'User', _id: string, email?: string | null, name?: string | null, memberships?: Array<{ __typename?: 'UserTenant', tenant?: string | null, roles?: Array<string> | null }> | null, avatar?: { __typename?: 'ServerFileReference', meta?: string | null, path?: string | null, provider?: ServerFileProvider | null } | null } | null, identity__myPermissions?: Array<{ __typename?: 'RolePermission', collectionName: string, actions: Array<string> }> | null, identity__myTenants: { __typename?: 'TenantsWithPagination', nodes?: Array<{ __typename?: 'Tenant', _id: string, name: string, uid?: string | null, address?: string | null, businessPhoneNumber?: string | null, description?: string | null, createdAt?: any | null, logo?: { __typename?: 'ServerFileReference', meta?: string | null, path?: string | null, provider?: ServerFileProvider | null } | null }> | null } };

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

export type Identity__LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type Identity__LoginMutation = { __typename?: 'Mutation', identity__login: { __typename?: 'LoginResponseDto', accessToken: string } };

export type Identity__MyTenantsQueryVariables = Exact<{ [key: string]: never; }>;


export type Identity__MyTenantsQuery = { __typename?: 'Query', identity__myTenants: { __typename?: 'TenantsWithPagination', nodes?: Array<{ __typename?: 'Tenant', _id: string, name: string, uid?: string | null, createdAt?: any | null }> | null } };


export const Get_User_QueriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GET_USER_QUERIES"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity__me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenant"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identity__myPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tenant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tenant"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectionName"}},{"kind":"Field","name":{"kind":"Name","value":"actions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"identity__myTenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"businessPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Get_User_QueriesQuery, Get_User_QueriesQueryVariables>;
export const Setup__BrandsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Setup__brands"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setup__brands"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<Setup__BrandsQuery, Setup__BrandsQueryVariables>;
export const Setup__CreateBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Setup__createBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBrandInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setup__createBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<Setup__CreateBrandMutation, Setup__CreateBrandMutationVariables>;
export const Setup__UpdateBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Setup__updateBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommonFindDocumentDto"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBrandInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setup__updateBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}}]}]}}]} as unknown as DocumentNode<Setup__UpdateBrandMutation, Setup__UpdateBrandMutationVariables>;
export const Setup__RemoveBrandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Setup__removeBrand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommonFindDocumentDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setup__removeBrand"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}]}]}}]} as unknown as DocumentNode<Setup__RemoveBrandMutation, Setup__RemoveBrandMutationVariables>;
export const Identity__LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Identity__login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity__login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<Identity__LoginMutation, Identity__LoginMutationVariables>;
export const Identity__MyTenantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Identity__myTenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity__myTenants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<Identity__MyTenantsQuery, Identity__MyTenantsQueryVariables>;