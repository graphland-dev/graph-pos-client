import {
	MatchOperator,
	Product,
	ProductItemReference,
	ProductsWithPagination,
} from '@/_app/graphql-models/graphql';
import { useLazyQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { Input } from '@mantine/core';
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Pos_Products_Query } from '../utils/query.pos';
import { getProductReferenceByQuantity } from '../utils/utils.calc';

const ProductSelectArea: React.FC<{
	formInstance: any;
	onSelectProduct: (productReference: ProductItemReference) => void;
}> = ({ formInstance, onSelectProduct }) => {
	const [inputData, setInputData] = useState<any[]>([]);
	const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);

	// fetch products API initialization
	const [fetchProducts] = useLazyQuery<{
		inventory__products: ProductsWithPagination;
	}>(Pos_Products_Query, {
		nextFetchPolicy: 'network-only',
	});

	// filter products
	const filterProducts = (inputValue: string) => {
		return inputData.filter((i) =>
			i.label.toLowerCase().includes(inputValue.toLowerCase())
		);
	};

	// load options for input
	const loadOptions = (
		inputValue: string,
		callback: (options: any[]) => void
	) => {
		// fetch products based on search on delay 1500ms
		setTimeout(() => {
			fetchProducts({
				variables: {
					where: {
						limit: -1,
						filters: [
							{
								or: [
									{
										key: 'name',
										operator: MatchOperator.Contains,
										value: inputValue,
									},
									{
										key: 'code',
										operator: MatchOperator.Eq,
										value: inputValue,
									},
								],
							},
						],
					},
				},
			}).then((res) => {
				const products: Product[] = res.data?.inventory__products?.nodes || [];
				setInputData(
					products?.map((product) => ({
						label: product.name,
						value: product._id,
					}))
				);
				setSearchedProducts(products);
			});
			callback(filterProducts(inputValue));
		}, 1500);
	};

	// handle make product reference
	const handleMakeProductReference = (e: any) => {
		const selectedProduct = searchedProducts?.find((p) => p?._id === e);

		// console.log(selectedProduct);

		// if product found
		if (selectedProduct) {
			const productReference = getProductReferenceByQuantity(
				selectedProduct,
				1
			);
			onSelectProduct(productReference);
		}
	};

	return (
		<Input.Wrapper
			size='md'
			error={
				<ErrorMessage name='products' errors={formInstance.formState.errors} />
			}
		>
			<AsyncSelect
				isClearable
				cacheOptions
				loadOptions={loadOptions}
				defaultOptions
				onChange={(e: any) => handleMakeProductReference(e?.value)}
			/>
		</Input.Wrapper>
	);
};

export default ProductSelectArea;
