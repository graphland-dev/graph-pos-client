import { Notify } from '@/_app/common/Notification/Notify';
import { getAccountBalance } from '@/_app/common/utils/getBalance';
import { Account, AccountsWithPagination } from '@/_app/graphql-models/graphql';
import { ACCOUNTING_ACCOUNTS_LIST } from '@/pages/(tenant)/accounting/pages/cashbook/accounts/utils/query';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import {
	Badge,
	Button,
	Group,
	Input,
	NumberInput,
	Paper,
	Select,
	Space,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
	Create_Invoice_Payment,
	Create_Product_Invoice,
} from '../../utils/query.payment';

interface IPaymentFormProps {
	formData: any;
	onSuccess: () => void;
	invoiceId?: string;
}

const PaymentForm: React.FC<IPaymentFormProps> = ({
	formData,
	onSuccess,
	invoiceId,
}) => {
	const [formValues, setFormValues] = useState<any>();

	// accounts API
	const { data } = useQuery<{
		accounting__accounts: AccountsWithPagination;
	}>(ACCOUNTING_ACCOUNTS_LIST, {
		variables: {
			where: {
				limit: -1,
				page: 1,
			},
		},
	});

	// accounts data dropdown
	const accountListForDrop = data?.accounting__accounts?.nodes?.map((item) => ({
		value: item?._id,
		label: `${item?.name} [${item?.referenceNumber}]`,
	}));

	// payment form
	const {
		handleSubmit,
		setValue,
		formState: { errors },
		control,
		register,
		watch,
		reset,
	} = useForm({
		defaultValues: {
			paymentCount: [
				{
					accountId: '',
					amount: 0,
					type: '',
					receiptNo: '',
					paymentTerm: '',
					reference: '',
					poReference: '',
					date: new Date(),
				},
			],
		},
	});

	// form fields array
	const { append, fields, remove } = useFieldArray({
		control,
		name: 'paymentCount',
	});

	// payment mutation
	const [paymentToInvoice, { loading: __payment__inprogress }] = useMutation(
		Create_Invoice_Payment,
		Notify({
			sucTitle: 'Payment successful',
			onSuccess() {
				onSuccess();
				reset({
					paymentCount: [],
				});
			},
		})
	);

	// create invoice mutation
	const [createInvoice, { loading: __creatingInvoice }] = useMutation(
		Create_Product_Invoice,
		{
			onCompleted(res) {
				paymentToInvoice({
					variables: {
						body: {
							clientId: formData?.client,
							invoiceId: invoiceId ?? res?.inventory__createProductInvoice?._id,
							payments: formValues?.paymentCount,
							poReference: null,
							receptNo: null,
							reference: null,
							paymentTerm: null,
							date: null,
						},
					},
				});
			},
		}
	);

	useEffect(() => {
		setValue(`paymentCount.${0}.amount`, formData?.netTotal);
	}, [formData]);

	// payment form submit
	const onSubmit = (values: any) => {
		if (invoiceId) {
			paymentToInvoice({
				variables: {
					body: {
						clientId: formData?.client,
						invoiceId: invoiceId,
						payments: values?.paymentCount,
						poReference: null,
						receptNo: null,
						reference: null,
						paymentTerm: null,
						date: null,
					},
				},
			});
		} else {
			setFormValues(values);

			createInvoice({
				variables: {
					input: {
						clientId: formData?.client,
						note: 'A simple note',
						products: formData?.products,
						taxRate: formData?.invoiceTax,
						taxAmount: formData?.taxAmount,
						costAmount: formData?.transportCost,
						subTotal: formData?.subTotal,
						netTotal: formData?.netTotal,
						reference: 'Payment',
					},
				},
			});
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				{fields.map((_, idx) => (
					<Paper key={idx} className='relative' p={10} my={10} withBorder>
						<Input.Wrapper
							label='Account'
							error={
								<ErrorMessage
									name={`paymentCount.${idx}.account`}
									errors={errors}
								/>
							}
						>
							<Select
								data={accountListForDrop ?? []}
								defaultValue={watch(`paymentCount.${idx}.accountId`)}
								placeholder='Select account'
								onChange={(e) => setValue(`paymentCount.${idx}.accountId`, e!)}
							/>
							{/* <Space h={5} /> */}
							{watch(`paymentCount.${idx}.accountId`) && (
								<Badge my={5}>
									Balance:{' '}
									{getAccountBalance(
										data?.accounting__accounts?.nodes as Account[],
										watch(`paymentCount.${idx}.accountId`)
									)}
								</Badge>
							)}
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper
							label='Payment Type'
							error={
								<ErrorMessage
									name={`paymentCount.${idx}.paymentType`}
									errors={errors}
								/>
							}
						>
							<Select
								placeholder='Pick a payment type'
								data={['Nagad', 'Rocket', 'Bank', 'Cash']}
								onChange={(e) => setValue(`paymentCount.${idx}.type`, e!)}
								defaultValue={watch(`paymentCount.${idx}.type`)}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper
							label='Amount'
							error={
								<ErrorMessage
									name={`paymentCount.${idx}.amount`}
									errors={errors}
								/>
							}
						>
							<NumberInput
								placeholder='Amount'
								onChange={(e) =>
									setValue(`paymentCount.${idx}.amount`, parseInt(e as string))
								}
								value={watch(`paymentCount.${idx}.amount`)}
								min={0}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper
							label='Reference'
							error={
								<ErrorMessage
									name={`paymentCount.${idx}.reference`}
									errors={errors}
								/>
							}
						>
							<Input
								placeholder='Reference'
								{...register(`paymentCount.${idx}.reference`)}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper
							label='PO Reference'
							error={
								<ErrorMessage
									name={`paymentCount.${idx}.poReference`}
									errors={errors}
								/>
							}
						>
							<Input
								placeholder='PO Reference'
								{...register(`paymentCount.${idx}.poReference`)}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper
							label='Receipt No'
							error={
								<ErrorMessage
									name={`paymentCount.${idx}.receiptNo`}
									errors={errors}
								/>
							}
						>
							<Input
								placeholder='Receipt no'
								{...register(`paymentCount.${idx}.receiptNo`)}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper
							label='Payment Term'
							error={
								<ErrorMessage
									name={`paymentCount.${idx}.paymentTerm`}
									errors={errors}
								/>
							}
						>
							<Input
								placeholder='Payment Term'
								{...register(`paymentCount.${idx}.paymentTerm`)}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper
							label='Date'
							error={
								<ErrorMessage
									name={`paymentCount.${idx}.date`}
									errors={errors}
								/>
							}
						>
							<DateInput
								placeholder='Pick a Date'
								onChange={(e) => setValue(`paymentCount.${idx}.date`, e!)}
								defaultValue={watch(`paymentCount.${idx}.date`)}
							/>
						</Input.Wrapper>

						<Space h={10} />

						<Group position='right'>
							<Button color='red' onClick={() => remove(idx)} size='xs'>
								Remove
							</Button>
						</Group>
					</Paper>
				))}

				<Space h={5} />

				<Group position='left'>
					<Button
						variant='subtle'
						onClick={() =>
							append({
								accountId: '',
								type: '',
								amount: 0,
								date: new Date(),
								poReference: '',
								reference: '',
								paymentTerm: '',
								receiptNo: '',
							})
						}
					>
						Add new
					</Button>
					<Button
						type='submit'
						loading={__creatingInvoice || __payment__inprogress}
					>
						Save
					</Button>
				</Group>
			</form>
		</div>
	);
};

export default PaymentForm;
