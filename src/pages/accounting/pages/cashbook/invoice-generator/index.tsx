import {
	ActionIcon,
	Button,
	FileInput,
	Group,
	Input,
	Space,
	Table,
	Text,
	TextInput,
	Textarea,
	Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconX } from '@tabler/icons-react';
import React, { useState } from 'react';

const InvoiceGenerator: React.FC = () => {
	const [isDiscount, setIsDiscount] = useState(false);
	const [isTax, setIsTax] = useState(false);
	const [isShipping, setIsShipping] = useState(true);

	const [tableData, setTableData] = useState([
		{
			item: 'Item 1',
			qty: 1,
			rate: 0,
			amount: 0,
		},
	]);
	return (
		<div className='bg-white px-5 py-5 shadow-lg rounded-md'>
			<div className='lg:flex justify-between items-start'>
				<div>
					{' '}
					<FileInput
						accept='image/png,image/jpeg'
						label='Upload files'
						placeholder='Upload files'
						w={300}
					/>
				</div>
				<div>
					<Title fz={50} mb={10} fw={500}>
						Invoice
					</Title>
					<TextInput
						label='Invoice number'
						placeholder='Invoice number'
						defaultValue={'01'}
						w={300}
					/>
				</div>
			</div>
			<Space h={'lg'} />
			<div className='lg:flex !items-start justify-between'>
				<div>
					<Textarea
						label='Invoice from'
						w={410}
						placeholder='Who is this invoice from ?'
						withAsterisk
					/>
					<Space h={'sm'} />

					<div className='lg:flex justify-between'>
						<Textarea
							label='Invoice to'
							w={200}
							placeholder='Who is this invoice to ?'
							withAsterisk
						/>
						<Textarea label='Ship to' size='sm' w={200} placeholder='Ship to' />
					</div>
				</div>
				<div>
					<DateInput label='Date' placeholder='Pick a date' w={300} />
					<TextInput
						label='Payment terms'
						placeholder='Payment terms'
						w={300}
					/>
					<DateInput label='Due date' placeholder='Pick a date' w={300} />
					<TextInput label='PO number' placeholder='PO number' w={300} />
				</div>
			</div>
			<Space h={'lg'} />
			<Table withBorder={false} withColumnBorders={false}>
				<thead>
					<tr>
						<th className='w-6/12'>Item</th>
						<th>Qty</th>
						<th>Rate</th>
						<th>Amount</th>
					</tr>
				</thead>

				<tbody>
					{tableData?.map((td, idx) => (
						<tr key={idx}>
							<td>
								<TextInput
									placeholder='Item name'
									defaultValue={td?.item}
									// onChange={(e) =>
									// 	setTableData((tableData[idx]?.item = e.target.value))
									// }
								/>
							</td>
							<td>
								<Input
									type='number'
									placeholder='Quantity'
									defaultValue={td?.qty}
								/>
							</td>
							<td>
								<Input
									type='number'
									placeholder='Rate'
									defaultValue={td?.rate}
								/>
							</td>
							<td>
								<Input
									type='number'
									placeholder='Amount'
									defaultValue={td?.amount}
								/>
							</td>
						</tr>
					))}

					<Button
						variant='subtle'
						color='teal'
						onClick={() =>
							setTableData([
								...tableData,
								{
									item: `Item ${tableData?.length + 1}`,
									qty: 1,
									rate: 0,
									amount: 0,
								},
							])
						}
					>
						Add new
					</Button>
				</tbody>
			</Table>
			<Space h={'lg'} />
			<div className='lg:flex !items-start justify-between'>
				<div>
					<Textarea label='Notes' w={300} placeholder='Invoice notes...' />
					<Space h={'sm'} />
					<Textarea
						label='Terms'
						size='sm'
						w={300}
						placeholder='Invoice terms'
					/>
				</div>
				<div>
					<div className='flex items-center justify-between gap-5'>
						<Text color='gray'>Subtotal</Text>
						<Text>120</Text>
					</div>

					<Space h={'sm'} />

					{isShipping && (
						<>
							<div className='flex items-center justify-between'>
								<Text color='gray'>Shipping (OMR)</Text>

								<div className='flex items-center'>
									<Input defaultValue={0} w={100} />
									<ActionIcon
										color='red'
										size={'xs'}
										ml={5}
										onClick={() => setIsShipping(false)}
									>
										<IconX size={16} />
									</ActionIcon>
								</div>
							</div>
							<Space h={'sm'} />
						</>
					)}

					{isDiscount && (
						<>
							<div className='flex items-center justify-between'>
								<Text color='gray'>Discount (%)</Text>
								<div className='flex items-center'>
									<Input defaultValue={5} w={100} />
									<ActionIcon
										color='red'
										size={'xs'}
										ml={5}
										onClick={() => setIsDiscount(false)}
									>
										<IconX size={16} />
									</ActionIcon>
								</div>
							</div>
							<Space h={'sm'} />
						</>
					)}
					{isTax && (
						<>
							<div className='flex items-center justify-between'>
								<Text color='gray'>Tax (%)</Text>

								<div className='flex items-center'>
									<Input defaultValue={5} w={100} />
									<ActionIcon
										color='red'
										size={'xs'}
										ml={5}
										onClick={() => setIsTax(false)}
									>
										<IconX size={16} />
									</ActionIcon>
								</div>
							</div>

							<Space h={'sm'} />
						</>
					)}

					<div className='flex items-center justify-end'>
						{!isTax && (
							<Button
								size='sm'
								compact
								variant='subtle'
								color='teal'
								onClick={() => setIsTax(true)}
							>
								+ Tax
							</Button>
						)}
						{!isDiscount && (
							<Button
								size='sm'
								compact
								variant='subtle'
								color='teal'
								onClick={() => setIsDiscount(true)}
							>
								+ Discount
							</Button>
						)}

						{!isShipping && (
							<Button
								size='sm'
								compact
								variant='subtle'
								color='teal'
								onClick={() => setIsShipping(true)}
							>
								+ Shipping
							</Button>
						)}
					</div>

					<Space h={'sm'} />
					<div className='flex items-center justify-between gap-5'>
						<Text color='gray'>Total</Text>
						<Text>120</Text>
					</div>
					<Space h={'sm'} />
					<div className='flex items-center justify-between gap-5'>
						<Text color='gray'>Amount paid (OMR)</Text>
						<Input defaultValue={100} w={100} />
					</div>
					<Space h={'sm'} />
					<div className='flex items-center justify-between gap-5'>
						<Text color='gray'>Balance due</Text>
						<Text>50</Text>
					</div>
				</div>
			</div>
			<Space h={50} />
			<Group position='right'>
				<Button color='orange' variant='subtle'>
					Save as Default
				</Button>
				<Button color='teal' variant='filled'>
					Download
				</Button>
			</Group>
		</div>
	);
};

export default InvoiceGenerator;
