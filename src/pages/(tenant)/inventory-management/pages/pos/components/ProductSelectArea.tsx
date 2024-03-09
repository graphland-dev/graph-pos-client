import {
	MatchOperator,
	Product,
	ProductItemReference,
	ProductsWithPagination,
} from '@/_app/graphql-models/graphql';
import { useLazyQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { Autocomplete, Input } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { Pos_Products_Query } from '../utils/query.pos';

const ProductSelectArea: React.FC<{
	formInstance: any;
	onSelectProduct: (productReference: ProductItemReference) => void;
	products: Product[];
	fetchingProducts: boolean;
}> = ({ formInstance }) => {
	const [value, setValue] = useDebouncedState('', 200);
	const [inputData, setInputData] = useState<any[]>([]);

	// fetch products
	const [fetchProducts, { data: products }] = useLazyQuery<{
		inventory__products: ProductsWithPagination;
	}>(Pos_Products_Query, {
		variables: {
			where: {
				filters: [
					{
						key: 'name',
						operator: MatchOperator.Contains,
						value,
					},
				],
			},
		},
	});

	// fetch based on search
	useEffect(() => {
		console.log({ products: inputData });
		fetchProducts();
		setInputData(
			getProductSelectInputData(products?.inventory__products?.nodes ?? [])
		);
	}, [value]);

	// console.log(onSelectProduct);

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
				// disabled={productsFetching}
				data={inputData}
				// data={[]}
				placeholder='Item name/code'
				onChange={(event) => setValue(event)}
				nothingFound={true}
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
