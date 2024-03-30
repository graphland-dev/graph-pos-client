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
        purchaseDate
        purchaseOrderDate
        taxRate
        taxAmount
        discountPercentage
        discountAmount
        discountMode
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
          taxRate
          taxType
          taxAmount
          quantity
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
