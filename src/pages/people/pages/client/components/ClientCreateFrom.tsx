import { Notify } from '@/_app/common/Notification/Notify';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space } from '@mantine/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { PEOPLE_CREATE_CLIENT } from '../utils/client.query';

const ClientCreateFrom: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		defaultValues: {
			name: '',
			contactNumber: '',
			email: '',
			address: '',
		},
		resolver: yupResolver(formValidationSchema),
	});

	const [createClient, { loading: creating }] = useMutation(
		PEOPLE_CREATE_CLIENT,
		Notify({
			sucTitle: 'Client successfully created!',
			onSuccess() {
				// onFormSubmitted();
			},
		})
	);

	const onSubmit = (values: ICLIENTCREATEFORM) => {
		createClient({
			variables: {
				// body: {
				// 	amount: values.amount,
				// 	employeeId: values.employeeId,
				// 	note: values.note,
				// 	date: values.date,
				// },
			},
		});
	};
	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input.Wrapper
					label='Name'
					error={<ErrorMessage name='name' errors={errors} />}
				>
					<Input placeholder='Write client name' {...register('name')} />
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Email'
					error={<ErrorMessage name='email' errors={errors} />}
				>
					<Input placeholder='Write email' {...register('email')} />
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Contact number'
					error={<ErrorMessage name='contactNumber' errors={errors} />}
				>
					<Input
						placeholder='Write contact number'
						{...register('contactNumber')}
					/>
				</Input.Wrapper>
				<Space h={'sm'} />

				<Input.Wrapper
					label='Address'
					error={<ErrorMessage name='address' errors={errors} />}
				>
					<Input placeholder='Write address' {...register('address')} />
				</Input.Wrapper>

				<Space h={'sm'} />

				<Button type='submit'>Save</Button>
			</form>
		</div>
	);
};

export default ClientCreateFrom;

export const formValidationSchema = Yup.object().shape({
	name: Yup.string().required().label('Name'),
	contactNumber: Yup.string().required().label('Contact number'),
	email: Yup.string().email().required().label('Email'),
	address: Yup.string().required().label('Address'),
});

interface ICLIENTCREATEFORM {
	name: string;
	contactNumber: string;
	email: string;
	address: string;
}
