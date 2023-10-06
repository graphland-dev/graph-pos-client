import { gql } from '@apollo/client';

export const INVENTORY_PRODUCT_CATEGORIES_QUERY = gql`
	query Inventory__productCategories($where: CommonPaginationDto) {
		inventory__productCategories(where: $where) {
			nodes {
				_id
				name
				code
				note
				createdAt
				updatedAt
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

export const INVENTORY_PRODUCT_CATEGORY_CREATE = gql`
	mutation Mutation($body: CreateProductCategoryInput!) {
		inventory__createProductCategory(body: $body) {
			_id
		}
	}
`;

export const INVENTORY_PRODUCT_CATEGORY_UPDATE = gql`
	mutation Inventory__updateProductCategory(
		$body: UpdateProductCategoryInput!
		$where: CommonFindDocumentDto!
	) {
		inventory__updateProductCategory(body: $body, where: $where)
	}
`;

export const INVENTORY_PRODUCT_CATEGORY_REMOVE = gql`
	mutation Inventory__removeProductCategory($where: CommonFindDocumentDto!) {
		inventory__removeProductCategory(where: $where)
	}
`;
