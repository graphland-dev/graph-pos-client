import { gql } from "@apollo/client";

export const INVENTORY_PRODUCT_INVOICES_QUERY = gql`
  query Inventory__productInvoices($where: CommonPaginationDto) {
    inventory__productInvoices(where: $where) {
      meta {
        currentPage
        hasNextPage
        totalCount
        totalPages
      }
      nodes {
        _id
        tenant
        invoiceUID
        paymentStatus
        lifecycleStatus
        client {
          address
          contactNumber
          email
          name
          tenant
          attachments {
            meta
            path
            provider
          }
        }
        date
        netTaxAmount
        netSubtotalDiscount
        invoiceDiscountAmount
        invoiceDiscountMode
        invoiceDiscountPercentage
        netDiscountAmount
        subTotal
        costAmount
        netTotal
        paidAmount
        netSellPrice
        netProfit
        note
        source
        createdAt
        updatedAt
        committedBy {
          email
          name
          referenceId
        }
        products {
          referenceId
          name
          code
          unitPrice
          unitSellPrice
          taxRate
          taxAmount
          quantity
          unitPurchasePrice
          netSellPrice
          netPurchaseAmount
          netProfit
          discountAmount
          netSubtotal
          netAmount
        }
        client {
          _id
          name
          email
          createdAt
          tenant
        }
      }
    }
  }
`;

export const ACCOUNT_INVENTORY_INVOICE_PAYMENTS_QUERY = gql`
  query Accounting__inventoryInvoicePayments($where: CommonPaginationDto) {
    accounting__inventoryInvoicePayments(where: $where) {
      nodes {
        _id
        inventoryInvoicePaymentUID
        date
        tenant
        client {
          _id
          name
        }
        netAmount
      }
    }
  }
`;

export const INVENTORY_PRODUCT_INVOICE_QUERY = gql`
  query Inventory__productInvoice($where: CommonFindDocumentDto!) {
    inventory__productInvoice(where: $where) {
      _id
      tenant
      invoiceUID
      paymentStatus
      lifecycleStatus
      client {
        _id
        address
        contactNumber
        email
        name
        tenant
        attachments {
          meta
          path
          provider
        }
      }
      date
      netTaxAmount
      netSellPrice
      netSubtotalDiscount
      invoiceDiscountAmount
      invoiceDiscountMode
      invoiceDiscountPercentage
      netDiscountAmount
      subTotal
      costAmount
      netTotal
      paidAmount
      note
      source
      createdAt
      updatedAt
      committedBy {
        email
        name
        referenceId
      }
      products {
        referenceId
        name
        code
        unitPrice
        unitSellPrice
        taxRate
        taxAmount
        quantity
        unitPurchasePrice
        netSellPrice
        netPurchaseAmount
        netProfit
        discountAmount
        netSubtotal
        netAmount
      }
    }
  }
`;

export const CREATE_PRODUCT_INVOICE_MUTATION = gql`
  mutation Inventory__createProductInvoice($input: CreateProductInvoiceInput!) {
    inventory__createProductInvoice(input: $input) {
      _id
    }
  }
`;

export const UPDATE_PRODUCT_INVOICE_MUTATION = gql`
  mutation Inventory__updateProductInvoice($invoiceId: String!, $input: UpdateProductInvoiceInput!) {
    inventory__updateProductInvoice(invoiceId: $invoiceId, input: $input) {
      _id
    }
  }
`;

export const DELETE_PRODUCT_INVOICE_MUTATION = gql`
  mutation Inventory__removeProductInvoice($where: CommonFindDocumentDto!) {
    inventory__removeProductInvoice(where: $where)
  }
`;

