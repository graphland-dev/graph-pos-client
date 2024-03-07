import { ProductsWithPagination } from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { Autocomplete, Input } from '@mantine/core';
import React from 'react';
import { Pos_Products_Query } from '../utils/query.pos';

const ProductSelectArea: React.FC<{
	formInstance: any;
}> = ({ formInstance }) => {
	const { data: products, loading: fetchingProducts } = useQuery<{
		inventory__products: ProductsWithPagination;
	}>(Pos_Products_Query);

	return (
		<Input.Wrapper
			size='md'
			error={
				<ErrorMessage name='client' errors={formInstance.formState.errors} />
			}
		>
			<Autocomplete
				size='md'
				radius={0}
				className='w-full'
				disabled={fetchingProducts}
				data={getProductSelectInputData(products?.inventory__products?.nodes)}
				placeholder='Item name/code'
				onChange={(clientEvent) =>
					formInstance.setValue('products', clientEvent)
				}
				nothingFound
			/>
		</Input.Wrapper>
	);
};

export default ProductSelectArea;

const getProductSelectInputData = (data: any) => {
	const clients: any = [];

	data?.map((d: any) =>
		clients.push({
			label: d.name,
			value: d._id,
		})
	);

	return clients;
};
