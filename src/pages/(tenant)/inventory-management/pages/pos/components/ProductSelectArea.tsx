import { Product } from '@/_app/graphql-models/graphql';
import { ErrorMessage } from '@hookform/error-message';
import { Autocomplete, Input } from '@mantine/core';
import React from 'react';

const ProductSelectArea: React.FC<{
	formInstance: any;
	handleAddProductToList: (productId: string) => void;
	products: Product[];
	fetchingProducts: boolean;
}> = ({ formInstance, handleAddProductToList, products, fetchingProducts }) => {
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
				data={getProductSelectInputData(products)}
				placeholder='Item name/code'
				onChange={(productId) => handleAddProductToList(productId)}
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
