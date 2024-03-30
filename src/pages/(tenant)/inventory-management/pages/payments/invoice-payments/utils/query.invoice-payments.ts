import { gql } from "@apollo/client";

export const INVENTORY_INVOICE_PAYMENTS_QUERY = gql`
  query Accounting__inventoryInvoicePayments {
    accounting__inventoryInvoicePayments {
      nodes {
        _id
        inventoryInvoicePaymentUID
        client {
          _id
          name
        }
        netAmount
        date
      }
    }
  }
`;

export const INVENTORY_INVOICE_SINGLE_PAYMENT_QUERY = gql`
  query Accounting__InventoryInvoicePayment($where: CommonFindDocumentDto!) {
    accounting__InventoryInvoicePayment(where: $where) {
      _id
      coRelationId
      poReference
      receptNo
      reference
      tenant
      date
      inventoryInvoicePaymentUID
      netAmount
      client {
        _id
        name
        email
        address
        contactNumber
      }
      payments {
        type
        account {
          _id
          name
          referenceNumber
        }
        amount
      }
      paymentTerm
      invoice {
        _id
        invoiceUID
        paidAmount
        netTotal
        purchaseDate
      }
    }
  }
`;