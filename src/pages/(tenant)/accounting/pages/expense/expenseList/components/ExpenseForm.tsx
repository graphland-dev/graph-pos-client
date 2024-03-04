import { Notify } from '@/_app/common/Notification/Notify';
import Attachments from '@/_app/common/components/Attachments';
import { getAccountBalance } from '@/_app/common/utils/getBalance';
import {
	Account,
	ExpenseCategory,
	ExpenseCategorysWithPagination,
	ServerFileReference,
} from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	Badge,
	Button,
	Input,
	Select,
	Space,
	Textarea,
	Title,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ACCOUNTING_EXPENSE_CATEGORY_QUERY_LIST } from '../../expenseCategory/utils/query';
import { ACCOUNTING_EXPENSE_CREATE_MUTATION } from '../utils/query';

interface IExpenseFormProps {
	onSubmissionDone: () => void;
	operationType: 'create' | 'update';
	operationId?: string | null;
	formData?: any;
	accounts?: Account[];
}

const ExpenseForm: React.FC<IExpenseFormProps> = ({
	onSubmissionDone,
	operationType,
	formData,
	accounts,
}) => {
	const [uploadedfiles, setUploadedFiles] = React.useState<
		ServerFileReference[]
	>([]);
	// const [uploadedFiles, setUploadedFiles] = React.useState<
	// 	ServerFileReference[]
	// >([]);

	const [createMutation, { loading: creating }] = useMutation(
		ACCOUNTING_EXPENSE_CREATE_MUTATION
	);
	const [, { loading: updating }] = useMutation(
		ACCOUNTING_EXPENSE_CREATE_MUTATION,
		Notify({
			sucTitle: 'Expense updated successfully',
			onSuccess() {
				onSubmissionDone();
			},
		})
	);

	const {
		register,
		setValue,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(expenseListValidationSchema),
		defaultValues: {
			purpose: '',
			note: '',
			amount: 0.0,
			voucherNo: '',
			checkNo: '',
			date: new Date().toISOString(),
			accountId: '',
		},
	});

	const accountListForDrop = accounts?.map((item) => ({
		value: item?._id,
		label: `${item?.name} [${item?.referenceNumber}]`,
	}));

	const { data } = useQuery<{
		accounting__expenseCategorys: ExpenseCategorysWithPagination;
	}>(ACCOUNTING_EXPENSE_CATEGORY_QUERY_LIST, {
		variables: {
			where: {
				limit: 10,
				page: 1,
			},
		},
	});

	const expenseCategoryList = data?.accounting__expenseCategorys?.nodes?.map(
		(item: ExpenseCategory) => ({
			value: item._id,
			label: item.name,
		})
	);

	useEffect(() => {
		setValue('purpose', formData?.['purpose']);
		setValue('accountId', formData?.['account']?._id);
		setValue('categoryId', formData?.category);
		setValue('amount', formData?.['amount']);
		setValue('note', formData?.['note']);
		setValue('voucherNo', formData?.['voucherNo']);
		setValue('checkNo', formData?.['checkNo']);
		setValue('date', formData?.['date'] || new Date().toISOString());
	}, [formData]);

	const onSubmit = (data: any) => {
		createMutation({
			variables: {
				body: { ...data, categoryId: data.categoryId },
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
				<span className='capitalize'>{operationType}</span> Expense
			</Title>
			<Space h={'lg'} />
			<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
				<Input.Wrapper
					withAsterisk
					error={<ErrorMessage name={'purpose'} errors={errors} />}
					label='Purpose'
				>
					<Input placeholder='purpose' {...register('purpose')} />
				</Input.Wrapper>
				<Input.Wrapper>
					<Select
						searchable
						withAsterisk
						onChange={(fromAccountId) =>
							setValue('accountId', fromAccountId || '')
						}
						label='Select account'
						placeholder='Select Account'
						data={accountListForDrop || []}
						value={watch('accountId')}
					/>
				</Input.Wrapper>

				{watch('accountId') && (
					<Badge p={'md'}>
						Available Balance:{' '}
						{getAccountBalance(accounts || [], watch('accountId'))}
					</Badge>
				)}
				<Input.Wrapper label='Select Expense Category'>
					<Select
						searchable
						withAsterisk
						onChange={(formCategoryId) =>
							setValue('categoryId', formCategoryId || '', {
								shouldValidate: true,
							})
						}
						placeholder='Expense Category'
						data={expenseCategoryList || []}
						value={watch('categoryId')}
					/>
				</Input.Wrapper>

				<Input.Wrapper
					withAsterisk
					error={<ErrorMessage name={'amount'} errors={errors} />}
					label='Amount'
				>
					<Input type='number' placeholder='amount' {...register('amount')} />
				</Input.Wrapper>
				<Textarea
					label='Note'
					{...register('note')}
					placeholder='Write your note'
				/>
				<Input.Wrapper
					label='Voucher Number'
					error={<ErrorMessage name={'voucherNo'} errors={errors} />}
				>
					<Input placeholder='Voucher Number' {...register('voucherNo')} />
				</Input.Wrapper>
				<Input.Wrapper
					label='Check Number'
					error={<ErrorMessage name={'checkNo'} errors={errors} />}
				>
					<Input placeholder='Check Number' {...register('checkNo')} />
				</Input.Wrapper>
				<DateTimePicker
					{...register('date')}
					value={new Date(watch('date'))}
					className='w-full'
					valueFormat='DD MMM YYYY hh:mm A'
					onChange={(e) => {
						const dateTimeValue =
							e?.toISOString() || new Date()?.toISOString() || '';
						setValue('date', dateTimeValue);
					}}
					label='Date & Time'
					placeholder='Select your date and time'
					mx='auto'
				/>

				<Attachments
					attachments={uploadedfiles}
					enableUploader
					onUploadDone={(files) => {
						setUploadedFiles(files);
					}}
					folder={'Graphland__Expense__Document'}
				/>

				<Button
					disabled={
						getAccountBalance(accounts || [], watch('accountId')) <
						watch('amount')
					}
					loading={creating || updating}
					type='submit'
				>
					Save
				</Button>
			</form>

			<Space h={'sm'} />

			{/* <AttachmentUploadArea
				details={formData}
				folder='Graphland__Expense__Document'
				updating={creating}
				updateAttachmentsMutation={createMutation}
				isGridStyle={true}
			/> */}
		</div>
	);
};

export default ExpenseForm;

const expenseListValidationSchema = yup.object({
	purpose: yup.string().required().label('Purpose'),
	note: yup.string().optional().label('Note'),
	amount: yup.number().required().label('Amount of Balance'),
	voucherNo: yup.string().optional().label('Voucher Number'),
	checkNo: yup.string().optional().label('Check Number'),
	date: yup.string().required().label('Data'),
	accountId: yup.string().required().label('Bank Name'),
	categoryId: yup.string().optional().label('Expense Category'),
});
