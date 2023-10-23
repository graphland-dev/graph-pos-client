import {
	CreateProductPurchaseInput,
	Product,
	ProductTaxType,
	ProductsWithPagination,
	PurchaseProductItemInput,
	Supplier,
	SuppliersWithPagination,
} from '@/_app/graphql-models/graphql';
import { PEOPLE_SUPPLIERS_QUERY } from '@/pages/people/pages/suppliers/utils/suppliers.query';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import {
	ActionIcon,
	Anchor,
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
import { IconPlus, IconSquareCheckFilled, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { calculateTaxAmount, getTotalTaxAmount } from './utils/helpers';
import { PURCHASE_PRODUCT_LIST } from './utils/products.query';

const PurchasesList = () => {
	const [supplierId, setSupplierId] = useState<string>();

	const { data } = useQuery<{
		people__suppliers: SuppliersWithPagination;
	}>(PEOPLE_SUPPLIERS_QUERY);

	const { data: productsData } = useQuery<{
		inventory__products: ProductsWithPagination;
	}>(PURCHASE_PRODUCT_LIST);

	const {
		register,
		setValue,
		formState: { errors },
		control,
		watch,
	} = useForm<CreateProductPurchaseInput>({
		defaultValues: {
			purchaseDate: new Date(),
			purchaseOrderDate: new Date(),
			note: '',
			products: [],
			costs: [],
		},
	});

	const {
		append: appendProduct,
		fields: productFields,
		remove: removeProduct,
	} = useFieldArray({
		name: 'products',
		control,
	});

	//
	function handleAddProductToList(product: Product) {
		const price = product?.price || 0;
		const percentage = product.vat?.percentage || 0;

		// Check the product is already exits in productsFields
		const locationIndex = productFields.findIndex(
			(p) => p?.referenceId === product?._id
		);
		if (locationIndex == -1) {
			appendProduct({
				name: product.name,
				referenceId: product._id,
				quantity: 1,
				subAmount: price,
				unitPrice: price,
				netAmount: 0,
				taxAmount: (price * percentage) / 100,
				taxRate: product.vat?.percentage || 0,
				taxType: ProductTaxType.Inclusive,
			});
		} else {
			setValue(
				`products.${locationIndex}.quantity`,
				watch(`products.${locationIndex}.quantity`) + 1
			);
		}
	}

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
								className='relative cursor-pointer hover:bg-slate-100 hover:duration-200'
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

				<Flex justify={'space-between'} align={'center'} mt={'lg'}>
					<Title order={4}>Select product</Title>
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
								className='relative cursor-pointer hover:bg-slate-100 hover:duration-200'
								onClick={() => {
									handleAddProductToList(product);
								}}
							>
								{productFields.findIndex(
									(p) => p.referenceId === product?._id
								) != -1 && (
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
				<Space h={10} />
				<Anchor>Load More</Anchor>

				<Space h={50} />

				{/* <pre>{JSON.stringify(watch(`products`), undefined, 2)}</pre> */}

				{Boolean(productFields?.length) && (
					<>
						{' '}
						<Table withBorder withColumnBorders>
							<thead className='bg-slate-300'>
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
									(product: PurchaseProductItemInput, idx: number) => (
										<tr key={idx}>
											<td className='font-medium'>{product?.name}</td>
											<td className='font-medium'>
												<Input
													w={65}
													{...register(`products.${idx}.quantity`, {
														valueAsNumber: true,
													})}
												/>
											</td>
											<td className='font-medium'>
												<Input
													w={65}
													{...register(`products.${idx}.unitPrice`, {
														valueAsNumber: true,
													})}
												/>
											</td>
											<td className='font-medium text-center'>
												{watch(`products.${idx}.quantity`) *
													watch(`products.${idx}.unitPrice`)}
											</td>
											<td className='font-medium'>{product?.taxRate || 0}</td>
											<td className='font-medium'>
												{calculateTaxAmount(watch(`products.${idx}`))}
											</td>
											<td className='font-medium'>
												{calculateTaxAmount(watch(`products.${idx}`)) +
													watch(`products.${idx}.quantity`) *
														watch(`products.${idx}.unitPrice`)}
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

								<tr className='bg-green-50'>
									<td colSpan={5} className='font-semibold text-right'>
										Total
									</td>
									<td>{getTotalTaxAmount(watch('products') || [])}</td>
									<td>12</td>
									<td></td>
								</tr>
							</tbody>
						</Table>
						<Space h={50} />
					</>
				)}

				<Input.Wrapper
					label='Purchase order date'
					error={<ErrorMessage errors={errors} name={`purchaseOrderDate`} />}
				>
					<DateInput
						onChange={(d) => setValue('purchaseOrderDate', d!)}
						placeholder='Pick a date'
					/>
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Purchase date'
					error={<ErrorMessage errors={errors} name={`purchaseDate`} />}
				>
					<DateInput
						onChange={(d) => setValue('purchaseDate', d!)}
						placeholder='Pick a date'
					/>
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Note'
					error={<ErrorMessage errors={errors} name={`note`} />}
				>
					<Textarea {...register('note')} placeholder='Write note' />
				</Input.Wrapper>

				<Space h={'xl'} />

				{/* {fields?.map((_, idx) => (
          <div
            key={idx}
            className={classNames(
              "relative p-2 mt-5 mb-2 rounded-sm bg-gray-100",
              {
                "bg-gray-100": colorScheme != "dark",
                // 'bg-gray-800': colorScheme == 'dark',
              }
            )}
          >
            <ActionIcon
              color="red"
              size={"sm"}
              radius={100}
              variant="filled"
              className="absolute -top-2 -right-1"
              onClick={() => remove(idx)}
            >
              <IconMinus size={16} />
            </ActionIcon>
            <Input.Wrapper
              label="Opportunity name"
              withAsterisk
              error={
                <ErrorMessage
                  errors={errors}
                  name={`opportunities.${idx}.name`}
                />
              }
            >
              <Input
                size="xs"
                placeholder="Write opportunity name"
                {...register(`opportunities.${idx}.name`)}
              />
            </Input.Wrapper>

            <Space h={"xs"} />
            <Input.Wrapper
              label="Opportunity amount"
              withAsterisk
              error={
                <ErrorMessage
                  errors={errors}
                  name={`opportunities.${idx}.amount`}
                />
              }
            >
              <Input
                size="xs"
                type="number"
                placeholder="Write opportunity amount"
                {...register(`opportunities.${idx}.amount`, {
                  valueAsNumber: true,
                })}
              />
            </Input.Wrapper>
          </div>
        ))} */}

				{/* <Button
          variant="subtle"
          onClick={() =>
            append({
              amount: "",
              name: "",
            })
          }
        >
          Add new
        </Button> */}
			</form>
		</Paper>
	);
};

export default PurchasesList;
