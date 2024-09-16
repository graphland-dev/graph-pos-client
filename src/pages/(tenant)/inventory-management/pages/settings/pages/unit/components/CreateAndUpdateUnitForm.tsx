import { MatchOperator, Unit } from '@/commons/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Textarea, Title } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { SETUP_CREATE_UNIT, SETUP_UPDATE_UNIT } from '../utils/units.query';

interface IAccountTransferFormProps {
	onSubmissionDone: () => void;
	operationType: 'create' | 'update';
	operationId?: string | null;
	formData?: Unit;
	units?: Unit[];
}

const TransferForm: React.FC<IAccountTransferFormProps> = ({
	onSubmissionDone,
	formData,
	operationType,
	operationId,
}) => {
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
		setValue('name', formData?.name as string);
		setValue('code', formData?.code as string);
		setValue('note', formData?.note as string);
	}, [formData]);

	// const accountListForDrop = units?.map((item) => ({
	// 	value: item?._id,
	// 	label: `${item?.name} [${item?.referenceNumber}]`,
	// }));

	const [unitCreateMutation, { loading: unitCreateLoading }] =
		useMutation(SETUP_CREATE_UNIT);

	const [unitUpdateMutation, { loading: unitUpdateLoading }] =
		useMutation(SETUP_UPDATE_UNIT);

	const onSubmit = (data: any) => {
		if (operationType === 'create') {
			unitCreateMutation({
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
			unitUpdateMutation({
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
				<span className='capitalize'>{operationType}</span> a unit
			</Title>
			<Space h={'lg'} />
			<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
				<Input.Wrapper
					label='Name'
					withAsterisk
					error={<ErrorMessage name={'name'} errors={errors} />}
				>
					<Input placeholder='Name' {...register('name')} />
				</Input.Wrapper>

				<Input.Wrapper
					label='Code'
					withAsterisk
					error={<ErrorMessage name={'code'} errors={errors} />}
				>
					<Input placeholder='Code' {...register('code')} />
				</Input.Wrapper>

				<Textarea
					label='Note'
					{...register('note')}
					placeholder='Write your note'
				/>

				<Button loading={unitUpdateLoading || unitCreateLoading} type='submit'>
					Save
				</Button>
			</form>
		</div>
	);
};

export default TransferForm;

const validationSchema = yup.object({
	name: yup.string().required().label('Name'),
	code: yup.string().required().label('Code'),
	note: yup.string().optional().label('Percentage'),
});
