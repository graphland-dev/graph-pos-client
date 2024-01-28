import { gql } from '@apollo/client';

export const PEOPLE_CLIENTS_QUERY = gql`
	query People__clients($where: CommonPaginationDto) {
		people__clients(where: $where) {
			nodes {
				_id
				name
				contactNumber
				email
				address
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

export const PEOPLE_CREATE_CLIENT = gql`
	mutation People__createClient($body: CreateClientInput!) {
		people__createClient(body: $body) {
			_id
		}
	}
`;
export const PEOPLE_UPDATE_CLIENT = gql`
	mutation People__updateClient(
		$where: CommonFindDocumentDto!
		$body: UpdateClientInput!
	) {
		people__updateClient(where: $where, body: $body)
	}
`;

export const PEOPLE_REMOVE_CLIENT = gql`
	mutation Mutation($where: CommonFindDocumentDto!) {
		people__removeClient(where: $where)
	}
`;
