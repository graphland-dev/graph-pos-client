import { AccountsWithPagination } from '@/_app/graphql-models/graphql';
import { ACCOUNTING_ACCOUNTS_LIST } from '@/pages/(tenant)/accounting/pages/cashbook/accounts/utils/query';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { Button, Input, NumberInput, Select, Space } from '@mantine/core';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

interface IPaymentFormProps {}

const PaymentForm: React.FC<IPaymentFormProps> = () => {
	const { data, loading } = useQuery<{
		accounting__accounts: AccountsWithPagination;
	}>(ACCOUNTING_ACCOUNTS_LIST, {
		variables: {
			where: {
				limit: -1,
				page: 1,
			},
		},
	});

	const accountListForDrop = data?.accounting__accounts?.nodes?.map((item) => ({
		value: item?._id,
		label: `${item?.name} [${item?.referenceNumber}]`,
	}));

	const {
		handleSubmit,
		setValue,
		formState: { errors },
		control,
		watch,
	} = useForm({
		defaultValues: {
			paymentCount: [
				{
					account: '',
					amount: 0,
					paymentType: '',
				},
			],
		},
	});

	const { append, fields, remove } = useFieldArray({
		control,
		name: 'paymentCount',
	});

	const onSubmit = (values: any) => {
		console.log(values);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				{fields.map((_, idx) => (
					<div key={idx}>
						<Input.Wrapper
							label='Account'
							error={<ErrorMessage name='account' errors={errors} />}
						>
							<Select
								data={accountListForDrop ?? []}
								defaultValue={watch('account')}
								placeholder='Select account'
								onChange={(e) => setValue(`account.${idx}`, e!)}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper
							label='Payment Type'
							error={
								<ErrorMessage name={`paymentType.${idx}`} errors={errors} />
							}
						>
							<Select
								placeholder='Select account'
								data={['Nagad', 'Rocket', 'Bank', 'Cash']}
								onChange={(e) => setValue(`paymentType.${idx}`, e!)}
								defaultValue={watch(`paymentType.${idx}`)}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper
							label='Amount'
							error={<ErrorMessage name={`amount.${idx}`} errors={errors} />}
						>
							<NumberInput
								placeholder='Amount'
								onChange={(e) =>
									setValue(`amount.${idx}`, parseInt(e as string))
								}
								defaultValue={watch(`amount.${idx}`)}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Button
							variant='subtle'
							onClick={() =>
								append({
									account: '',
									paymentType: '',
									amount: 0,
								})
							}
						>
							Add new
						</Button>
					</div>
				))}
				<Space h={5} />
				<Button type='submit'>Save</Button>
			</form>
		</div>
	);
};

export default PaymentForm;
