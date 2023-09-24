import { gql } from '@apollo/client';

export const ACCOUNTING_TRANSACTION_QUERY = gql`
	query Accounting__transactions($where: CommonPaginationDto) {
		accounting__transactions(where: $where) {
			nodes {
				_id
				amount
				type
				source
				date
				note
				isActive
				coRelationId
				createdAt
				updatedAt
				account {
					name
					referenceNumber
					brunchName
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

export const TRANSACTION_CREATE_MUTATION = gql`
	mutation Mutation($body: CreateTransactionInput!) {
		accounting__createTransaction(body: $body) {
			_id
		}
	}
`;

export const ACCOUNT_REMOVE_TRANSACTION = gql`
	mutation Accounting__removeTransaction($where: CommonFindDocumentDto) {
		accounting__removeTransaction(where: $where)
	}
`;
