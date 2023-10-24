import { gql } from '@apollo/client';

export const PURCHASE_PRODUCT_LIST = gql`
	query Query($where: CommonPaginationDto) {
		inventory__products(where: $where) {
			nodes {
				_id
				name
				code
				category {
					_id
					name
				}
				vat {
					_id
					percentage
				}
				stockInQuantity
				stockOutQuantity
				price
			}
			meta {
				totalCount
				currentPage
				hasNextPage
				totalPages
			}
		}
	}
`;

export const CREATE_INVENTORY_PRODUCT_PURCHASE = gql`
	mutation Inventory__createProductPurchase(
		$body: CreateProductPurchaseInput!
	) {
		inventory__createProductPurchase(body: $body) {
			_id
		}
	}
`;

export const PURCHASE__PRODUCT_CREATE = gql`
	mutation Inventory__createProduct($body: CreateProductInput!) {
		inventory__createProduct(body: $body) {
			_id
		}
	}
`;

export const PURCHASE__SUPPLIER_CREATE = gql`
	mutation Mutation($body: CreateSupplierInput!) {
		people__createSupplier(body: $body) {
			_id
		}
	}
`;
