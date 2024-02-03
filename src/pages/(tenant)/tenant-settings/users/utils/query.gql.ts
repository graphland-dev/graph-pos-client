import { gql } from '@apollo/client';

export const Organization__Employees__Query = gql`
	query Identity__users($where: CommonPaginationDto) {
		identity__users(where: $where) {
			nodes {
				_id
				name
				email
				tenant
			}
		}
	}
`;
