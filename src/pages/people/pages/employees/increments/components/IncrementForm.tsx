import { Notify } from '@/_app/common/Notification/Notify';
import { Employee } from '@/_app/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Select, Space, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { CREATE_INCREMENT_MUTATION_QUERY } from '../utils/increment.query';

interface IIncrementFormProps {
	employees: Employee[];
	onFormSubmitted: () => void;
}
const IncrementForm: React.FC<IIncrementFormProps> = ({
	employees,
	onFormSubmitted,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		defaultValues: {
			amount: 1000,
			employeeId: '',
			note: '',
			date: new Date(),
		},
		resolver: yupResolver(formValidationSchema),
	});

	const [createIncrement, { loading: creating }] = useMutation(
		CREATE_INCREMENT_MUTATION_QUERY,
		Notify({
			sucTitle: 'Increment done!',
			onSuccess() {
				onFormSubmitted();
			},
		})
	);

	const onSubmit = (values: IINCREMENTFORM) => {
		console.log(values);

		createIncrement({
			variables: {
				body: {
					amount: values.amount,
					employeeId: values.employeeId,
					note: values.note,
				},
			},
		});
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input.Wrapper
					label='Select employee'
					error={<ErrorMessage errors={errors} name='employeeId' />}
				>
					<Select
						placeholder='Pick employee'
						disabled={!employees?.length}
						onChange={(e) => setValue('employeeId', e!)}
						data={getSelectInputData(employees as Employee[])}
					/>
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Amount'
					error={<ErrorMessage errors={errors} name='amount' />}
				>
					<Input
						type='number'
						placeholder='Write amount'
						{...register('amount')}
					/>
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Date'
					error={<ErrorMessage errors={errors} name='date' />}
				>
					<DateInput
						placeholder='Pick a date'
						defaultValue={watch('date')}
						onChange={(d) => setValue('date', d!)}
					/>
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Note'
					error={<ErrorMessage errors={errors} name='note' />}
				>
					<Textarea placeholder='Write a note...' {...register('note')} />
				</Input.Wrapper>

				<Space h={'sm'} />

				<Button type='submit' loading={creating} fullWidth>
					Save
				</Button>
			</form>
		</div>
	);
};

export default IncrementForm;

export const formValidationSchema = Yup.object().shape({
	amount: Yup.number().required().label('Amount'),
	employeeId: Yup.string().required().label('Employee id'),
	date: Yup.date().required().label('Date'),
	note: Yup.string().nullable().label('Note'),
});

interface IINCREMENTFORM {
	amount: number;
	employeeId: string;
	date: Date;
	note?: string | null | undefined;
}

const getSelectInputData = (payload: Employee[]) => {
	const data: ISelectInputData[] = [];

	payload?.map((item) =>
		data.push({
			label: item.name,
			value: item._id,
		})
	);

	return data;
};

export interface ISelectInputData {
	label: string;
	value: string;
}
