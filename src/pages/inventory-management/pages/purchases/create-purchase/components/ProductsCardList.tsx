import { Product } from '@/_app/graphql-models/graphql';
import { Button, Group, Paper, Skeleton, Space, Text } from '@mantine/core';
import { IconSquareCheckFilled } from '@tabler/icons-react';
import React from 'react';

interface IProductCardListProps {
	isFetchingProducts: boolean;
	handleAddProductToList: (payload: Product) => void;
	products: Product[];
	productFields: any;
	hasNextPage: boolean;
	productPage: number;
	onChangeProductPage: (state: number) => void;
}

const ProductsCardList: React.FC<IProductCardListProps> = ({
	isFetchingProducts,
	handleAddProductToList,
	products,
	productFields,
	hasNextPage,
	onChangeProductPage,
	productPage,
}) => {
	return (
		<div>
			<div className='grid grid-cols-3 gap-3'>
				{products?.map((product: Product, idx: number) => (
					<Paper
						key={idx}
						p={10}
						withBorder
						className='relative cursor-pointer hover:bg-slate-100 hover:duration-200'
						onClick={() => {
							handleAddProductToList(product);
						}}
					>
						{productFields.findIndex(
							(p: any) => p.referenceId === product?._id
						) != -1 && (
							<IconSquareCheckFilled
								size={20}
								className='absolute top-3 right-3'
							/>
						)}
						<Text size={'md'} fw={700}>
							Name: {product?.name}
						</Text>
						<Text size={'sm'}>Product price: {product?.price}</Text>
						<Text size={'sm'}>Product Code: {product?.code}</Text>
					</Paper>
				))}
			</div>

			{isFetchingProducts && (
				<div className='grid grid-cols-3 gap-3'>
					{new Array(6).fill(6).map((_, idx) => (
						<Skeleton key={idx} h={90} radius={'sm'} />
					))}
				</div>
			)}

			<Space h={10} />
			<Group position='left'>
				<Button
					variant='subtle'
					size='xs'
					disabled={productPage === 1}
					onClick={() => onChangeProductPage(productPage - 1)}
				>
					Load Previous
				</Button>{' '}
				<Button
					variant='subtle'
					disabled={!hasNextPage}
					size='xs'
					onClick={() => onChangeProductPage(productPage + 1)}
				>
					Load More
				</Button>
			</Group>
		</div>
	);
};

export default ProductsCardList;
