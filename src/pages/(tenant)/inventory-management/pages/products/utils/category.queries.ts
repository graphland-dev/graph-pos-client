import { gql } from '@apollo/client';

// Basic category queries (existing functionality)
export const INVENTORY_PRODUCT_CATEGORIES_QUERY = gql`
	query Inventory__productCategories($where: CommonPaginationDto) {
		inventory__productCategories(where: $where) {
			nodes {
				_id
				name
				code
				note
				level
				path
				parentCategory
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

// Hierarchical category queries (new functionality)
export const GET_ROOT_CATEGORIES_QUERY = gql`
	query GetRootCategories {
		inventory__rootCategories {
			_id
			name
			code
			level
			path
			parentCategory
		}
	}
`;

export const GET_ROOT_CATEGORIES_WITH_CHILDREN_QUERY = gql`
	query GetRootCategoriesWithChildren {
		inventory__rootCategoriesWithChildren {
			_id
			name
			code
			level
			path
			children {
				_id
				name
				code
				level
				path
				children {
					_id
					name
					code
					level
					path
					children {
						_id
						name
						code
						level
						path
					}
				}
			}
		}
	}
`;

export const GET_CATEGORY_CHILDREN_QUERY = gql`
	query GetCategoryChildren($categoryId: ID!) {
		inventory__categoryChildren(categoryId: $categoryId) {
			_id
			name
			code
			level
			path
		}
	}
`;

export const GET_CATEGORY_DESCENDANTS_QUERY = gql`
	query GetCategoryDescendants($categoryId: ID!) {
		inventory__categoryDescendants(categoryId: $categoryId) {
			_id
			name
			code
			level
			path
		}
	}
`;

export const GET_CATEGORY_TREE_QUERY = gql`
	query GetCategoryTree($rootCategoryId: ID) {
		inventory__categoryTree(rootCategoryId: $rootCategoryId) {
			_id
			name
			code
			level
			path
			children {
				_id
				name
				code
				level
				path
				children {
					_id
					name
					code
					level
					path
				}
			}
		}
	}
`;

// Single category query
export const GET_CATEGORY_QUERY = gql`
	query GetCategory($where: CommonFindDocumentDto!) {
		inventory__productCategory(where: $where) {
			_id
			name
			code
			note
			level
			path
			parentCategory
			parent {
				_id
				name
				code
				path
			}
			children {
				_id
				name
				code
				level
				path
			}
			createdAt
			updatedAt
		}
	}
`;

// Category mutations
export const CREATE_CATEGORY_MUTATION = gql`
	mutation CreateCategory($input: CreateProductCategoryInput!) {
		inventory__createProductCategory(body: $input) {
			_id
		}
	}
`;

export const UPDATE_CATEGORY_MUTATION = gql`
	mutation UpdateCategory($categoryId: ID!, $input: UpdateProductCategoryInput!) {
		inventory__updateProductCategory(categoryId: $categoryId, body: $input)
	}
`;

export const DELETE_CATEGORY_MUTATION = gql`
	mutation DeleteCategory($categoryId: ID!) {
		inventory__removeProductCategory(where: { key: "_id", operator: "eq", value: $categoryId })
	}
`;