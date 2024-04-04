import EmptyState from '@/_app/common/EmptyState/EmptyState';
import { getFileUrl } from '@/_app/common/utils/getFileUrl';
import {
	BrandsWithPagination,
	Product,
	ProductCategorysWithPagination,
	ProductItemReference,
	ServerFileReference,
} from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import {
	Badge,
	Input,
	Paper,
	Select,
	Skeleton,
	Space,
	Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import React from 'react';
import { VisibilityObserver } from 'reactjs-visibility';
import { getSelectInputData } from '../../products/product-edit/components/AssignmentForm';
import { Pos_Brands_Query, Pos_Categories_Query } from '../utils/query.pos';
import { getProductReferenceByQuantity } from '../utils/utils.calc';

interface IProp {
	onSelectProduct: (product: ProductItemReference) => void;
	productsList: Product[];
	isProductsFetching: boolean;
	productFilterKeys: {
		onSetCategory: (state: string) => void;
		onSetBrand: (state: string) => void;
	};
	onRefetchProducts: () => void;
}

const POSProductGlary: React.FC<IProp> = ({
	onSelectProduct,
	productsList,
	isProductsFetching,
	productFilterKeys: { onSetBrand, onSetCategory },
	onRefetchProducts,
}) => {
	const handleChangeVisibility = (visible: any) => {
		if (visible) {
			onRefetchProducts();
		}
	};

	const options = {
		rootMargin: '200px',
	};

	// categories query
	const { data: categories, loading: loadingCategories } = useQuery<{
		inventory__productCategories: ProductCategorysWithPagination;
	}>(Pos_Categories_Query, {
		variables: {
			where: { limit: -1 },
		},
		nextFetchPolicy: 'network-only',
	});

	// // brands query
	const { data: brands, loading: loadingBrands } = useQuery<{
		setup__brands: BrandsWithPagination;
	}>(Pos_Brands_Query, {
		variables: {
			where: { limit: -1 },
		},
		nextFetchPolicy: 'network-only',
	});

	// handle emit product
	const handleEmitProduct = (product: Product) => {
		const audio = new Audio('/beep.mp3');
		audio.play();
		onSelectProduct(getProductReferenceByQuantity(product, 1));
	};

	// get stock
	const getStock = (product: Product) => {
		const _in = product.stockInQuantity || 0;
		const _out = product.stockOutQuantity || 0;

		return _in - _out || 0;
	};

	return (
		<Paper p={15} className=' h-[calc(100vh-44px)] overflow-y-auto'>
			<div className='grid grid-cols-2 gap-2'>
				<Input.Wrapper size='md' label='Category'>
					<Select
						size='md'
						radius={0}
						searchable
						clearable
						placeholder='Select a category'
						data={getSelectInputData(
							categories?.inventory__productCategories?.nodes
						)}
						onChange={(catId) => onSetCategory(catId!)}
						disabled={loadingCategories}
					/>
				</Input.Wrapper>

				<Input.Wrapper size='md' label='Brand'>
					<Select
						size='md'
						radius={0}
						searchable
						clearable
						placeholder='Select a brand'
						data={getSelectInputData(brands?.setup__brands?.nodes)}
						onChange={(brandId) => onSetBrand(brandId!)}
						disabled={loadingBrands}
					/>
				</Input.Wrapper>
			</div>

			<Space h={20} />
			<div className='grid grid-cols-4 gap-2'>
				{productsList?.map((product: Product, idx: number) => (
					<Paper
						key={idx}
						radius={5}
						shadow='sm'
						pos={'relative'}
						onClick={() => {
							if (getStock(product)) {
								handleEmitProduct(product);
							} else {
								showNotification({
									message: 'Product not in stock',
									color: 'red',
								});
							}
						}}
						className='overflow-hidden border cursor-pointer border-neutral-muted hover:border-blue-500'
					>
						{!getStock(product) && (
							<div className='absolute inset-0 bg-slate-500/10 backdrop-blur-sm'></div>
						)}

						<Badge
							pos={'absolute'}
							top={0}
							left={0}
							radius={0}
							size='lg'
							variant='filled'
						>
							{product.price} BDT
						</Badge>
						<img
							src={getFileUrl(product?.thumbnail as ServerFileReference) ?? ''}
							alt='product image'
							className='object-cover p-2 rounded-md'
						/>

						<Space h={5} />

						<div className='p-2'>
							<Text size='xs' fw={500}>
								CODE: {product?.code}
							</Text>
							<Text fz={'md'} fw={500}>
								{product?.name}
							</Text>
							<Text fz={'md'} fw={500}>
								Stock: {getStock(product)}
							</Text>
						</div>
					</Paper>
				))}

				{isProductsFetching && (
					<>
						{new Array(12).fill(12).map((_, idx) => (
							<Skeleton key={idx} radius={5} h={200} />
						))}
					</>
				)}
			</div>
			{!productsList?.length && !isProductsFetching && (
				<EmptyState label={'No products found with your filter!'} />
			)}

			<VisibilityObserver
				onChangeVisibility={handleChangeVisibility}
				options={options}
			>
				{/* <Text>Load more...</Text> */}
			</VisibilityObserver>
		</Paper>
	);
};

export default POSProductGlary;
