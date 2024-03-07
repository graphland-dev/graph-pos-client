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
