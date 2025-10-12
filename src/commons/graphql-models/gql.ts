/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query Inventory__productInvoice($where: CommonFindDocumentDto!) {\n    inventory__productInvoice(where: $where) {\n      _id\n      tenant\n      invoiceUID\n      paymentStatus\n      lifecycleStatus\n      client {\n        address\n        contactNumber\n        email\n        name\n        tenant\n        attachments {\n          meta\n          path\n          provider\n        }\n      }\n      date\n      netTaxAmount\n      netSellPrice\n      netSubtotalDiscount\n      invoiceDiscountAmount\n      invoiceDiscountMode\n      invoiceDiscountPercentage\n      netDiscountAmount\n      subTotal\n      costAmount\n      netTotal\n      paidAmount\n      note\n      source\n      createdAt\n      updatedAt\n      committedBy {\n        email\n        name\n        referenceId\n      }\n      products {\n        referenceId\n        name\n        code\n        unitPrice\n        unitSellPrice\n        taxRate\n        taxAmount\n        quantity\n        unitPurchasePrice\n        netSellPrice\n        netPurchaseAmount\n        netProfit\n        discountAmount\n        netSubtotal\n        netAmount\n      }\n      client {\n        _id\n        name\n        email\n        createdAt\n        tenant\n      }\n    }\n  }\n": types.Inventory__ProductInvoiceDocument,
    "\n  query Identity__tenant($tenant: String!) {\n    identity__tenant(tenant: $tenant) {\n      _id\n      name\n      logo {\n        path\n        provider\n      }\n      address\n      businessPhoneNumber\n      description\n      uid\n      subscriptionType\n      allowedCollections\n      createdAt\n      updatedAt\n    }\n  }\n": types.Identity__TenantDocument,
    "\n  query ROOT_QUERY {\n    identity__me {\n      _id\n      email\n      name\n      memberships {\n        tenant\n        roles\n      }\n      avatar {\n        meta\n        path\n        provider\n      }\n    }\n    #    identity__myPermissions(tenant: $tenant) {\n    #      collectionName\n    #      actions\n    #    }\n\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        address\n        businessPhoneNumber\n        description\n        createdAt\n        logo {\n          meta\n          path\n          provider\n        }\n      }\n    }\n  }\n": types.Root_QueryDocument,
    "\n  query Accounts($where: CommonPaginationDto) {\n    accounting__accounts(where: $where) {\n      meta {\n        totalCount\n      }\n      nodes {\n        _id\n        name\n        referenceNumber\n        brunchName\n        openedAt\n        note\n        isActive\n        creditAmount\n        debitAmount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.AccountsDocument,
    "\n  mutation Accounting__createInventoryInvoicePayment(\n    $body: CreateInventoryInvoicePaymentInput!\n  ) {\n    accounting__createInventoryInvoicePayment(body: $body) {\n      _id\n    }\n  }\n": types.Accounting__CreateInventoryInvoicePaymentDocument,
    "\n  query Inventory__productInvoiceDetails($where: CommonFindDocumentDto!) {\n    inventory__productInvoice(where: $where) {\n      _id\n      tenant\n      invoiceUID\n      paymentStatus\n      lifecycleStatus\n      client {\n        address\n        contactNumber\n        email\n        name\n        tenant\n        attachments {\n          meta\n          path\n          provider\n        }\n      }\n      date\n      netTaxAmount\n      netSellPrice\n      netSubtotalDiscount\n      invoiceDiscountAmount\n      invoiceDiscountMode\n      invoiceDiscountPercentage\n      netDiscountAmount\n      subTotal\n      costAmount\n      netTotal\n      paidAmount\n      note\n      source\n      createdAt\n      updatedAt\n      committedBy {\n        email\n        name\n        referenceId\n      }\n      products {\n        referenceId\n        name\n        code\n        unitPrice\n        unitSellPrice\n        taxRate\n        taxAmount\n        quantity\n        unitPurchasePrice\n        netSellPrice\n        netPurchaseAmount\n        netProfit\n        discountAmount\n        netSubtotal\n        netAmount\n      }\n      client {\n        _id\n        name\n        email\n        createdAt\n        tenant\n      }\n    }\n  }\n": types.Inventory__ProductInvoiceDetailsDocument,
    "\n  query InvoiceReturns($where: CommonPaginationDto) {\n    inventory__productReturns(where: $where) {\n      meta {\n        totalCount\n      }\n      nodes {\n        _id\n        returnUID\n        status\n        reason\n        returnType\n        totalReturnAmount\n        netRefundAmount\n        processedRefundAmount\n        returnDate\n      }\n    }\n  }\n": types.InvoiceReturnsDocument,
    "\n  query InvoicesList__clients($where: CommonPaginationDto) {\n    people__clients(where: $where) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n": types.InvoicesList__ClientsDocument,
    "\n  query PurchasePaymentActiveAccounts($where: CommonPaginationDto) {\n    accounting__accounts(where: $where) {\n      nodes {\n        _id\n        name\n        referenceNumber\n        creditAmount\n        debitAmount\n        isActive\n      }\n    }\n  }\n": types.PurchasePaymentActiveAccountsDocument,
    "\n  query InvoicePaymentsClients {\n    people__clients {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n": types.InvoicePaymentsClientsDocument,
    "\n  query InvoicePaymentsFiltered($where: CommonPaginationDto) {\n    accounting__inventoryInvoicePayments(where: $where) {\n      nodes {\n        _id\n        inventoryInvoicePaymentUID\n        client {\n          _id\n          name\n        }\n        netAmount\n        date\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n": types.InvoicePaymentsFilteredDocument,
    "\n  query PurchasePayments__accounts($where: CommonPaginationDto) {\n    accounting__accounts(where: $where) {\n      nodes {\n        _id\n        name\n        referenceNumber\n      }\n    }\n  }\n": types.PurchasePayments__AccountsDocument,
    "\n  query PurchasePayments__suppliers($where: CommonPaginationDto) {\n    people__suppliers(where: $where) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n": types.PurchasePayments__SuppliersDocument,
    "\n  query CreateProductCategoriesQuery {\n    inventory__rootCategoriesWithChildren {\n      _id\n      name\n      level\n      path\n      children {\n        _id\n        name\n        level\n        path\n        children {\n          _id\n          name\n          level\n          path\n          children {\n            _id\n            name\n            level\n            path\n          }\n        }\n      }\n    }\n  }\n": types.CreateProductCategoriesQueryDocument,
    "\n  query CreateProductBrandsQuery {\n    setup__brands {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n": types.CreateProductBrandsQueryDocument,
    "\n  query CreatePurchase__suppliers($where: CommonPaginationDto) {\n    people__suppliers(where: $where) {\n      meta {\n        hasNextPage\n        totalCount\n      }\n      nodes {\n        _id\n        name\n        companyName\n        contactNumber\n        email\n        address\n      }\n    }\n  }\n": types.CreatePurchase__SuppliersDocument,
    "\n  query CreatePurchase__categories {\n    inventory__rootCategoriesWithChildren {\n      _id\n      name\n      children {\n        _id\n        name\n        children {\n          _id\n          name\n        }\n      }\n    }\n  }\n": types.CreatePurchase__CategoriesDocument,
    "\n  query CreatePurchase__brands {\n    setup__brands(where: { limit: -1 }) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n": types.CreatePurchase__BrandsDocument,
    "\n  query PurchaseList__suppliers($where: CommonPaginationDto) {\n    people__suppliers(where: $where) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n": types.PurchaseList__SuppliersDocument,
    "\n  mutation Accounting__createReturnPayment($input: CreateReturnPaymentInput!) {\n    accounting__createReturnPayment(input: $input) {\n      _id\n    }\n  }\n": types.Accounting__CreateReturnPaymentDocument,
    "\n  query BrandsFiltered($where: CommonPaginationDto) {\n    setup__brands(where: $where) {\n      nodes {\n        _id\n        name\n        code\n        note\n        createdAt\n        updatedAt\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n": types.BrandsFilteredDocument,
    "\n   query Setup__brands {\n  setup__brands {\n    meta {\n      totalCount\n    }\n    nodes {\n      _id\n      code\n      createdAt\n      name\n      note\n      updatedAt\n    }\n  }\n}\n\n": types.Setup__BrandsDocument,
    "\n    mutation Setup__createBrand($body: CreateBrandInput!) {\n  setup__createBrand(body: $body) {\n    _id\n  }\n}\n": types.Setup__CreateBrandDocument,
    "\nmutation Setup__updateBrand($where: CommonFindDocumentDto!, $body: UpdateBrandInput!) {\n  setup__updateBrand(where: $where, body: $body)\n}\n\n": types.Setup__UpdateBrandDocument,
    "\nmutation Setup__removeBrand($where: CommonFindDocumentDto!) {\n  setup__removeBrand(where: $where)\n}\n\n": types.Setup__RemoveBrandDocument,
    "\n  query UnitsFiltered($where: CommonPaginationDto) {\n    setup__units(where: $where) {\n      nodes {\n        _id\n        name\n        code\n        note\n        createdAt\n        updatedAt\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n": types.UnitsFilteredDocument,
    "\n  query VatProfilesFiltered($where: CommonPaginationDto) {\n    setup__vats(where: $where) {\n      nodes {\n        _id\n        code\n        name\n        note\n        percentage\n        createdAt\n        updatedAt\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n": types.VatProfilesFilteredDocument,
    "\n  query SharedCategoryPicker__categories {\n    inventory__rootCategoriesWithChildren {\n      _id\n      name\n      level\n      path\n      children {\n        _id\n        name\n        level\n        path\n        children {\n          _id\n          name\n          level\n          path\n          children {\n            _id\n            name\n            level\n            path\n            children {\n              _id\n              name\n              level\n              path\n            }\n          }\n        }\n      }\n    }\n  }\n": types.SharedCategoryPicker__CategoriesDocument,
    "\n  query GetClient($where: CommonFindDocumentDto!) {\n    people__client(where: $where) {\n      _id\n      name\n      contactNumber\n      email\n      address\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetClientDocument,
    "\n  query GetProduct($where: CommonFindDocumentDto!) {\n    inventory__product(where: $where) {\n      _id\n      name\n      code\n      currentStockQuantity\n      isSellableWithoutStock\n      price\n      purchasePrice\n    }\n  }\n": types.GetProductDocument,
    "\n  mutation Identity__forgotPassword($input: ForgotPasswordInput!) {\n    identity__forgotPassword(input: $input)\n  }\n": types.Identity__ForgotPasswordDocument,
    "\n  mutation Identity__login($input: LoginInput!) {\n    identity__login(input: $input) {\n      accessToken\n    }\n  }\n": types.Identity__LoginDocument,
    "\n  mutation Identity__resetPassword($input: ResetPasswordInput!) {\n    identity__resetPassword(input: $input)\n  }\n": types.Identity__ResetPasswordDocument,
    "\n  query Identity__myTenants {\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        createdAt\n        logo {\n          meta\n          path\n          provider\n        }\n      }\n    }\n  }\n": types.Identity__MyTenantsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Inventory__productInvoice($where: CommonFindDocumentDto!) {\n    inventory__productInvoice(where: $where) {\n      _id\n      tenant\n      invoiceUID\n      paymentStatus\n      lifecycleStatus\n      client {\n        address\n        contactNumber\n        email\n        name\n        tenant\n        attachments {\n          meta\n          path\n          provider\n        }\n      }\n      date\n      netTaxAmount\n      netSellPrice\n      netSubtotalDiscount\n      invoiceDiscountAmount\n      invoiceDiscountMode\n      invoiceDiscountPercentage\n      netDiscountAmount\n      subTotal\n      costAmount\n      netTotal\n      paidAmount\n      note\n      source\n      createdAt\n      updatedAt\n      committedBy {\n        email\n        name\n        referenceId\n      }\n      products {\n        referenceId\n        name\n        code\n        unitPrice\n        unitSellPrice\n        taxRate\n        taxAmount\n        quantity\n        unitPurchasePrice\n        netSellPrice\n        netPurchaseAmount\n        netProfit\n        discountAmount\n        netSubtotal\n        netAmount\n      }\n      client {\n        _id\n        name\n        email\n        createdAt\n        tenant\n      }\n    }\n  }\n"): (typeof documents)["\n  query Inventory__productInvoice($where: CommonFindDocumentDto!) {\n    inventory__productInvoice(where: $where) {\n      _id\n      tenant\n      invoiceUID\n      paymentStatus\n      lifecycleStatus\n      client {\n        address\n        contactNumber\n        email\n        name\n        tenant\n        attachments {\n          meta\n          path\n          provider\n        }\n      }\n      date\n      netTaxAmount\n      netSellPrice\n      netSubtotalDiscount\n      invoiceDiscountAmount\n      invoiceDiscountMode\n      invoiceDiscountPercentage\n      netDiscountAmount\n      subTotal\n      costAmount\n      netTotal\n      paidAmount\n      note\n      source\n      createdAt\n      updatedAt\n      committedBy {\n        email\n        name\n        referenceId\n      }\n      products {\n        referenceId\n        name\n        code\n        unitPrice\n        unitSellPrice\n        taxRate\n        taxAmount\n        quantity\n        unitPurchasePrice\n        netSellPrice\n        netPurchaseAmount\n        netProfit\n        discountAmount\n        netSubtotal\n        netAmount\n      }\n      client {\n        _id\n        name\n        email\n        createdAt\n        tenant\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Identity__tenant($tenant: String!) {\n    identity__tenant(tenant: $tenant) {\n      _id\n      name\n      logo {\n        path\n        provider\n      }\n      address\n      businessPhoneNumber\n      description\n      uid\n      subscriptionType\n      allowedCollections\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query Identity__tenant($tenant: String!) {\n    identity__tenant(tenant: $tenant) {\n      _id\n      name\n      logo {\n        path\n        provider\n      }\n      address\n      businessPhoneNumber\n      description\n      uid\n      subscriptionType\n      allowedCollections\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ROOT_QUERY {\n    identity__me {\n      _id\n      email\n      name\n      memberships {\n        tenant\n        roles\n      }\n      avatar {\n        meta\n        path\n        provider\n      }\n    }\n    #    identity__myPermissions(tenant: $tenant) {\n    #      collectionName\n    #      actions\n    #    }\n\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        address\n        businessPhoneNumber\n        description\n        createdAt\n        logo {\n          meta\n          path\n          provider\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ROOT_QUERY {\n    identity__me {\n      _id\n      email\n      name\n      memberships {\n        tenant\n        roles\n      }\n      avatar {\n        meta\n        path\n        provider\n      }\n    }\n    #    identity__myPermissions(tenant: $tenant) {\n    #      collectionName\n    #      actions\n    #    }\n\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        address\n        businessPhoneNumber\n        description\n        createdAt\n        logo {\n          meta\n          path\n          provider\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Accounts($where: CommonPaginationDto) {\n    accounting__accounts(where: $where) {\n      meta {\n        totalCount\n      }\n      nodes {\n        _id\n        name\n        referenceNumber\n        brunchName\n        openedAt\n        note\n        isActive\n        creditAmount\n        debitAmount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query Accounts($where: CommonPaginationDto) {\n    accounting__accounts(where: $where) {\n      meta {\n        totalCount\n      }\n      nodes {\n        _id\n        name\n        referenceNumber\n        brunchName\n        openedAt\n        note\n        isActive\n        creditAmount\n        debitAmount\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Accounting__createInventoryInvoicePayment(\n    $body: CreateInventoryInvoicePaymentInput!\n  ) {\n    accounting__createInventoryInvoicePayment(body: $body) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation Accounting__createInventoryInvoicePayment(\n    $body: CreateInventoryInvoicePaymentInput!\n  ) {\n    accounting__createInventoryInvoicePayment(body: $body) {\n      _id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Inventory__productInvoiceDetails($where: CommonFindDocumentDto!) {\n    inventory__productInvoice(where: $where) {\n      _id\n      tenant\n      invoiceUID\n      paymentStatus\n      lifecycleStatus\n      client {\n        address\n        contactNumber\n        email\n        name\n        tenant\n        attachments {\n          meta\n          path\n          provider\n        }\n      }\n      date\n      netTaxAmount\n      netSellPrice\n      netSubtotalDiscount\n      invoiceDiscountAmount\n      invoiceDiscountMode\n      invoiceDiscountPercentage\n      netDiscountAmount\n      subTotal\n      costAmount\n      netTotal\n      paidAmount\n      note\n      source\n      createdAt\n      updatedAt\n      committedBy {\n        email\n        name\n        referenceId\n      }\n      products {\n        referenceId\n        name\n        code\n        unitPrice\n        unitSellPrice\n        taxRate\n        taxAmount\n        quantity\n        unitPurchasePrice\n        netSellPrice\n        netPurchaseAmount\n        netProfit\n        discountAmount\n        netSubtotal\n        netAmount\n      }\n      client {\n        _id\n        name\n        email\n        createdAt\n        tenant\n      }\n    }\n  }\n"): (typeof documents)["\n  query Inventory__productInvoiceDetails($where: CommonFindDocumentDto!) {\n    inventory__productInvoice(where: $where) {\n      _id\n      tenant\n      invoiceUID\n      paymentStatus\n      lifecycleStatus\n      client {\n        address\n        contactNumber\n        email\n        name\n        tenant\n        attachments {\n          meta\n          path\n          provider\n        }\n      }\n      date\n      netTaxAmount\n      netSellPrice\n      netSubtotalDiscount\n      invoiceDiscountAmount\n      invoiceDiscountMode\n      invoiceDiscountPercentage\n      netDiscountAmount\n      subTotal\n      costAmount\n      netTotal\n      paidAmount\n      note\n      source\n      createdAt\n      updatedAt\n      committedBy {\n        email\n        name\n        referenceId\n      }\n      products {\n        referenceId\n        name\n        code\n        unitPrice\n        unitSellPrice\n        taxRate\n        taxAmount\n        quantity\n        unitPurchasePrice\n        netSellPrice\n        netPurchaseAmount\n        netProfit\n        discountAmount\n        netSubtotal\n        netAmount\n      }\n      client {\n        _id\n        name\n        email\n        createdAt\n        tenant\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query InvoiceReturns($where: CommonPaginationDto) {\n    inventory__productReturns(where: $where) {\n      meta {\n        totalCount\n      }\n      nodes {\n        _id\n        returnUID\n        status\n        reason\n        returnType\n        totalReturnAmount\n        netRefundAmount\n        processedRefundAmount\n        returnDate\n      }\n    }\n  }\n"): (typeof documents)["\n  query InvoiceReturns($where: CommonPaginationDto) {\n    inventory__productReturns(where: $where) {\n      meta {\n        totalCount\n      }\n      nodes {\n        _id\n        returnUID\n        status\n        reason\n        returnType\n        totalReturnAmount\n        netRefundAmount\n        processedRefundAmount\n        returnDate\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query InvoicesList__clients($where: CommonPaginationDto) {\n    people__clients(where: $where) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query InvoicesList__clients($where: CommonPaginationDto) {\n    people__clients(where: $where) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PurchasePaymentActiveAccounts($where: CommonPaginationDto) {\n    accounting__accounts(where: $where) {\n      nodes {\n        _id\n        name\n        referenceNumber\n        creditAmount\n        debitAmount\n        isActive\n      }\n    }\n  }\n"): (typeof documents)["\n  query PurchasePaymentActiveAccounts($where: CommonPaginationDto) {\n    accounting__accounts(where: $where) {\n      nodes {\n        _id\n        name\n        referenceNumber\n        creditAmount\n        debitAmount\n        isActive\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query InvoicePaymentsClients {\n    people__clients {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query InvoicePaymentsClients {\n    people__clients {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query InvoicePaymentsFiltered($where: CommonPaginationDto) {\n    accounting__inventoryInvoicePayments(where: $where) {\n      nodes {\n        _id\n        inventoryInvoicePaymentUID\n        client {\n          _id\n          name\n        }\n        netAmount\n        date\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n"): (typeof documents)["\n  query InvoicePaymentsFiltered($where: CommonPaginationDto) {\n    accounting__inventoryInvoicePayments(where: $where) {\n      nodes {\n        _id\n        inventoryInvoicePaymentUID\n        client {\n          _id\n          name\n        }\n        netAmount\n        date\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PurchasePayments__accounts($where: CommonPaginationDto) {\n    accounting__accounts(where: $where) {\n      nodes {\n        _id\n        name\n        referenceNumber\n      }\n    }\n  }\n"): (typeof documents)["\n  query PurchasePayments__accounts($where: CommonPaginationDto) {\n    accounting__accounts(where: $where) {\n      nodes {\n        _id\n        name\n        referenceNumber\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PurchasePayments__suppliers($where: CommonPaginationDto) {\n    people__suppliers(where: $where) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query PurchasePayments__suppliers($where: CommonPaginationDto) {\n    people__suppliers(where: $where) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CreateProductCategoriesQuery {\n    inventory__rootCategoriesWithChildren {\n      _id\n      name\n      level\n      path\n      children {\n        _id\n        name\n        level\n        path\n        children {\n          _id\n          name\n          level\n          path\n          children {\n            _id\n            name\n            level\n            path\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CreateProductCategoriesQuery {\n    inventory__rootCategoriesWithChildren {\n      _id\n      name\n      level\n      path\n      children {\n        _id\n        name\n        level\n        path\n        children {\n          _id\n          name\n          level\n          path\n          children {\n            _id\n            name\n            level\n            path\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CreateProductBrandsQuery {\n    setup__brands {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query CreateProductBrandsQuery {\n    setup__brands {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CreatePurchase__suppliers($where: CommonPaginationDto) {\n    people__suppliers(where: $where) {\n      meta {\n        hasNextPage\n        totalCount\n      }\n      nodes {\n        _id\n        name\n        companyName\n        contactNumber\n        email\n        address\n      }\n    }\n  }\n"): (typeof documents)["\n  query CreatePurchase__suppliers($where: CommonPaginationDto) {\n    people__suppliers(where: $where) {\n      meta {\n        hasNextPage\n        totalCount\n      }\n      nodes {\n        _id\n        name\n        companyName\n        contactNumber\n        email\n        address\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CreatePurchase__categories {\n    inventory__rootCategoriesWithChildren {\n      _id\n      name\n      children {\n        _id\n        name\n        children {\n          _id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CreatePurchase__categories {\n    inventory__rootCategoriesWithChildren {\n      _id\n      name\n      children {\n        _id\n        name\n        children {\n          _id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CreatePurchase__brands {\n    setup__brands(where: { limit: -1 }) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query CreatePurchase__brands {\n    setup__brands(where: { limit: -1 }) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PurchaseList__suppliers($where: CommonPaginationDto) {\n    people__suppliers(where: $where) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query PurchaseList__suppliers($where: CommonPaginationDto) {\n    people__suppliers(where: $where) {\n      nodes {\n        _id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Accounting__createReturnPayment($input: CreateReturnPaymentInput!) {\n    accounting__createReturnPayment(input: $input) {\n      _id\n    }\n  }\n"): (typeof documents)["\n  mutation Accounting__createReturnPayment($input: CreateReturnPaymentInput!) {\n    accounting__createReturnPayment(input: $input) {\n      _id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BrandsFiltered($where: CommonPaginationDto) {\n    setup__brands(where: $where) {\n      nodes {\n        _id\n        name\n        code\n        note\n        createdAt\n        updatedAt\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n"): (typeof documents)["\n  query BrandsFiltered($where: CommonPaginationDto) {\n    setup__brands(where: $where) {\n      nodes {\n        _id\n        name\n        code\n        note\n        createdAt\n        updatedAt\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n   query Setup__brands {\n  setup__brands {\n    meta {\n      totalCount\n    }\n    nodes {\n      _id\n      code\n      createdAt\n      name\n      note\n      updatedAt\n    }\n  }\n}\n\n"): (typeof documents)["\n   query Setup__brands {\n  setup__brands {\n    meta {\n      totalCount\n    }\n    nodes {\n      _id\n      code\n      createdAt\n      name\n      note\n      updatedAt\n    }\n  }\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Setup__createBrand($body: CreateBrandInput!) {\n  setup__createBrand(body: $body) {\n    _id\n  }\n}\n"): (typeof documents)["\n    mutation Setup__createBrand($body: CreateBrandInput!) {\n  setup__createBrand(body: $body) {\n    _id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Setup__updateBrand($where: CommonFindDocumentDto!, $body: UpdateBrandInput!) {\n  setup__updateBrand(where: $where, body: $body)\n}\n\n"): (typeof documents)["\nmutation Setup__updateBrand($where: CommonFindDocumentDto!, $body: UpdateBrandInput!) {\n  setup__updateBrand(where: $where, body: $body)\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Setup__removeBrand($where: CommonFindDocumentDto!) {\n  setup__removeBrand(where: $where)\n}\n\n"): (typeof documents)["\nmutation Setup__removeBrand($where: CommonFindDocumentDto!) {\n  setup__removeBrand(where: $where)\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UnitsFiltered($where: CommonPaginationDto) {\n    setup__units(where: $where) {\n      nodes {\n        _id\n        name\n        code\n        note\n        createdAt\n        updatedAt\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n"): (typeof documents)["\n  query UnitsFiltered($where: CommonPaginationDto) {\n    setup__units(where: $where) {\n      nodes {\n        _id\n        name\n        code\n        note\n        createdAt\n        updatedAt\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VatProfilesFiltered($where: CommonPaginationDto) {\n    setup__vats(where: $where) {\n      nodes {\n        _id\n        code\n        name\n        note\n        percentage\n        createdAt\n        updatedAt\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n"): (typeof documents)["\n  query VatProfilesFiltered($where: CommonPaginationDto) {\n    setup__vats(where: $where) {\n      nodes {\n        _id\n        code\n        name\n        note\n        percentage\n        createdAt\n        updatedAt\n      }\n      meta {\n        totalCount\n        currentPage\n        hasNextPage\n        totalPages\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SharedCategoryPicker__categories {\n    inventory__rootCategoriesWithChildren {\n      _id\n      name\n      level\n      path\n      children {\n        _id\n        name\n        level\n        path\n        children {\n          _id\n          name\n          level\n          path\n          children {\n            _id\n            name\n            level\n            path\n            children {\n              _id\n              name\n              level\n              path\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query SharedCategoryPicker__categories {\n    inventory__rootCategoriesWithChildren {\n      _id\n      name\n      level\n      path\n      children {\n        _id\n        name\n        level\n        path\n        children {\n          _id\n          name\n          level\n          path\n          children {\n            _id\n            name\n            level\n            path\n            children {\n              _id\n              name\n              level\n              path\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetClient($where: CommonFindDocumentDto!) {\n    people__client(where: $where) {\n      _id\n      name\n      contactNumber\n      email\n      address\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetClient($where: CommonFindDocumentDto!) {\n    people__client(where: $where) {\n      _id\n      name\n      contactNumber\n      email\n      address\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProduct($where: CommonFindDocumentDto!) {\n    inventory__product(where: $where) {\n      _id\n      name\n      code\n      currentStockQuantity\n      isSellableWithoutStock\n      price\n      purchasePrice\n    }\n  }\n"): (typeof documents)["\n  query GetProduct($where: CommonFindDocumentDto!) {\n    inventory__product(where: $where) {\n      _id\n      name\n      code\n      currentStockQuantity\n      isSellableWithoutStock\n      price\n      purchasePrice\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Identity__forgotPassword($input: ForgotPasswordInput!) {\n    identity__forgotPassword(input: $input)\n  }\n"): (typeof documents)["\n  mutation Identity__forgotPassword($input: ForgotPasswordInput!) {\n    identity__forgotPassword(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Identity__login($input: LoginInput!) {\n    identity__login(input: $input) {\n      accessToken\n    }\n  }\n"): (typeof documents)["\n  mutation Identity__login($input: LoginInput!) {\n    identity__login(input: $input) {\n      accessToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Identity__resetPassword($input: ResetPasswordInput!) {\n    identity__resetPassword(input: $input)\n  }\n"): (typeof documents)["\n  mutation Identity__resetPassword($input: ResetPasswordInput!) {\n    identity__resetPassword(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Identity__myTenants {\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        createdAt\n        logo {\n          meta\n          path\n          provider\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Identity__myTenants {\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        createdAt\n        logo {\n          meta\n          path\n          provider\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;