import { gql } from '@apollo/client';

export const INVENTORY_PRODUCTS_LIST_QUERY = gql`
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
export const INVENTORY_PRODUCT_QUERY = gql`
	query Inventory__product($where: CommonFindDocumentDto!) {
		inventory__product(where: $where) {
			_id
			name
			stockInQuantity
			stockOutQuantity
			code
			modelName
			price
			discountPercentage
			discountAmount
			discountMode
			note
			createdAt
			updatedAt
			category {
				_id
				name
				code
				note
				createdAt
				updatedAt
			}
			brand {
				_id
				name
				code
				note
				createdAt
				updatedAt
			}
			unit {
				_id
				name
				code
				note
				createdAt
				updatedAt
			}
			vat {
				_id
				name
				code
				note
				createdAt
				updatedAt
			}
		}
	}
`;

export const INVENTORY_PRODUCT_CREATE = gql`
	mutation Inventory__createProduct($body: CreateProductInput!) {
		inventory__createProduct(body: $body) {
			_id
		}
	}
`;

export const INVENTORY_PRODUCT_UPDATE = gql`
	mutation Inventory__removeProduct(
		$body: UpdateProductInput!
		$where: CommonFindDocumentDto!
	) {
		inventory__updateProduct(body: $body, where: $where)
	}
`;
export const INVENTORY_PRODUCT_REMOVE = gql`
	mutation Inventory__removeProduct($where: CommonFindDocumentDto!) {
		inventory__removeProduct(where: $where)
	}
`;
