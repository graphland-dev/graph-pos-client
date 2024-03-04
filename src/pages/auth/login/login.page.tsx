import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Paper, PasswordInput, Text } from '@mantine/core';
import * as yup from 'yup';

import { Notify } from '@/_app/common/Notification/Notify';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from './utils/query';

const ValidationSchema = yup.object().shape({
	email: yup.string().email().label('Email'),
	password: yup.string().required().label('Password'),
});
type IForm = yup.InferType<typeof ValidationSchema>;

const LoginPage = () => {
	const navigate = useNavigate();

	const [mutate, { loading }] = useMutation(
		LOGIN_MUTATION,
		Notify({
			sucTitle: 'Login success',
			onSuccess(res) {
				localStorage.setItem(
					'erp:accessToken',
					res.identity__login.accessToken
				);
				navigate('/select-tenant');
			},
		})
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IForm>({
		resolver: yupResolver(ValidationSchema),
	});

	const handleSubmitForm: SubmitHandler<IForm> = (payload) => {
		mutate({ variables: { input: payload } });
	};

	return (
		<div className='mx-auto my-20 md:w-4/12'>
			<Paper withBorder p={'sm'}>
				<form
					action='#'
					onSubmit={handleSubmit(handleSubmitForm)}
					className='flex flex-col gap-4'
				>
					<Input.Wrapper
						label='Email'
						error={<ErrorMessage errors={errors} name='email' />}
					>
						<Input {...register('email')} />
					</Input.Wrapper>

					<Input.Wrapper
						label='Password'
						error={<ErrorMessage errors={errors} name='password' />}
					>
						<PasswordInput {...register('password')} />
					</Input.Wrapper>

					<Button loading={loading} type='submit'>
						Login
					</Button>

					<Text>
						<Link to={'/auth/forget-password'}>Forget password?</Link>
					</Text>
				</form>
			</Paper>
		</div>
	);
};

export default LoginPage;
