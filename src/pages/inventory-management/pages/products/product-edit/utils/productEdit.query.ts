import { gql } from '@apollo/client';

export const INVENTORY_PRODUCT_BASIC_INFO_QUERY = gql`
	query Inventory__product($where: CommonFindDocumentDto!) {
		inventory__product(where: $where) {
			name
			code
			modelName
			note
		}
	}
`;

export const INVENTORY_PRODUCT_UPDATE = gql`
	mutation Inventory__removeProduct(
		$body: UpdateProductInput!
		$where: CommonFindDocumentDto!
	) {
		inventory__updateProduct(body: $body, where: $where)
	}
`;
