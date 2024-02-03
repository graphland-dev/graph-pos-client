import { gql } from '@apollo/client';

export const CURRENT__TENANT__ROLES = gql`
	query {
		identity__currentTenantRoles {
			_id
			name
			permissions {
				collectionName
				actions
			}
			tenant
		}
	}
`;
