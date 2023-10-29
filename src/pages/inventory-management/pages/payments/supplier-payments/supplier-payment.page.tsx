import { Notify } from '@/_app/common/Notification/Notify';
import { ACCOUNTS_LIST_DROPDOWN } from '@/_app/common/common-gql';
import { getAccountBalance } from '@/_app/common/utils/getBalance';
import {
	AccountsWithPagination,
	MatchOperator,
	ProductPurchase,
	ProductPurchasesWithPagination,
	Supplier,
	SuppliersWithPagination,
} from '@/_app/graphql-models/graphql';
import { PEOPLE_SUPPLIERS_QUERY } from '@/pages/people/pages/suppliers/utils/suppliers.query';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	ActionIcon,
	Badge,
	Button,
	Flex,
	Input,
	NumberInput,
	Paper,
	Select,
	Space,
	Table,
	Text,
	Textarea,
	Title,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import SuppliersCardList from '../../purchases/create-purchase/components/SuppliersCardList';
import PurchaseCardList from './components/PurchaseCardList';
import {
	getRemainingDuesAmount,
	getTotalDuesAmount,
	getTotalPaidAmount,
} from './utils/helpers';
import {
	Accounting__Create_Purchase_Payment,
	Inventory__Product_Purchases,
} from './utils/query';
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
		register,
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
						operator: MatchOperator.Gt,
						value: '0',
					},
				],
			},
		},
	});

	const [createPayment, { loading: creatingPayment }] = useMutation(
		Accounting__Create_Purchase_Payment,
		Notify({
			sucTitle: 'Payment created successfully!',
		})
	);

	useEffect(() => {
		setValue('supplierId', supplierId!);
		setValue(`items`, [
			purchases?.inventory__productPurchases?.nodes?.find(
				(purchase: ProductPurchase) => purchase?._id === purId
			),
		]);
	}, [supplierId, purId, purchases]);

	const onSubmit = (v: any) => {
		console.log(v);

		createPayment({
			variables: {
				body: {
					supplierId: v?.supplierId,
					accountId: v?.accountId,
					items: v?.items?.map((item: any) => ({
						purchaseId: item?._id,
						amount: item?.amount,
					})),
					checkNo: v?.checkNo,
					receptNo: v?.receptNo,
					note: v?.note,
				},
			},
		});
	};

	const { data: accountData } = useQuery<{
		accounting__accounts: AccountsWithPagination;
	}>(ACCOUNTS_LIST_DROPDOWN, {
		variables: {
			where: { limit: -1 },
		},
	});

	const accountListForDrop = accountData?.accounting__accounts?.nodes?.map(
		(item) => ({
			value: item?._id,
			label: `${item?.name} [${item?.referenceNumber}]`,
		})
	);

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
					onAddItem={appendItems}
				/>

				<Space h={40} />

				<Title order={4}>Items</Title>
				<Space h={'md'} />

				{itemsFields?.length ? (
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
									<td className='font-medium'>{item?._id}</td>
									<td className='font-medium'>{item?.dueAmount}</td>
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
						</tbody>
					</Table>
				) : (
					<Paper className='text-left font-medium text-red-500 rounded-md p-3'>
						<Text>No items added!</Text>
					</Paper>
				)}

				<Space h={30} />

				<Select
					searchable
					withAsterisk
					onChange={(fromAccountId) =>
						setValue('accountId', fromAccountId || '')
					}
					label='Select account'
					placeholder='Select Account'
					data={accountListForDrop || []}
					value={watch('accountId')}
				/>
				<Space h={'sm'} />

				{watch('accountId') && (
					<Badge p={'md'}>
						Available Balance:{' '}
						{getAccountBalance(
							accountData?.accounting__accounts?.nodes || [],
							watch('accountId')
						)}
					</Badge>
				)}

				<Space h={'sm'} />

				<Input.Wrapper
					label='Check no'
					error={<ErrorMessage errors={errors} name='checkNo' />}
				>
					<Input placeholder='Write check no' {...register('checkNo')} />
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Recept no'
					error={<ErrorMessage errors={errors} name='receptNo' />}
				>
					<Input placeholder='Write recept no' {...register('receptNo')} />
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Note'
					error={<ErrorMessage errors={errors} name='note' />}
				>
					<Textarea placeholder='Write note' {...register('note')} />
				</Input.Wrapper>

				<Space h={30} />

				<Paper p={10} className='rounded-md '>
					<Flex justify={'space-between'} align={'center'}>
						<Text fw={700} size={'md'}>
							Total Dues{' '}
						</Text>
						<Text>{getTotalDuesAmount(watch('items'))} BDT</Text>
					</Flex>
					<Flex justify={'space-between'} align={'center'}>
						<Text fw={700} size={'md'}>
							Total Paid{' '}
						</Text>
						<Text>{getTotalPaidAmount(watch('items'))} BDT</Text>
					</Flex>
					<hr />
					<Flex justify={'space-between'} align={'center'}>
						<Text fw={700} size={'md'}>
							Remaining Dues (Total - Total Paid){' '}
						</Text>
						<Text>{getRemainingDuesAmount(watch('items'))} BDT</Text>
					</Flex>
				</Paper>

				<Space h={10} />

				<Button type='submit' fullWidth loading={creatingPayment}>
					Save
				</Button>
			</form>
		</div>
	);
};

export default SupplierPayment;
