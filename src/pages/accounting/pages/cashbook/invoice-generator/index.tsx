import {
	Button,
	FileInput,
	Input,
	Space,
	Text,
	TextInput,
	Textarea,
	Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React, { useState } from 'react';

const InvoiceGenerator: React.FC = () => {
	const [isDiscount, setIsDiscount] = useState(false);
	const [isTax, setIsTax] = useState(false);
	const [isShipping, setIsShipping] = useState(false);

	return (
		<div className='bg-white px-3 py-5 shadow-lg rounded-md'>
			<div className='lg:flex justify-between items-center'>
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
			Table will goes to here!
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
							<div className='flex items-center justify-between gap-5'>
								<Text color='gray'>Shipping (OMR)</Text>
								<Input defaultValue={0} w={100} />
							</div>
							<Space h={'sm'} />
						</>
					)}

					{isDiscount && (
						<>
							<div className='flex items-center justify-between gap-5'>
								<Text color='gray'>Discount (%)</Text>
								<Input defaultValue={5} w={100} />
							</div>
							<Space h={'sm'} />
						</>
					)}
					{isTax && (
						<>
							<div className='flex items-center justify-between gap-5'>
								<Text color='gray'>Tax (%)</Text>
								<Input defaultValue={5} w={100} />
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
		</div>
	);
};

export default InvoiceGenerator;
