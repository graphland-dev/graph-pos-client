import currencyNumberFormat from '@/_app/common/utils/commaNumber';
import { getFileUrl } from '@/_app/common/utils/getFileUrl';
import {
	Product,
	ProductItemReference,
	ProductTaxType,
	ProductsWithPagination,
	ServerFileReference,
	Vat,
	VatsWithPagination,
} from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	ActionIcon,
	Badge,
	Button,
	Flex,
	Group,
	Input,
	NumberInput,
	Paper,
	Select,
	Skeleton,
	Space,
	Table,
	Text,
	Title,
} from '@mantine/core';
import {
	IconCreditCard,
	IconDeviceFloppy,
	IconRefresh,
	IconX,
} from '@tabler/icons-react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import {
	calculateTaxAmount,
	getTotalProductsPrice,
	getTotalTaxAmount,
	getVatProfileSelectInputData,
} from '../purchases/create-purchase/utils/helpers';
import { SETTINGS_VAT_QUERY } from '../settings/pages/vat/utils/query';
import CategoryAndBrandSelectArea from './components/CategoryAndBrandSelectArea';
import ClientSelectArea from './components/ClientSelectArea';
import ProductSelectArea from './components/ProductSelectArea';
import { Pos_Products_Query } from './utils/query.pos';
import { getDiscount, getSalesVat } from './utils/utils.calc';

const PosPage = () => {
	// fetch vat profiles
	const { data: vatProfile, loading: vatProfileLoading } = useQuery<{
		setup__vats: VatsWithPagination;
	}>(SETTINGS_VAT_QUERY, {
		variables: {
			where: { limit: -1 },
		},
	});

	// fetch products
	const { data: products, loading: productsFetching } = useQuery<{
		inventory__products: ProductsWithPagination;
	}>(Pos_Products_Query, {
		variables: {
			where: { limit: -1 },
		},
	});

	const form = useForm<IPosFormType>({
		defaultValues: {
			discountAmount: 0,
			discountType: 'Fixed',
			transportCost: 0,
			invoiceTax: 0,
		},
		resolver: yupResolver(Pos_Form_Validation_Schema),
		mode: 'onChange',
	});

	const {
		control,
		setValue,
		reset,
		formState: { errors },
		handleSubmit,
		watch,
	} = form;

	const {
		append: appendProduct,
		fields: productFields,
		remove: removeProduct,
	} = useFieldArray({
		control,
		name: 'products',
	});

	// handle add product to list
	function handleAddProductToList(productId: string) {
		const product = products?.inventory__products?.nodes?.find(
			(p) => p._id === productId
		);

		const price = product?.price || 0;
		const percentage = product?.vat?.percentage || 0;

		// Check the product is already exits in productsFields
		const locationIndex = productFields.findIndex(
			(p) => p?.referenceId === product?._id
		);
		if (locationIndex == -1) {
			appendProduct({
				name: product?.name,
				referenceId: product?._id,
				quantity: 1,
				subAmount: price,
				unitPrice: price,
				netAmount: 0,
				taxAmount: (price * percentage) / 100,
				taxRate: product?.vat?.percentage || 0,
				taxType: ProductTaxType.Inclusive,
			});
		} else {
			setValue(
				`products.${locationIndex}.quantity`,
				watch(`products.${locationIndex}.quantity`) + 1
			);
		}
	}

	// submit pos form
	const onSubmitPOS = (values: IPosFormType) => {
		console.log(values);
	};
	return (
		<div>
			<Flex>
				<Title order={3}>Create Sale</Title>
			</Flex>

			<Space h={20} />

			<form onSubmit={handleSubmit(onSubmitPOS)}>
				<div className='flex items-start gap-3'>
					<div className='lg:w-7/12'>
						<Paper p={15} withBorder>
							<div className='grid grid-cols-2 place-content-center gap-3'>
								<ClientSelectArea
									formInstance={form}
									contactNumber={watch('client')}
								/>

								{/* <Input size='md' radius={0} placeholder='Item name/code' /> */}
								<ProductSelectArea
									formInstance={form}
									handleAddProductToList={handleAddProductToList}
									fetchingProducts={productsFetching}
									products={products?.inventory__products?.nodes as Product[]}
								/>
							</div>
							<Space h={20} />

							<Title order={5}>Product Items</Title>
							<Space h={5} />

							{Boolean(productFields?.length) && (
								<>
									<Table withBorder withColumnBorders>
										<thead className='bg-card-header'>
											<tr className='!p-2 rounded-md'>
												<th>Name</th>
												<th>Quantity</th>
												<th>Unit Price</th>
												<th>Unit cost</th>
												<th>Tax %</th>
												<th>Tax Amount</th>
												<th>Total cost</th>
												<th>Action</th>
											</tr>
										</thead>

										<tbody>
											{productFields?.map(
												(product: ProductItemReference, idx: number) => (
													<tr key={idx}>
														<td className='font-medium'>{product?.name}</td>
														<td className='font-medium'>
															<NumberInput
																w={100}
																onChange={(v) =>
																	setValue(
																		`products.${idx}.quantity`,
																		parseInt(v as string)
																	)
																}
																min={1}
																value={watch(`products.${idx}.quantity`)}
															/>
														</td>
														<td className='font-medium'>
															<NumberInput
																w={100}
																onChange={(v) =>
																	setValue(
																		`products.${idx}.unitPrice`,
																		parseInt(v as string)
																	)
																}
																min={1}
																value={watch(`products.${idx}.unitPrice`)}
															/>
														</td>
														<td className='font-medium text-center'>
															{currencyNumberFormat(
																watch(`products.${idx}.quantity`) *
																	watch(`products.${idx}.unitPrice`)
															)}
														</td>
														<td className='font-medium'>
															{product?.taxRate || 0}
														</td>
														<td className='font-medium'>
															{currencyNumberFormat(
																calculateTaxAmount(watch(`products.${idx}`))
															)}
														</td>
														<td className='font-medium'>
															{currencyNumberFormat(
																calculateTaxAmount(watch(`products.${idx}`)) +
																	watch(`products.${idx}.quantity`) *
																		watch(`products.${idx}.unitPrice`)
															)}
														</td>
														<td className='font-medium'>
															<ActionIcon
																variant='filled'
																color='red'
																size={'sm'}
																onClick={() => {
																	removeProduct(idx);
																}}
															>
																<IconX size={14} />
															</ActionIcon>
														</td>
													</tr>
												)
											)}

											<tr>
												<td colSpan={5} className='font-semibold text-right'>
													Total
												</td>
												<td>{getTotalTaxAmount(watch('products') || [])}</td>
												<td>
													{currencyNumberFormat(
														getTotalProductsPrice(watch('products')!)
													)}
												</td>
												<td></td>
											</tr>
										</tbody>
									</Table>
									<Space h={50} />
								</>
							)}
						</Paper>

						<Space h={20} />

						<Paper p={15} withBorder>
							<div className='grid grid-cols-2 gap-3'>
								{/* {JSON.stringify(errors, null, 2)} */}
								<div>
									<Input.Wrapper
										size='md'
										error={<ErrorMessage name='discountType' errors={errors} />}
									>
										<Select
											label='Discount Type'
											placeholder='Fixed'
											size='md'
											onChange={(e) => setValue('discountType', e!)}
											defaultValue={watch('discountType')}
											radius={0}
											data={['Fixed', 'Percentage(%)']}
										/>
									</Input.Wrapper>

									<Space h={'sm'} />

									<Input.Wrapper
										size='md'
										error={
											<ErrorMessage name='transportCost' errors={errors} />
										}
									>
										<NumberInput
											label='Transport Cost'
											size='md'
											onChange={(e) =>
												setValue('transportCost', parseInt(e as string))
											}
											defaultValue={watch('transportCost')}
											min={0}
											radius={0}
											placeholder='Enter transport cost'
										/>
									</Input.Wrapper>
								</div>
								<div>
									<Input.Wrapper
										size='md'
										error={
											<ErrorMessage name='discountAmount' errors={errors} />
										}
									>
										<NumberInput
											label='Discount'
											radius={0}
											size='md'
											min={0}
											defaultValue={watch('discountAmount')}
											onChange={(e) =>
												setValue('discountAmount', parseInt(e as string))
											}
											placeholder='Enter discount'
										/>
									</Input.Wrapper>

									<Space h={'sm'} />

									<Input.Wrapper
										size='md'
										error={<ErrorMessage name='invoiceTax' errors={errors} />}
									>
										<Select
											label='Invoice Tax'
											placeholder='Select tax type'
											size='md'
											radius={0}
											disabled={vatProfileLoading}
											defaultValue={watch('invoiceTax').toString()}
											data={getVatProfileSelectInputData(
												vatProfile?.setup__vats?.nodes as Vat[]
											)}
											onChange={(e) =>
												setValue('invoiceTax', parseInt(e as string)!)
											}
										/>
									</Input.Wrapper>
								</div>
							</div>

							<Space h={'sm'} />

							<div className='p-3 text-xl font-bold text-center text-black bg-indigo-200 rounded-sm'>
								Net Total:{' '}
								{currencyNumberFormat(
									getTotalProductsPrice(watch('products')!) -
										getDiscount(
											watch('discountType'),
											watch('discountAmount'),
											getTotalProductsPrice(watch('products')!)
										) +
										watch('transportCost') +
										getSalesVat(
											watch('transportCost') +
												getTotalProductsPrice(watch('products')!) -
												getDiscount(
													watch('discountType'),
													watch('discountAmount'),
													getTotalProductsPrice(watch('products')!)
												),
											watch('invoiceTax')
										) ?? 0
								) ?? 0.0}{' '}
								BDT
							</div>

							<Space h={15} />

							<Group position='apart'>
								<Button
									size='md'
									type='submit'
									leftIcon={<IconDeviceFloppy size={16} />}
								>
									Save
								</Button>
								<Button
									size='md'
									type='submit'
									leftIcon={<IconCreditCard size={16} />}
								>
									Save & Payment
								</Button>
								<Button
									size='md'
									onClick={() =>
										reset({
											brand: '',
											client: '',
											category: '',
											discountAmount: 0,
											discountType: 'Fixed',
											invoiceTax: 0,
											products: [],
											transportCost: 0,
										})
									}
									leftIcon={<IconRefresh size={16} />}
									color='red'
								>
									Reset
								</Button>
							</Group>
						</Paper>
					</div>

					{/*  
          
          
          --------------------------
          */}

					<div className='lg:w-5/12'>
						<Paper p={15} withBorder>
							<CategoryAndBrandSelectArea formInstance={form} />
						</Paper>

						<Space h={20} />

						<Paper p={15} withBorder>
							<Input size='md' radius={0} placeholder='Item name/code' />

							<Space h={10} />

							<div className='grid grid-cols-4 gap-2'>
								{products?.inventory__products?.nodes?.map(
									(product: Product, idx: number) => (
										<Paper
											key={idx}
											radius={5}
											shadow='sm'
											pos={'relative'}
											className='hover:border-solid hover:border-[1px] hover:border-indigo-300 hover:duration-300'
											onClick={() => handleAddProductToList(product?._id)}
										>
											<Badge
												pos={'absolute'}
												top={0}
												left={0}
												radius={0}
												size='lg'
												className='rounded-tl-lg rounded-br-lg'
												variant='filled'
											>
												{product.price}
											</Badge>
											<img
												src={getFileUrl(
													product?.thumbnail as ServerFileReference
												)}
												alt='product image'
												className='object-cover p-2 rounded-md'
											/>

											<Space h={5} />

											<div className='p-2'>
												<Text size='xs' fw={500}>
													{product?.code}
												</Text>
												<Text fz={'md'} fw={500}>
													{product?.name}
												</Text>
											</div>
										</Paper>
									)
								)}

								{productsFetching && (
									<>
										{new Array(12).fill(12).map((_, idx) => (
											<Skeleton key={idx} radius={5} h={200} />
										))}
									</>
								)}
							</div>
						</Paper>
					</div>
				</div>
			</form>
		</div>
	);
};

export default PosPage;

const Pos_Form_Validation_Schema = Yup.object().shape({
	client: Yup.string().required().label('Client'),
	discountType: Yup.string().required().label('Discount type'),
	discountAmount: Yup.number().required().label('Discount amount'),
	transportCost: Yup.number().required().label('Transport cost'),
	invoiceTax: Yup.number().required().label('Invoice tax'),
	category: Yup.string().required().label('Category'),
	brand: Yup.string().required().label('Brand'),
	products: Yup.array()
		.required()
		.min(1, 'You must have to select at least one product')
		.label('Purchase products'),
});

export type IPosFormType = Yup.InferType<typeof Pos_Form_Validation_Schema>;
