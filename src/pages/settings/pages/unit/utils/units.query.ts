import { gql } from '@apollo/client';

export const SETUP_UNITS_QUERY = gql`
	query Setup__units($where: CommonPaginationDto) {
		setup__units(where: $where) {
			nodes {
				_id
				name
				code
				percentage
				note
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

export const SETUP_CREATE_UNIT = gql`
	mutation Mutation($body: CreateUnitInput!) {
		setup__createUnit(body: $body) {
			_id
		}
	}
`;
export const SETUP_UPDATE_UNIT = gql`
	mutation Setup__updateUnit(
		$where: CommonFindDocumentDto!
		$body: UpdateUnitInput!
	) {
		setup__updateUnit(where: $where, body: $body)
	}
`;
export const SETUP_REMOVE_UNIT = gql`
	mutation Setup__removeUnit($where: CommonFindDocumentDto!) {
		setup__removeUnit(where: $where)
	}
`;
