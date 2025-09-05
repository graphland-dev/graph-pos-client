import { gql } from "@apollo/client";

export const INVENTORY_PRODUCTS_LIST_QUERY = gql`
  query Query($where: CommonPaginationDto) {
    inventory__products(where: $where) {
      nodes {
        _id
        name
        code
        partId
        category {
          _id
          name
        }
        brand {
          _id
          name
        }
        currentStockQuantity
        isSellableWithoutStock
        price
        purchasePrice
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
// export const INVENTORY_PRODUCT_QUERY = gql`
// 	query Inventory__product($where: CommonFindDocumentDto!) {
// 		inventory__product(where: $where) {
// 			_id
// 			name
// 			stockInQuantity
// 			stockOutQuantity
// 			code
// 			modelName
// 			price
// 			discountPercentage
// 			discountAmount
// 			discountMode
// 			note
// 			createdAt
// 			updatedAt
// 			category {
// 				_id
// 				name
// 				code
// 				note
// 				createdAt
// 				updatedAt
// 			}
// 			brand {
// 				_id
// 				name
// 				code
// 				note
// 				createdAt
// 				updatedAt
// 			}
// 			unit {
// 				_id
// 				name
// 				code
// 				note
// 				createdAt
// 				updatedAt
// 			}
// 			vat {
// 				_id
// 				name
// 				code
// 				note
// 				createdAt
// 				updatedAt
// 			}
// 		}
// 	}
// `;

export const INVENTORY_PRODUCT_CREATE = gql`
  mutation Inventory__createProduct($body: CreateProductInput!) {
    inventory__createProduct(body: $body) {
      _id
    }
  }
`;

export const INVENTORY_PRODUCT_REMOVE = gql`
  mutation Inventory__removeProduct($where: CommonFindDocumentDto!) {
    inventory__removeProduct(where: $where)
  }
`;

// Query for category filter dropdown
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
  }
`;

// Query for brand filter dropdown
export const BRANDS_QUERY = gql`
  query Setup__brands {
    setup__brands {
      nodes {
        _id
        name
      }
    }
  }
`;
