import { gql } from '@apollo/client';

export const CREATE_OR_CLONE_ROLE = gql`
	mutation Identity__createRole($body: CreateRoleInput!) {
		identity__createRole(body: $body) {
			_id
		}
	}
`;

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

export const UPDATE_ROLE_PERMISSIONS_MUTATION = gql`
	mutation Identity__updateRole(
		$body: UpdateRoleInput!
		$where: CommonFindDocumentDto!
	) {
		identity__updateRole(body: $body, where: $where)
	}
`;
