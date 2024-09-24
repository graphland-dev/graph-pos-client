import { gql } from "@apollo/client";

export const Create_Product_Invoice = gql`
	mutation Inventory__createProductInvoice($input: CreateProductInvoiceInput!) {
		inventory__createProductInvoice(input: $input) {
			_id
		}
	}
`;

export const Create_Invoice_Payment = gql`
	mutation Accounting__createInventoryInvoicePayment($body: CreateInventoryInvoicePaymentInput!) {
		accounting__createInventoryInvoicePayment(body: $body) {
			_id
		}
	}
`;

export const Remove_Invoice = gql`
	mutation Remove_Invoice($where: CommonFindDocumentDto!) {
		inventory__removeProductInvoice(where: $where)
	}
`;

export const INVENTORY_INVOICE = gql`
	query Inventory__productInvoice($where: CommonFindDocumentDto!) {
		inventory__productInvoice(where: $where) {
			client {
				name
				address
			}
			products {
				name
				quantity
				netAmount
			}
			subTotal
			discountAmount
			netTotal
			paidAmount
			costAmount
		}
	}
`;
