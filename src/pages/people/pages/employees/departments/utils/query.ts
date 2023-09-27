import { gql } from '@apollo/client';

export const CREATE_EMPLOYEE_DEPARTMENT = gql`
	mutation People__createEmployeeDepartment(
		$body: CreateEmployeeDepartmentInput!
	) {
		people__createEmployeeDepartment(body: $body) {
			_id
		}
	}
`;
export const UPDATE_EMPLOYEE_DEPARTMENT = gql`
	mutation People__updateEmployeeDepartment(
		$body: UpdateEmployeeDepartmentInput!
		$where: CommonFindDocumentDto!
	) {
		people__updateEmployeeDepartment(body: $body, where: $where) {
			_id
		}
	}
`;
export const REMOVE_EMPLOYEE_DEPARTMENT = gql`
	mutation People__removeEmployeeDepartment($where: CommonFindDocumentDto!) {
		people__removeEmployeeDepartment(where: $where) {
			_id
		}
	}
`;

export const GET_EMPLOYEE_DEPARTMENT = gql`
	query People__employeeDepartments($where: CommonPaginationDto) {
		people__employeeDepartments(where: $where) {
			nodes {
				_id
				name
				note
			}
		}
	}
`;
