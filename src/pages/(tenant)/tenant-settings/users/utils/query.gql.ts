import { gql } from '@apollo/client';

export const Organization__Employees__Query = gql`
	query Identity__currentTenantUsers {
		identity__currentTenantUsers {
			nodes {
				_id
				name
				email
				memberships {
					tenant
				}
			}
		}
	}
`;

export const IDENTITY_ADD_USER_TO_CURRENT_TENANT = gql`
  mutation Identity__addUserToCurrentTenant($input: AddUserToTenantInput!) {
    identity__addUserToCurrentTenant(input: $input)
  }
`;
