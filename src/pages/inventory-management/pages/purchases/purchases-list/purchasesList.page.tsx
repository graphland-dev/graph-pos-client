import {
	Product,
	ProductsWithPagination,
	Supplier,
	SuppliersWithPagination,
} from '@/_app/graphql-models/graphql';
import { PEOPLE_SUPPLIERS_QUERY } from '@/pages/people/pages/suppliers/utils/suppliers.query';
import { useQuery } from '@apollo/client';
import '@mantine/carousel/styles.css';
import {
	ActionIcon,
	Button,
	Flex,
	Input,
	Paper,
	Space,
	Table,
	Text,
	Textarea,
	Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useColorScheme } from '@mantine/hooks';
import {
	IconMinus,
	IconPlus,
	IconSquareCheckFilled,
	IconX,
} from '@tabler/icons-react';
import classNames from 'classnames';
import { useState } from 'react';
import { INVENTORY_PRODUCTS_LIST_QUERY } from '../../products/products-list/utils/product.query';

const PurchasesList = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [supplierId, setSupplierId] = useState<string>();

	const { data } = useQuery<{
		people__suppliers: SuppliersWithPagination;
	}>(PEOPLE_SUPPLIERS_QUERY);

	const { data: productsData } = useQuery<{
		inventory__products: ProductsWithPagination;
	}>(INVENTORY_PRODUCTS_LIST_QUERY);

	const colorScheme = useColorScheme();

	return (
		<Paper radius={10} p={10}>
			<form>
				<Flex justify={'space-between'} align={'center'}>
					<Title order={3}>Select supplier</Title>
					<Button variant='light' leftIcon={<IconPlus />}>
						Add new
					</Button>
				</Flex>

				<Space h={'md'} />

				<div className='grid grid-cols-3 gap-3'>
					{data?.people__suppliers?.nodes?.map(
						(supplier: Supplier, idx: number) => (
							<Paper
								key={idx}
								p={10}
								withBorder
								className='cursor-pointer hover:bg-slate-100 hover:duration-200 relative'
								onClick={() => setSupplierId(supplier?._id)}
							>
								{supplierId === supplier?._id && (
									<IconSquareCheckFilled
										size={20}
										className='absolute top-3 right-3'
									/>
								)}
								<Text size={'md'} fw={700}>
									Name: {supplier?.name}
								</Text>
								<Text size={'sm'}>Company name: {supplier?.companyName}</Text>
								<Text size={'sm'}>Company email: {supplier?.email}</Text>
							</Paper>
						)
					)}
				</div>

				<Space h={'md'} />

				<Flex justify={'space-between'} align={'center'}>
					<Title order={3}>Select product</Title>
					<Button variant='light' leftIcon={<IconPlus />}>
						Add new
					</Button>
				</Flex>

				<Space h={'md'} />

				<div className='grid grid-cols-3 gap-3'>
					{productsData?.inventory__products?.nodes?.map(
						(product: Product, idx: number) => (
							<Paper
								key={idx}
								p={10}
								withBorder
								className='cursor-pointer hover:bg-slate-100 hover:duration-200 relative'
								onClick={() => setProducts([...products!, product])}
							>
								{products?.includes(product) && (
									<IconSquareCheckFilled
										size={20}
										className='absolute top-3 right-3'
									/>
								)}
								<Text size={'md'} fw={700}>
									Name: {product?.name}
								</Text>
								<Text size={'sm'}>Product price: {product?.price}</Text>
								<Text size={'sm'}>Product Code: {product?.code}</Text>
							</Paper>
						)
					)}
				</div>

				<Space h={50} />

				<Table>
					<thead className='bg-slate-300'>
						<tr className='!p-2 rounded-md'>
							<th>Code</th>
							<th>Name</th>
							<th>Quantity</th>
							<th>Price</th>
							<th>Unit cost</th>
							<th>Tax</th>
							<th>Sub total</th>
							<th>Action</th>
						</tr>
					</thead>

					<tbody>
						{products?.map((product: Product, idx: number) => (
							<tr key={idx}>
								<td className='font-medium'>{product?.code}</td>
								<td className='font-medium'>{product?.name}</td>
								<td className='font-medium'>{1}</td>
								<td className='font-medium'>{product?.price}</td>
								<td className='font-medium'>{product?.unit?.name}</td>
								<td className='font-medium'>{product?.vat?.name}</td>
								<td className='font-medium'>{2012}</td>
								<td className='font-medium'>
									<ActionIcon
										variant='filled'
										color='red'
										size={'sm'}
										onClick={() => {
											setProducts((prev) => {
												prev.splice(idx, 1);
												return [...prev];
											});
										}}
									>
										<IconX size={14} />
									</ActionIcon>
								</td>
							</tr>
						))}
					</tbody>
				</Table>

				<Space h={'xl'} />

				<Input.Wrapper label='Purchase order date'>
					<DateInput placeholder='Pick a date' />
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper label='Purchase date'>
					<DateInput placeholder='Pick a date' />
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper label='Note'>
					<Textarea placeholder='Write note' />
				</Input.Wrapper>

				<Space h={'xl'} />

				<div
					// key={idx}
					className={classNames('relative p-2 my-2 rounded-sm bg-gray-100', {
						'bg-gray-100': colorScheme != 'dark',
						// 'bg-gray-800': colorScheme == 'dark',
					})}
				>
					<ActionIcon
						color='red'
						size={'sm'}
						radius={100}
						variant='filled'
						className='absolute -top-2 -right-1'
						// onClick={() => remove(idx)}
					>
						<IconMinus size={16} />
					</ActionIcon>
					<Input.Wrapper
						label='Opportunity name'
						withAsterisk
						// error={
						// 	<ErrorMessage
						// 		errors={errors}
						// 		name={`opportunities.${idx}.name`}
						// 	/>
						// }
					>
						<Input
							size='xs'
							placeholder='Write opportunity name'
							// {...register(`opportunities.${idx}.name`)}
						/>
					</Input.Wrapper>

					<Space h={'xs'} />
					<Input.Wrapper
						label='Opportunity amount'
						withAsterisk
						// error={
						// 	<ErrorMessage
						// 		errors={errors}
						// 		name={`opportunities.${idx}.amount`}
						// 	/>
						// }
					>
						<Input
							size='xs'
							type='number'
							placeholder='Write opportunity amount'
							// {...register(`opportunities.${idx}.amount`, {
							// 	valueAsNumber: true,
							// })}
						/>
					</Input.Wrapper>
				</div>
			</form>
		</Paper>
	);
};

export default PurchasesList;
