import { gql } from '@apollo/client';

export const UPDATE_PROFILE_MUTATION = gql`
	mutation ($input: UpdateMeInput!) {
		identity__updateMe(input: $input)
	}
`;
