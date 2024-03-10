import { gql } from '@apollo/client';

export const Pos_Client_Query = gql`
	query ($where: CommonPaginationDto) {
		people__clients(where: $where) {
			nodes {
				_id
				contactNumber
				name
			}
		}
	}
`;

export const Pos_Products_Query1 = gql`
	query ($where: CommonPaginationDto) {
		inventory__products(where: $where) {
			nodes {
				_id
				name
				code
				tenant
				gallery {
					provider
					path
					meta
					externalUrl
				}
				thumbnail {
					provider
					path
					meta
					externalUrl
				}
				stockInQuantity
				stockOutQuantity
				modelName
				category {
					_id
					tenant
					name
					code
					note
					createdAt
					updatedAt
				}
				brand {
					_id
					tenant
					name
					code
					note
					createdAt
					updatedAt
				}
				unit {
					_id
					tenant
					name
					code
					note
					createdAt
					updatedAt
				}
				vat {
					_id
					tenant
					name
					percentage
					code
					note
					createdAt
					updatedAt
				}
				price
				discountPercentage
				discountAmount
				discountMode
				taxType
				note
				createdAt
				updatedAt
			}
		}
	}
`;

export const Pos_Brands_Query = gql`
	query ($where: CommonPaginationDto) {
		setup__brands(where: $where) {
			nodes {
				_id
				name
			}
		}
	}
`;

export const Pos_Categories_Query = gql`
	query ($where: CommonPaginationDto) {
		inventory__productCategories(where: $where) {
			nodes {
				_id
				name
			}
		}
	}
`;

export const Pos_Products_Query = gql`
	query ($where: CommonPaginationDto) {
		inventory__products(where: $where) {
			nodes {
				_id
				brand {
					_id
					name
				}
				category {
					_id
					name
				}
				discountAmount
				discountMode
				discountPercentage
				code
				name
				price
				taxType
				thumbnail {
					meta
					path
					provider
					externalUrl
				}
				vat {
					_id
					name
					percentage
				}
			}
		}
	}
`;
