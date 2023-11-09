import { yupResolver } from '@hookform/resolvers/yup';
import {
	ActionIcon,
	Button,
	Divider,
	Flex,
	Group,
	Input,
	NumberInput,
	Paper,
	Select,
	Space,
	Table,
	Title,
} from '@mantine/core';
import {
	IconCreditCard,
	IconCurrencyTaka,
	IconDeviceFloppy,
	IconPlus,
	IconRefresh,
	IconSearch,
	IconX,
} from '@tabler/icons-react';
import { useFieldArray, useForm } from 'react-hook-form';
import ProductItemCard from './components/ProductItemCard';
import {
	IPOSCreateSaleFormState,
	POS_Create_Sale_Form_Validation,
} from './utils/form.pos.validation';

const POSPage = () => {
	const {
		// register: pos__register,
		control: products__control,
		// setValue: pos__setValaue,
		handleSubmit: submitForm,
		watch,
		// formState: { errors },
		reset: reset__form,
	} = useForm<IPOSCreateSaleFormState>({
		resolver: yupResolver(POS_Create_Sale_Form_Validation),
	});

	const {
		append: add__product,
		fields: productFields,
		remove: remove__products,
	} = useFieldArray({
		control: products__control,
		name: 'products',
	});

	const handleAddItemToTable = (name: string) => {
		const isItemExistInTable = watch('products')?.find((p) => p.name === name);

		if (isItemExistInTable) {
			// add__product({
			// 	name: `Products ${watch('products').length + 1}`,
			// 	price: 120,
			// 	quantity: 1,
			// });
		} else {
			add__product({
				name: `Products ${watch('products').length + 1}`,
				price: 120,
				quantity: 1,
			});
		}
	};

	const onSubmit = (v: IPOSCreateSaleFormState) => {
		console.log(v);
	};
	return (
		<div>
			<Title order={2}>Create Sale</Title>

			<Space h={'md'} />

			<form className='flex gap-5' onSubmit={submitForm(onSubmit)}>
				<div className='w-5/12'>
					<Paper radius={5} withBorder>
						<Flex p={7} align={'center'} gap={5}>
							<Select
								size='md'
								className='w-full'
								data={['Mehedi', 'Rafiz', 'Hasan']}
								placeholder='Select a client '
							/>
							<ActionIcon size={'sm'} variant='filled' color='blue'>
								<IconPlus />
							</ActionIcon>
						</Flex>

						<Space h={'sm'} />

						<Divider />

						<Space h={'sm'} />
						<div className='p-[7px]'>
							<Table withColumnBorders withBorder>
								<thead className='bg-blue-100'>
									<th className='p-2'>Product</th>
									<th className='p-2'>Price</th>
									<th className='p-2'>Quantity</th>
									<th className='p-2'>Subtotal</th>
									<th className='p-2'>Action</th>
								</thead>

								<tbody>
									{productFields?.map((field, idx: number) => (
										<tr key={idx}>
											<td className='text-center'>{field?.name}</td>
											<td className='text-center'>
												<span className='!text-xl'>৳</span>
												{field?.price}
											</td>
											<td className='text-center'>3</td>
											<td className='text-center'>
												<span className='!text-xl'>৳</span>
												{field?.quantity * field?.price}
											</td>
											<td className='!text-center'>
												<ActionIcon
													size={'xs'}
													color='red'
													variant='filled'
													onClick={() => remove__products(idx)}
												>
													<IconX size={16} />
												</ActionIcon>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div>
					</Paper>

					<Space h={'md'} />

					<Paper radius={5} withBorder>
						<div className='p-[10px]'>
							<Flex gap={5} align={'center'}>
								<Input.Wrapper label='Discount type'>
									<Select
										size='md'
										data={['Fixed', 'Percentage (%)']}
										placeholder='Select discount type'
									/>
								</Input.Wrapper>

								<Input.Wrapper label='Discount amount'>
									<NumberInput
										min={0}
										size='md'
										placeholder='Discount amount'
									/>
								</Input.Wrapper>
							</Flex>

							<Space h={'md'} />

							<Flex gap={5} align={'center'}>
								<Input.Wrapper label='Transport cost'>
									<NumberInput
										min={0}
										size='md'
										className='w-full'
										placeholder='Write transport cost'
									/>
								</Input.Wrapper>

								<Input.Wrapper label='Invoice tax'>
									<Select
										size='md'
										className='w-full'
										data={['Vat 10%', 'Vat 30%']}
										placeholder='Select vat profile'
									/>
								</Input.Wrapper>
							</Flex>
						</div>
						<div className='p-2 rounded-sm bg-blue-200 text-center'>
							<Title
								order={2}
								fw={500}
								className='flex items-center justify-center'
							>
								Net Total: <IconCurrencyTaka size={30} /> 0
							</Title>
						</div>
					</Paper>

					<Space h={'sm'} />
					<Group position='center' spacing={12}>
						<Button
							color='teal'
							leftIcon={<IconDeviceFloppy size={20} />}
							type='submit'
						>
							Save
						</Button>
						<Button color='violet' leftIcon={<IconCreditCard size={20} />}>
							Save & Payment
						</Button>
						<Button
							color='red'
							type='reset'
							leftIcon={<IconRefresh size={20} />}
							onClick={() => reset__form()}
						>
							Reset
						</Button>
					</Group>
				</div>

				{/* second block  */}
				<div className='w-7/12'>
					<Paper px={10} py={20} radius={5} withBorder>
						<Flex gap={10} align={'center'}>
							<Select
								size='md'
								className='w-full'
								data={['Cat 1', 'Cat 2', 'Cat 3']}
								placeholder='Select category'
							/>

							<Select
								size='md'
								className='w-full'
								data={['Cat 1', 'Cat 2', 'Cat 3']}
								placeholder='Select category'
							/>
						</Flex>

						<Space h={'sm'} />

						<Flex align={'center'} gap={5}>
							<Input
								className='w-full'
								size='md'
								type='search'
								icon={<IconSearch />}
								placeholder='Search...'
							/>
							<ActionIcon size={'sm'} variant='filled' color='blue'>
								<IconPlus />
							</ActionIcon>
						</Flex>
					</Paper>

					<Space h={'md'} />

					<Paper p={10} radius={10} withBorder>
						<div className='grid grid-cols-4 gap-2'>
							{new Array(12).fill(12).map((_, idx) => (
								<ProductItemCard
									key={idx}
									handleAddItem={() => handleAddItemToTable('Sports Cads')}
								/>
							))}{' '}
						</div>
					</Paper>
				</div>
			</form>
		</div>
	);
};

export default POSPage;
