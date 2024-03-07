import { gql } from '@apollo/client';

export const Pos_Client_Query = gql`
	query {
		people__clients {
			nodes {
				_id
				contactNumber
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
				name
				code
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
