import { gql } from "@apollo/client";

export const INVENTORY_PRODUCT_QUOTATIONS_QUERY = gql`
  query Inventory__productQuotations($where: CommonPaginationDto) {
    inventory__productQuotations(where: $where) {
      meta {
        currentPage
        hasNextPage
        totalCount
        totalPages
      }
      nodes {
        _id
        tenant
        quotationUID
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
        validUntil
        netTaxAmount
        netSubtotalDiscount
        quotationDiscountAmount
        quotationDiscountMode
        quotationDiscountPercentage
        netDiscountAmount
        subTotal
        costAmount
        netTotal
        note
        terms
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

export const INVENTORY_PRODUCT_QUOTATION_QUERY = gql`
  query Inventory__productQuotation($where: CommonFindDocumentDto!) {
    inventory__productQuotation(where: $where) {
      _id
      tenant
      quotationUID
      status
      convertedInvoiceUid
      convertedInvoiceId
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
      validUntil
      netTaxAmount
      netSellPrice
      netSubtotalDiscount
      quotationDiscountAmount
      quotationDiscountMode
      quotationDiscountPercentage
      netDiscountAmount
      subTotal
      costAmount
      netTotal
      note
      terms
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
`;

export const CREATE_PRODUCT_QUOTATION_MUTATION = gql`
  mutation Inventory__createProductQuotation(
    $input: CreateProductQuotationInput!
  ) {
    inventory__createProductQuotation(input: $input) {
      _id
    }
  }
`;

export const UPDATE_PRODUCT_QUOTATION_MUTATION = gql`
  mutation Inventory__updateProductQuotation(
    $quotationId: String!
    $input: UpdateProductQuotationInput!
  ) {
    inventory__updateProductQuotation(
      quotationId: $quotationId
      input: $input
    ) {
      _id
    }
  }
`;

export const UPDATE_QUOTATION_STATUS_MUTATION = gql`
  mutation Inventory__updateQuotationStatus(
    $where: CommonFindDocumentDto!
    $body: UpdateQuotationStatusInput!
  ) {
    inventory__updateQuotationStatus(where: $where, body: $body)
  }
`;

export const CONVERT_QUOTATION_TO_INVOICE_MUTATION = gql`
  mutation Inventory__convertQuotationToInvoice($quotationId: String!) {
    inventory__convertQuotationToInvoice(quotationId: $quotationId) {
      _id
    }
  }
`;
