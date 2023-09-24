import { Account } from '@/_app/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Button, Input, Select, Space, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { TRANSACTION_CREATE_MUTATION } from '../utils/query';

interface BalanceAdjustmentFormProps {
	onSubmissionDone: () => void;
	// operationType: 'create' | 'update';
	// operationId?: string | null;
	// formData?: any;
	accounts?: Account[];
}

const BalanceAdjustmentForm: React.FC<BalanceAdjustmentFormProps> = ({
	onSubmissionDone,
	accounts,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
	} = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			accountId: '',
			amount: 0,
			type: '',
		},
	});

	const accountListForDrop = accounts?.map((item) => ({
		value: item?._id,
		label: `${item?.name} [${item?.referenceNumber}]`,
	}));

	const getAccountBalance = (
		accounts: Account[],
		accountId: string
	): number => {
		const account = accounts.find((a) => a._id === accountId);
		return (account?.creditAmount || 0) - (account?.debitAmount || 0);
	};

	const [createMutation, { loading: creating }] = useMutation(
		TRANSACTION_CREATE_MUTATION
	);

	const onSubmit = (data: any) => {
		createMutation({
			variables: {
				body: data,
			},
			onCompleted: (res) => {
				console.log(res);
				onSubmissionDone();
			},
			onError: (err) => console.log(err),
		});
	};

	return (
		<div>
			<Title order={4}>
				<span className='capitalize'>{'Create transaction'}</span>
			</Title>
			<Space h={'lg'} />
			<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
				<Select
					searchable
					withAsterisk
					onChange={(fromAccountId) =>
						setValue('accountId', fromAccountId || '')
					}
					label='Select account'
					placeholder='Select cccount'
					data={accountListForDrop || []}
					value={watch('accountId')}
				/>

				{watch('accountId') && (
					<Badge p={'md'}>
						Available Balance:{' '}
						{getAccountBalance(accounts || [], watch('accountId'))}
					</Badge>
				)}

				<Input.Wrapper
					label='Action type'
					withAsterisk
					error={<ErrorMessage name={'type'} errors={errors} />}
				>
					<Select
						data={[
							{
								label: 'Add Balance',
								value: 'CREDIT',
							},
							{
								label: 'Remove Balance',
								value: 'DEBIT',
							},
						]}
						placeholder='Pick action'
						onChange={(type) => setValue('type', type!)}
					/>
				</Input.Wrapper>

				<Input.Wrapper
					withAsterisk
					error={<ErrorMessage name={'amount'} errors={errors} />}
					label='Amount'
				>
					<Input placeholder='Amount' type='number' {...register('amount')} />
				</Input.Wrapper>

				<Button
					loading={creating}
					type='submit'
					disabled={
						watch('type') === 'DEBIT' &&
						getAccountBalance(accounts || [], watch('accountId')) <
							watch('amount')
					}
				>
					Save
				</Button>
			</form>
		</div>
	);
};

export default BalanceAdjustmentForm;

const validationSchema = yup.object({
	accountId: yup.string().required().label('Bank Name'),
	type: yup.string().required().label(''),
	amount: yup.number().required().label('Amount of Balance'),
});
