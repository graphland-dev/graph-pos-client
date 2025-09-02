import { gql } from "@apollo/client";

export const CREATE_PRODUCT_RETURN = gql`
  mutation CreateProductReturn($input: CreateProductReturnInput!) {
    inventory__createProductReturn(input: $input) {
      _id
    }
  }
`;

export const UPDATE_PRODUCT_RETURN = gql`
  mutation UpdateProductReturn($input: UpdateProductReturnInput!) {
    inventory__updateProductReturn(input: $input) {
      _id
      status
      processedDate
      processedBy {
        name
        email
      }
      netRefundAmount
    }
  }
`;

export const GET_PRODUCT_RETURNS = gql`
  query GetProductReturns($where: CommonPaginationDto) {
    inventory__productReturns(where: $where) {
      meta {
        currentPage
        totalCount
        totalPages
        hasNextPage
      }
      nodes {
        _id
        returnUID
        status
        reason
        returnType
        totalReturnAmount
        netRefundAmount
        returnDate
        processedDate
        client {
          _id
          name
        }
        invoice {
          _id
          invoiceUID
        }
        processedBy {
          name
          email
        }
      }
    }
  }
`;

export const GET_PRODUCT_RETURN = gql`
  query GetProductReturn($where: CommonFindDocumentDto!) {
    inventory__productReturn(where: $where) {
      _id
      returnUID
      status
      reason
      returnType
      reasonDescription
      totalReturnAmount
      restockingFee
      netRefundAmount
      maxRefundableAmount
      processedRefundAmount
      customerNotes
      internalNotes
      returnDate
      processedDate
      invoice {
        _id
        invoiceUID
        netTotal
        date
        # Add return quota to get invoice-level refund availability
        returnQuota {
          availableAmountForReturn
        }
        client {
          name
          contactNumber
          email
          address
        }
      }
      returnItems {
        referenceId
        name
        code
        returnQuantity
        originalQuantity
        unitPrice
        totalReturnAmount
        condition
        itemNotes
        canRestock
        isRestocked
        restockedDate
      }
      committedBy {
        name
        email
      }
      processedBy {
        name
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INVOICE_FOR_RETURN = gql`
  query GetInvoiceForReturn($where: CommonFindDocumentDto!) {
    inventory__productInvoice(where: $where) {
      _id
      invoiceUID
      status
      netTotal
      paidAmount
      date
      client {
        _id
        name
        contactNumber
        email
        address
      }
      
      # Return Quota Information (simplified)
      returnQuota {
        invoiceTotal
        totalPaid
        totalReturned
        availableAmountForReturn
        canCreateNewReturn
        
        itemAvailability {
          referenceId
          name
          purchasedQuantity
          alreadyReturnedQuantity
          availableForReturnQuantity
          unitPrice
        }
      }
      
      products {
        referenceId
        name
        code
        quantity
        unitSellPrice
        netAmount
        taxAmount
        discountAmount
      }
    }
  }
`;

export const REMOVE_PRODUCT_RETURN = gql`
  mutation RemoveProductReturn($productReturnId: ID!) {
    inventory__removeProductReturn(productReturnId: $productReturnId)
  }
`;

export const GET_RETURN_PAYMENTS = gql`
  query GetReturnPayments($where: CommonPaginationDto) {
    accounting__returnPayments(where: $where) {
      meta {
        currentPage
        totalCount
        totalPages
        hasNextPage
      }
      nodes {
        _id
        returnPaymentUID
        totalAmount
        paymentDate
        paymentItems {
          type
          amount
          account {
            name
          }
        }
        status
        processingNotes
        reference
        productReturn {
          _id
          returnUID
        }
        createdAt
        updatedAt
        processedDate
        processedAmount
        failureReason
      }
    }
  }
`;
