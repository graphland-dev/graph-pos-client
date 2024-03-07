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
	Space,
	Table,
	Text,
	Title,
} from '@mantine/core';
import {
	IconCreditCard,
	IconDeviceFloppy,
	IconMinus,
	IconPlus,
	IconRefresh,
	IconX,
} from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import ClientSelectArea from './components/ClientSelectArea';
import ProductSelectArea from './components/ProductSelectArea';

const elements = [
	{ productName: 'Product 6', price: 660, quantity: 6 },
	{ productName: 'Product 7', price: 720, quantity: 7 },
	{ productName: 'Product 39', price: 359, quantity: 9 },
	{ productName: 'Product 56', price: 576, quantity: 6 },
	{ productName: 'Product 58', price: 584, quantity: 5 },
];

const PosPage = () => {
	const rows = elements.map((element) => (
		<tr key={element.productName}>
			<td>{element.productName}</td>
			<td>{element.price ?? 0} BDT</td>
			<td>
				<Flex gap={10}>
					<ActionIcon size={'sm'} variant='filled' color='red' radius={50}>
						<IconMinus size={16} />
					</ActionIcon>
					<Text>{element.quantity}</Text>
					<ActionIcon size={'sm'} variant='filled' color='blue' radius={50}>
						<IconPlus size={16} />
					</ActionIcon>
				</Flex>
			</td>
			<td>{element.price * element.quantity ?? 0} BDT</td>
			<td>
				<ActionIcon size={'sm'} variant='filled' color='red' radius={100}>
					<IconX size={16} />
				</ActionIcon>
			</td>
		</tr>
	));

	const form = useForm<IPosFormType>({
		resolver: yupResolver(Pos_Form_Validation_Schema),
		mode: 'onChange',
	});

	const {
		// register,
		// control,
		setValue,
		formState: { errors },
		handleSubmit,
		watch,
	} = form;

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
								<ProductSelectArea formInstance={form} />
							</div>
							<Space h={20} />

							<Title order={5}>Product Items</Title>
							<Space h={5} />

							<Table
								verticalSpacing='sm'
								fontSize='md'
								highlightOnHover
								withBorder
								// withColumnBorders
							>
								<thead>
									<tr>
										<th>Product</th>
										<th>Price</th>
										<th>Quantity</th>
										<th>Subtotal</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>{rows}</tbody>
							</Table>
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
											onChange={(e) => setValue('invoiceTax', e!)}
											radius={0}
											data={['Vat@10%', 'Vat@0']}
										/>
									</Input.Wrapper>
								</div>
							</div>

							<Space h={'sm'} />

							<div className='p-3 text-xl font-bold text-center text-black bg-indigo-200 rounded-sm'>
								Net Total: 416.42 BDT
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
									type='submit'
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
							<Flex gap={8}>
								<Select
									data={['Drinks', 'Fast Food', 'Accessories', 'Dry Foods']}
									size='md'
									radius={0}
									placeholder='Select a category'
								/>
								<Select
									data={['Drinks', 'Fast Food', 'Accessories', 'Dry Foods']}
									size='md'
									radius={0}
									placeholder='Select a category'
								/>
							</Flex>
						</Paper>

						<Space h={20} />

						<Paper p={15} withBorder>
							<Input size='md' radius={0} placeholder='Item name/code' />

							<Space h={10} />

							<div className='grid grid-cols-4 gap-2'>
								<Paper
									radius={5}
									shadow='sm'
									pos={'relative'}
									className='hover:border-solid hover:border-[1px] hover:border-indigo-300 hover:duration-300'
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
										120
									</Badge>
									<img
										src='https://posdemo3.uddoktait.com/images/products/1695449586.jpeg'
										alt='product image'
										className='object-cover p-2 rounded-md'
									/>

									<Space h={5} />

									<div className='p-2'>
										<Text size='xs' fw={500}>
											AP-012232
										</Text>
										<Text fz={'md'} fw={500}>
											Product 1
										</Text>
									</div>
								</Paper>
								<Paper
									radius={5}
									shadow='sm'
									pos={'relative'}
									className='hover:border-solid hover:border-[1px] hover:border-indigo-300 hover:duration-300'
								>
									<Badge
										pos={'absolute'}
										top={0}
										left={0}
										radius={0}
										size='lg'
										variant='filled'
										className='rounded-tl-lg rounded-br-lg'
									>
										120
									</Badge>
									<img
										src='https://posdemo3.uddoktait.com/images/products/1702902621.jpeg'
										alt='product image'
										className='object-cover p-2 rounded-md'
									/>

									<Space h={5} />

									<div className='p-2'>
										<Text size='xs' fw={500}>
											AP-012232
										</Text>
										<Text fz={'md'} fw={500}>
											Product 1
										</Text>
									</div>
								</Paper>
								<Paper
									radius={5}
									shadow='sm'
									pos={'relative'}
									className='hover:border-solid hover:border-[1px] hover:border-indigo-300 hover:duration-300'
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
										120
									</Badge>
									<img
										src='https://posdemo3.uddoktait.com/images/products/1694628470.jpeg'
										alt='product image'
										className='object-cover p-2 rounded-md'
									/>

									<Space h={5} />

									<div className='p-2'>
										<Text size='xs' fw={500}>
											AP-012232
										</Text>
										<Text fz={'md'} fw={500}>
											Product 1
										</Text>
									</div>
								</Paper>
								<Paper
									radius={5}
									shadow='sm'
									pos={'relative'}
									className='hover:border-solid hover:border-[1px] hover:border-indigo-300 hover:duration-300'
								>
									<Badge
										pos={'absolute'}
										top={0}
										left={0}
										radius={0}
										size='lg'
										variant='filled'
										className='rounded-tl-lg rounded-br-lg'
									>
										120
									</Badge>
									<img
										src='https://posdemo3.uddoktait.com/images/products/1702902621.jpeg'
										alt='product image'
										className='object-cover p-2 rounded-md'
									/>

									<Space h={5} />

									<div className='p-2'>
										<Text size='xs' fw={500}>
											AP-012232
										</Text>
										<Text fz={'md'} fw={500}>
											Product 1
										</Text>
									</div>
								</Paper>
								<Paper
									radius={5}
									shadow='sm'
									pos={'relative'}
									className='hover:border-solid hover:border-[1px] hover:border-indigo-300 hover:duration-300'
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
										120
									</Badge>
									<img
										src='https://posdemo3.uddoktait.com/images/products/1695449586.jpeg'
										alt='product image'
										className='object-cover p-2 rounded-md'
									/>

									<Space h={5} />

									<div className='p-2'>
										<Text size='xs' fw={500}>
											AP-012232
										</Text>
										<Text fz={'md'} fw={500}>
											Product 1
										</Text>
									</div>
								</Paper>
								<Paper
									radius={5}
									shadow='sm'
									pos={'relative'}
									className='hover:border-solid hover:border-[1px] hover:border-indigo-300 hover:duration-300'
								>
									<Badge
										pos={'absolute'}
										top={0}
										left={0}
										radius={0}
										size='lg'
										variant='filled'
										className='rounded-tl-lg rounded-br-lg'
									>
										120
									</Badge>
									<img
										src='https://posdemo3.uddoktait.com/images/products/1702902621.jpeg'
										alt='product image'
										className='object-cover p-2 rounded-md'
									/>

									<Space h={5} />

									<div className='p-2'>
										<Text size='xs' fw={500}>
											AP-012232
										</Text>
										<Text fz={'md'} fw={500}>
											Product 1
										</Text>
									</div>
								</Paper>
								<Paper
									radius={5}
									shadow='sm'
									pos={'relative'}
									className='hover:border-solid hover:border-[1px] hover:border-indigo-300 hover:duration-300'
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
										120
									</Badge>
									<img
										src='https://posdemo3.uddoktait.com/images/products/1694628470.jpeg'
										alt='product image'
										className='object-cover p-2 rounded-md'
									/>

									<Space h={5} />

									<div className='p-2'>
										<Text size='xs' fw={500}>
											AP-012232
										</Text>
										<Text fz={'md'} fw={500}>
											Product 1
										</Text>
									</div>
								</Paper>
								<Paper
									radius={5}
									shadow='sm'
									pos={'relative'}
									className='hover:border-solid hover:border-[1px] hover:border-indigo-300 hover:duration-300'
								>
									<Badge
										pos={'absolute'}
										top={0}
										left={0}
										radius={0}
										size='lg'
										variant='filled'
										className='rounded-tl-lg rounded-br-lg'
									>
										120
									</Badge>
									<img
										src='https://posdemo3.uddoktait.com/images/products/1702902621.jpeg'
										alt='product image'
										className='object-cover p-2 rounded-md'
									/>

									<Space h={5} />

									<div className='p-2'>
										<Text size='xs' fw={500}>
											AP-012232
										</Text>
										<Text fz={'md'} fw={500}>
											Product 1
										</Text>
									</div>
								</Paper>
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
	invoiceTax: Yup.string().required().label('Invoice tax'),
	category: Yup.string().required().label('Category'),
	brand: Yup.string().required().label('Brand'),
});

export type IPosFormType = Yup.InferType<typeof Pos_Form_Validation_Schema>;
