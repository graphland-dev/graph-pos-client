/* eslint-disable */
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
  LoanPayment = 'LOAN_PAYMENT'
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
  checkNo?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  purpose: Scalars['String']['input'];
  voucherNo?: InputMaybe<Scalars['String']['input']>;
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

export type Hello = {
  __typename?: 'Hello';
  /** Example field (placeholder) */
  message: Scalars['String']['output'];
};

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
  accounting__createTransaction: CommonMutationResponse;
  accounting__removeAccount: Scalars['Boolean']['output'];
  accounting__removeExpense: Scalars['Boolean']['output'];
  accounting__removeExpenseCategory: Scalars['Boolean']['output'];
  accounting__removeTransaction: Scalars['Boolean']['output'];
  accounting__removeTransfer: Scalars['Boolean']['output'];
  accounting__updateAccount: Scalars['Boolean']['output'];
  accounting__updateExpenseCategory: Scalars['Boolean']['output'];
  accounting__updateTransaction: Scalars['Boolean']['output'];
  acounting__createTransfer: CommonMutationResponse;
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
  removeEmployee: Scalars['Boolean']['output'];
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


export type MutationRemoveEmployeeArgs = {
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

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  accounting__account: Account;
  accounting__accounts: AccountsWithPagination;
  accounting__expense: Expense;
  accounting__expenseCategory: ExpenseCategory;
  accounting__expenseCategorys: ExpenseCategorysWithPagination;
  accounting__expenses: ExpensesWithPagination;
  accounting__transaction: Transaction;
  accounting__transactions: TransactionsWithPagination;
  acounting__transfer: Transfer;
  acounting__transfers: TransfersWithPagination;
  hello: Hello;
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
}

export type UpdateAccountInput = {
  brunchName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  openedAt?: InputMaybe<Scalars['DateTime']['input']>;
  referenceNumber?: InputMaybe<Scalars['String']['input']>;
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
