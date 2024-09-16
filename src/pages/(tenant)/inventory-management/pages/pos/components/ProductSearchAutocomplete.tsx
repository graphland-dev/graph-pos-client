import AutoComplete from '@/commons/components/AutoComplete.tsx';
import {
	MatchOperator,
	ProductItemReference,
	ProductsWithPagination,
} from '@/commons/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { Input, Text } from '@mantine/core';
import React, { useState } from 'react';
import { Pos_Products_Query } from '../utils/query.pos';
import { getProductReferenceByQuantity } from '../utils/utils.calc';

const ProductSearchAutocomplete: React.FC<{
	formInstance: any;
	onSelectProduct: (productReference: ProductItemReference) => void;
}> = ({ formInstance, onSelectProduct }) => {
	const [q, setQ] = useState<string>('');

	// fetch products API initialization
	const { data: searchedProducts, loading } = useQuery<{
		inventory__products: ProductsWithPagination;
	}>(Pos_Products_Query, {
		variables: {
			where: {
				filters: [
					{
						or: [
							{
								key: 'name',
								operator: MatchOperator.Contains,
								value: q.trim(),
							},
							{
								key: 'code',
								operator: MatchOperator.Contains,
								value: q.trim(),
							},
						],
					},
				],
			},
		},
		skip: !q,
	});

	return (
		<Input.Wrapper
			size='md'
			error={
				<ErrorMessage name='products' errors={formInstance.formState.errors} />
			}
		>
			<AutoComplete
				loading={loading}
				data={searchedProducts?.inventory__products?.nodes || []}
				onChange={setQ}
				placeholder='Search in inventory'
				onSelect={(item: any) => {
					onSelectProduct(getProductReferenceByQuantity(item, 1));
				}}
				enableNoResultDropdown
				NoResultComponent={
					<div className='flex gap-2 py-2 item-center'>
						<Text color='gray' fw={500}>
							No product found!
						</Text>
					</div>
				}
				labelKey={'name'}
			/>
		</Input.Wrapper>
	);
};

export default ProductSearchAutocomplete;
