import { Supplier } from '@/_app/graphql-models/graphql';
import { Button, Group, Paper, Skeleton, Space, Text } from '@mantine/core';
import { IconSquareCheckFilled } from '@tabler/icons-react';
import React from 'react';

const SuppliersCardList: React.FC<{
	suppliers: Supplier[];
	setValue: any;
	watch: any;
	isFetchingSuppliers: boolean;
	hasNextPage: boolean;
	supplierPage: number;
	onChangeSupplierPage: (state: number) => void;
}> = ({
	suppliers,
	setValue,
	watch,
	isFetchingSuppliers,
	hasNextPage,
	supplierPage,
	onChangeSupplierPage,
}) => {
	return (
		<div>
			<div className='grid grid-cols-3 gap-3'>
				{suppliers?.map((supplier: Supplier, idx: number) => (
					<Paper
						key={idx}
						p={10}
						withBorder
						className='relative cursor-pointer hover:bg-slate-100 hover:duration-200'
						onClick={() => setValue('supplierId', supplier?._id)}
					>
						{watch('supplierId') === supplier?._id && (
							<IconSquareCheckFilled
								size={20}
								className='absolute top-3 right-3'
							/>
						)}
						<Text size={'md'} fw={700}>
							Name: {supplier?.name}
						</Text>
						<Text size={'sm'}>Company name: {supplier?.companyName}</Text>
						<Text size={'sm'}>Company email: {supplier?.email}</Text>
					</Paper>
				))}
			</div>
			{isFetchingSuppliers && (
				<div className='grid grid-cols-3 gap-3'>
					{new Array(6).fill(6).map((_, idx) => (
						<Skeleton key={idx} h={90} radius={'sm'} />
					))}
				</div>
			)}

			<Space h={'md'} />

			<Group position='left'>
				<Button
					variant='subtle'
					size='xs'
					disabled={supplierPage === 1}
					onClick={() => onChangeSupplierPage(supplierPage - 1)}
				>
					Load Previous
				</Button>{' '}
				<Button
					variant='subtle'
					disabled={!hasNextPage}
					size='xs'
					onClick={() => onChangeSupplierPage(supplierPage + 1)}
				>
					Load Next
				</Button>
			</Group>
		</div>
	);
};

export default SuppliersCardList;
