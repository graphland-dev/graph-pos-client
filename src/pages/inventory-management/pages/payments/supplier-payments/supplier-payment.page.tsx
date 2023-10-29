import {
	MatchOperator,
	ProductPurchase,
	ProductPurchasesWithPagination,
	Supplier,
	SuppliersWithPagination,
} from '@/_app/graphql-models/graphql';
import { PEOPLE_SUPPLIERS_QUERY } from '@/pages/people/pages/suppliers/utils/suppliers.query';
import { useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	ActionIcon,
	Flex,
	NumberInput,
	Space,
	Table,
	Text,
	Title,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import SuppliersCardList from '../../purchases/create-purchase/components/SuppliersCardList';
import PurchaseCardList from './components/PurchaseCardList';
import { Inventory__Product_Purchases } from './utils/query';
import {
	IPurchasePaymentFormState,
	Purchase_Payment_Schema_Validation,
} from './utils/validation';

const SupplierPayment = () => {
	const { supplierId, purchaseId: purId } = useParams();

	// const [supplierId, setSupplierId] = useState<string>();
	const [supplierPage, onChangeSupplierPage] = useState(1);
	const [purchasePage, onChangePurchasePage] = useState(1);

	const {
		// register,
		setValue,
		formState: { errors },
		control,
		watch,
		handleSubmit,
	} = useForm<IPurchasePaymentFormState>({
		// defaultValues: {
		//   purchaseDate: new Date(),
		//   purchaseOrderDate: new Date(),
		//   note: "",
		//   products: [],
		//   costs: [],
		//   supplierId: "",
		//   taxRate: 0,
		// },
		resolver: yupResolver(Purchase_Payment_Schema_Validation),
		mode: 'onChange',
	});

	const {
		append: appendItems,
		fields: itemsFields,
		remove: removeItem,
	} = useFieldArray({
		name: 'items',
		control,
	});

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
		data: purchases,
		loading: isFetchingPurchases,
		// refetch: refetchSuppliers,
	} = useQuery<{
		inventory__productPurchases: ProductPurchasesWithPagination;
	}>(Inventory__Product_Purchases, {
		variables: {
			where: {
				filters: [
					{
						key: 'supplier',
						operator: MatchOperator.Eq,
						value: watch('supplierId'),
					},
					{
						key: 'dueAmount',
						operator: 'gt',
						value: '0',
					},
				],
			},
		},
	});

	useEffect(() => {
		setValue('supplierId', supplierId!);
		setValue(`items`, [
			{
				purchaseId: purId!,
				amount: 0,
			},
		]);
	}, [supplierId, purId]);

	console.log(purchases);

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
				<Flex justify={'space-between'} align={'center'}>
					<div>
						<Title order={4}>
							Select purchases to pay <span className='text-red-500'>*</span>
						</Title>
						<Text color='red'>{errors?.supplierId?.message}</Text>
					</div>
				</Flex>

				<Space h={'md'} />

				<PurchaseCardList
					hasNextPage={
						purchases?.inventory__productPurchases?.meta?.hasNextPage as boolean
					}
					isFetchingPurchases={isFetchingPurchases}
					onChangePurchasePage={onChangePurchasePage}
					purchasePage={purchasePage}
					purchases={
						purchases?.inventory__productPurchases?.nodes as ProductPurchase[]
					}
					watch={watch}
					setValue={setValue}
				/>

				<Space h={40} />

				<Title order={4}>Items</Title>
				<Space h={'md'} />

				<Table withBorder withColumnBorders>
					<thead className='bg-slate-300'>
						<tr className='!p-2 rounded-md'>
							<th>Purchase ID</th>
							<th>Due Amount</th>
							<th>Pay Amount</th>
							<th>Action</th>
						</tr>
					</thead>

					<tbody>
						{itemsFields?.map((item: any, idx: number) => (
							<tr key={idx}>
								<td className='font-medium'>{item?.purchaseId}</td>
								<td className='font-medium'>{item?.amount}</td>
								<td className='font-medium'>
									<NumberInput
										w={100}
										onChange={(v) =>
											setValue(`items.${idx}.amount`, parseInt(v as string))
										}
										min={1}
										value={watch(`items.${idx}.amount`)}
									/>
								</td>
								<td className='font-medium'>
									<ActionIcon
										variant='filled'
										color='red'
										size={'sm'}
										onClick={() => {
											removeItem(idx);
										}}
									>
										<IconX size={14} />
									</ActionIcon>
								</td>
							</tr>
						))}

						{/* <tr className='bg-green-50'>
							<td colSpan={5} className='font-semibold text-right'>
								Total
							</td>
							<td>{getTotalTaxAmount(watch('products') || [])}</td>
							<td>
								{getTotalProductsPrice(watch('products')!) +
									getTotalCostAmount(watch('costs')!)}
							</td>
							<td></td>
						</tr> */}
					</tbody>
				</Table>
			</form>
		</div>
	);
};

export default SupplierPayment;
