import { MatchOperator } from '@/commons/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Textarea, Title } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
	INVENTORY_PRODUCT_CATEGORY_CREATE,
	INVENTORY_PRODUCT_CATEGORY_UPDATE,
} from '../utils/category.query';

interface ICreateAndUpdateCategoryFormProps {
	onSubmissionDone: () => void;
	operationType: 'create' | 'update';
	operationId?: string | null;
	formData?: any;
}

const CreateAndUpdateCategoryForm: React.FC<
	ICreateAndUpdateCategoryFormProps
> = ({ onSubmissionDone, operationType, operationId, formData }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			name: '',
			code: '',
			note: '',
		},
	});

	useEffect(() => {
		setValue('name', formData?.['name']);
		setValue('code', formData?.['code']);
		setValue('note', formData?.['note']);
	}, [formData]);

	const [createMutation, { loading: creating }] = useMutation(
		INVENTORY_PRODUCT_CATEGORY_CREATE
	);
	const [updateMutation, { loading: updating }] = useMutation(
		INVENTORY_PRODUCT_CATEGORY_UPDATE
	);

	const onSubmit = (data: any) => {
		if (operationType === 'create') {
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
		}

		if (operationType === 'update') {
			updateMutation({
				variables: {
					where: {
						key: '_id',
						operator: MatchOperator.Eq,
						value: operationId,
					},
					body: data,
				},
				onCompleted: (res) => {
					console.log(res);
					onSubmissionDone();
				},
				onError: (err) => console.log(err),
			});
		}
	};

	return (
		<div>
			<Title order={4}>
				<span className='capitalize'>{operationType}</span> Account
			</Title>
			<Space h={'lg'} />
			<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
				<Input.Wrapper
					withAsterisk
					error={<ErrorMessage name={'name'} errors={errors} />}
					label='Name'
				>
					<Input placeholder='Name' {...register('name')} />
				</Input.Wrapper>
				<Input.Wrapper
					withAsterisk
					error={<ErrorMessage name={'code'} errors={errors} />}
					label='Code'
				>
					<Input placeholder='Write code' {...register('code')} />
				</Input.Wrapper>
				<Textarea
					label='Note'
					{...register('note')}
					placeholder='Write your note'
				/>

				<Button loading={creating || updating} type='submit'>
					Save
				</Button>
			</form>
		</div>
	);
};

export default CreateAndUpdateCategoryForm;

const validationSchema = yup.object({
	name: yup.string().required().label('Name'),
	code: yup.string().required().label('Code'),
	note: yup.string().optional().label('Note'),
});
