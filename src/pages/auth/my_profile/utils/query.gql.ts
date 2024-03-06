import { gql } from '@apollo/client';

export const UPDATE_PROFILE_MUTATION = gql`
	mutation ($input: UpdateMeInput!) {
		identity__updateMe(input: $input)
	}
`;

export const UPDATE_MY_PASSWORD = gql`
  mutation Identity__updateMyPassword($input: UpdateMyPasswordInput!) {
    identity__updateMyPassword(input: $input)
  }
`;
