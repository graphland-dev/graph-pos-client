import { gql } from '@apollo/client';

export const PEOPLE_SUPPLIERS_QUERY = gql`
	query People__suppliers($where: CommonPaginationDto) {
		people__suppliers(where: $where) {
			meta {
				currentPage
				hasNextPage
				totalCount
				totalPages
			}
			nodes {
				_id
				name
				companyName
				contactNumber
				email
				address
				createdAt
				updatedAt
			}
		}
	}
`;

export const PEOPLE_CREATE_SUPPLIERS = gql`
	mutation Mutation($body: CreateSupplierInput!) {
		people__createSupplier(body: $body) {
			_id
		}
	}
`;
export const PEOPLE_UPDATE_SUPPLIERS = gql`
	mutation Mutation(
		$where: CommonFindDocumentDto!
		$body: UpdateSupplierInput!
	) {
		people__updateSupplier(where: $where, body: $body)
	}
`;

export const PEOPLE_REMOVE_SUPPLIERS = gql`
	mutation Mutation($where: CommonFindDocumentDto!) {
		people__removeSupplier(where: $where)
	}
`;
