import {
	Supplier,
	SuppliersWithPagination,
} from '@/_app/graphql-models/graphql';
import { PEOPLE_SUPPLIERS_QUERY } from '@/pages/people/pages/suppliers/utils/suppliers.query';
import { useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Flex, Space, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import SuppliersCardList from '../../purchases/create-purchase/components/SuppliersCardList';
import {
	ICreatePurchaseFormState,
	Schema_Validation,
} from '../../purchases/create-purchase/utils/validation';

const SupplierPayment = () => {
	const [supplierPage, onChangeSupplierPage] = useState(1);

	const {
		data,
		loading: isFetchingSuppliers,
		// refetch: refetchSuppliers,
	} = useQuery<{
		people__suppliers: SuppliersWithPagination;
	}>(PEOPLE_SUPPLIERS_QUERY, {
		variables: {
			where: {
				page: supplierPage,
				limit: 6,
			},
		},
	});

	const {
		// register,
		setValue,
		formState: { errors },
		// control,
		watch,
		handleSubmit,
	} = useForm<ICreatePurchaseFormState>({
		// defaultValues: {
		//   purchaseDate: new Date(),
		//   purchaseOrderDate: new Date(),
		//   note: "",
		//   products: [],
		//   costs: [],
		//   supplierId: "",
		//   taxRate: 0,
		// },
		resolver: yupResolver(Schema_Validation),
		mode: 'onChange',
	});

	const onSubmit = (v: any) => {
		console.log(v);
		// createPurchaseProduct({
		// 	variables: {
		// 		body: {
		// 			...v,
		// 			taxAmount:
		// 				((getTotalProductsPrice(watch('products')!) +
		// 					getTotalCostAmount(watch('costs')!)) *
		// 					watch('taxRate')) /
		// 				100,

		// 			// Prices
		// 			costAmount: getTotalCostAmount(watch('costs')!),
		// 			subTotal:
		// 				getTotalProductsPrice(watch('products')!) +
		// 				getTotalCostAmount(watch('costs')!), // products.netAmount + costs.amount
		// 			netTotal:
		// 				getTotalProductsPrice(watch('products')!) +
		// 				getTotalCostAmount(watch('costs')!) +
		// 				((getTotalProductsPrice(watch('products')!) +
		// 					getTotalCostAmount(watch('costs')!)) *
		// 					watch('taxRate')) /
		// 					100, // subTotal + taxAmount
		// 		},
		// 	},
		// });
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex justify={'space-between'} align={'center'}>
					<div>
						<Title order={4}>
							Select supplier <span className='text-red-500'>*</span>
						</Title>
						<Text color='red'>{errors?.supplierId?.message}</Text>
					</div>

					{/* <Button
						variant='light'
						leftIcon={<IconPlus />}
						onClick={() => createSupplierDrawerHandler.open()}
					>
						Add new
					</Button> */}
				</Flex>
				<Space h={'md'} />
				<SuppliersCardList
					isFetchingSuppliers={isFetchingSuppliers}
					setValue={setValue}
					suppliers={data?.people__suppliers?.nodes as Supplier[]}
					watch={watch}
					hasNextPage={data?.people__suppliers?.meta?.hasNextPage as boolean}
					supplierPage={supplierPage}
					onChangeSupplierPage={onChangeSupplierPage}
				/>

				<Space h={'md'} />
			</form>
		</div>
	);
};

export default SupplierPayment;
