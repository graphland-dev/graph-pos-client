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
        status
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
        client {
          _id
          name
        }
        netAmount
      }
    }
  }
`;
