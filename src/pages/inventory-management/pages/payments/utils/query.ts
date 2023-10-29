import { gql } from '@apollo/client';

export const Inventory__Product_Purchases = gql`
	query Inventory__productPurchases($where: CommonPaginationDto) {
		inventory__productPurchases(where: $where) {
			nodes {
				_id
				dueAmount
				paidAmount
				supplier {
					_id
					name
				}
			}
		}
	}
`;
