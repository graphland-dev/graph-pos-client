import { gql } from '@apollo/client';

export const ACCOUNTING_TRANSACTION_QUERY = gql`
	query Accounting__transactions {
		accounting__transactions {
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
			}
		}
	}
`;
