import {
	ActionIcon,
	Divider,
	Flex,
	Input,
	NumberInput,
	Paper,
	Select,
	Space,
	Table,
	Title,
} from '@mantine/core';
import { IconPlus, IconSearch, IconX } from '@tabler/icons-react';

const POSPage = () => {
	return (
		<div>
			<Title order={2}>Create Sale</Title>

			<Space h={'md'} />

			<form className='flex gap-5'>
				<div className='w-5/12'>
					<Paper radius={5} shadow='lg' withBorder>
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
									<tr>
										<td className='text-center'>Pepsi</td>
										<td className='text-center'>
											<span className='!text-xl'>৳</span>110
										</td>
										<td className='text-center'>3</td>
										<td className='text-center'>
											<span className='!text-xl'>৳</span>330
										</td>
										<td className='!text-center'>
											<ActionIcon size={'xs'} color='red' variant='filled'>
												<IconX size={16} />
											</ActionIcon>
										</td>
									</tr>
								</tbody>
							</Table>
						</div>
					</Paper>

					<Space h={'md'} />

					<Paper p={10} radius={5} shadow='lg' withBorder>
						<Flex gap={5} align={'center'}>
							<Input.Wrapper label='Discount type'>
								<Select
									size='md'
									data={['Fixed', 'Percentage (%)']}
									placeholder='Select discount type'
								/>
							</Input.Wrapper>

							<Input.Wrapper label='Discount amount'>
								<NumberInput size='md' placeholder='Discount amount' />
							</Input.Wrapper>
						</Flex>

						<Space h={'md'} />

						<Flex gap={5} align={'center'}>
							<Input.Wrapper label='Transport cost'>
								<Input
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
					</Paper>
				</div>
				<div className='w-7/12'>
					<Paper px={10} py={20} radius={5} shadow='lg' withBorder>
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
				</div>
			</form>
		</div>
	);
};

export default POSPage;
