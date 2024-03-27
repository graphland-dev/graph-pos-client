import { gql } from '@apollo/client';

export const Create_Product_Invoice = gql`
	mutation Inventory__createProductInvoice($input: CreateProductInvoiceInput!) {
		inventory__createProductInvoice(input: $input) {
			_id
		}
	}
`;

export const Create_Invoice_Payment = gql`
	mutation Accounting__createInventoryInvoicePayment(
		$body: CreateInventoryInvoicePaymentInput!
	) {
		accounting__createInventoryInvoicePayment(body: $body) {
			_id
		}
	}
`;
