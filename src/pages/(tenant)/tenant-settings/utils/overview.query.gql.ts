import { gql } from '@apollo/client';

export const ORGANIZATION_OVERVIEW_INFO_UPDATE_MUTATION = gql`
	mutation Identity__updateCurrentTenant($input: UpdateTenantInput!) {
		identity__updateCurrentTenant(input: $input)
	}
`;
