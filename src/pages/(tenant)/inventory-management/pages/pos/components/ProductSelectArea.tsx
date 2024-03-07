import { Product, ProductsWithPagination } from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { Autocomplete, Input } from '@mantine/core';
import React from 'react';
import { Pos_Products_Query } from '../utils/query.pos';

const ProductSelectArea: React.FC<{
	formInstance: any;
	handleAddProductToList: (productId: string, products: Product[]) => void;
}> = ({ formInstance, handleAddProductToList }) => {
	const { data: products, loading: fetchingProducts } = useQuery<{
		inventory__products: ProductsWithPagination;
	}>(Pos_Products_Query);

	return (
		<Input.Wrapper
			size='md'
			error={
				<ErrorMessage name='products' errors={formInstance.formState.errors} />
			}
		>
			<Autocomplete
				size='md'
				radius={0}
				className='w-full'
				disabled={fetchingProducts}
				data={getProductSelectInputData(products?.inventory__products?.nodes)}
				placeholder='Item name/code'
				onChange={(productId) =>
					handleAddProductToList(
						productId,
						products?.inventory__products?.nodes as Product[]
					)
				}
				nothingFound
			/>
		</Input.Wrapper>
	);
};

export default ProductSelectArea;

const getProductSelectInputData = (data: any) => {
	const productNames: any = [];

	data?.map((d: any) =>
		productNames.push({
			label: d.name,
			data: { ...d },
			value: d._id,
		})
	);

	return productNames;
};
