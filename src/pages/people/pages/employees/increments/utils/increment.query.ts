import { gql } from '@apollo/client';

export const CREATE_INCREMENT_MUTATION_QUERY = gql`
	mutation Mutation($body: CreateEmployeeIncrementInput!) {
		people__createEmployeeIncrement(body: $body) {
			_id
		}
	}
`;

export const INCREMENTS_QUERY = gql`
	query People__employeeIncrements($where: CommonPaginationDto) {
		people__employeeIncrements(where: $where) {
			nodes {
				_id
				note
				amount
				date
				createdAt
				updatedAt
				employee {
					name
					_id
				}
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

export const INCREMENT_EMPLOYEE_QUERY = gql`
	query People__employees($where: CommonPaginationDto) {
		people__employees(where: $where) {
			nodes {
				_id
				name
			}
		}
	}
`;

export const INCREMENT_DELETE_MUTATION = gql`
	mutation Mutation($where: CommonFindDocumentDto!) {
		people__removeEmployeeIncrement(where: $where)
	}
`;
