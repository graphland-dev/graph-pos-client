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

const elements = [
	{ productName: 'Product 6', price: 660, quantity: 6 },
	{ productName: 'Product 7', price: 720, quantity: 7 },
	{ productName: 'Product 39', price: 359, quantity: 9 },
	{ productName: 'Product 56', price: 576, quantity: 6 },
	{ productName: 'Product 58', price: 584, quantity: 5 },
];

const SalesPage = () => {
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

	return (
		<div>
			<Flex>
				<Title order={3}>Create Sale</Title>
			</Flex>

			<Space h={20} />

			<form action=''>
				<div className='grid grid-cols-2 gap-5'>
					<div>
						<Paper p={15} withBorder>
							<Select
								data={['Mehedi H. Rafiz', 'Md. Rayhan', 'Maruf Robins']}
								size='md'
								placeholder='Select a client'
							/>

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
								<div>
									<Select
										label='Discount Type'
										placeholder='Fixed'
										size='md'
										data={['Fixed', 'Percentage(%)']}
									/>

									<Space h={'sm'} />

									<NumberInput
										label='Transport Cost'
										size='md'
										placeholder='Enter transport cost'
									/>
								</div>
								<div>
									<NumberInput
										label='Discount'
										size='md'
										placeholder='Enter discount'
									/>

									<Space h={'sm'} />

									<Select
										label='Invoice Tax'
										placeholder='Select tax type'
										size='md'
										data={['Vat@10%', 'Vat@0']}
									/>
								</div>
							</div>

							<Space h={'sm'} />

							<div className='p-3 bg-indigo-200 rounded-sm text-xl font-bold text-center text-black'>
								Net Total: 416.42 BDT
							</div>

							<Space h={15} />

							<Group position='apart'>
								<Button size='md' leftIcon={<IconDeviceFloppy size={16} />}>
									Save
								</Button>
								<Button size='md' leftIcon={<IconCreditCard size={16} />}>
									Save & Payment
								</Button>
								<Button
									size='md'
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

					<div>
						<Paper p={15} withBorder>
							<Flex gap={8}>
								<Select
									data={['Drinks', 'Fast Food', 'Accessories', 'Dry Foods']}
									size='md'
									placeholder='Select a category'
								/>
								<Select
									data={['Drinks', 'Fast Food', 'Accessories', 'Dry Foods']}
									size='md'
									placeholder='Select a category'
								/>
							</Flex>
						</Paper>

						<Space h={20} />

						<Paper p={15} withBorder>
							<Input size='md' placeholder='Search products...' />

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
										className='rounded-md p-2 object-cover'
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
										className='rounded-md p-2 object-cover'
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
										className='rounded-md p-2 object-cover'
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
										className='rounded-md p-2 object-cover'
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
										className='rounded-md p-2 object-cover'
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
										className='rounded-md p-2 object-cover'
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
										className='rounded-md p-2 object-cover'
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
										className='rounded-md p-2 object-cover'
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

export default SalesPage;
