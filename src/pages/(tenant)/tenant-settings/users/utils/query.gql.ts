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
