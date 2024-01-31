import { Notify } from '@/_app/common/Notification/Notify';
import { userAtom } from '@/_app/states/user.atom';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	Flex,
	Input,
	Paper,
	Space,
	Text,
	Title,
	rem,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
	IProfileFormType,
	Profile__Form__Validation,
} from './utils/form.validation';
import { UPDATE_PROFILE_MUTATION } from './utils/query.gql';

const MyProfilePage = () => {
	const [user] = useAtom(userAtom);

	// form initiated
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<IProfileFormType>({
		resolver: yupResolver(Profile__Form__Validation),
	});

	// prefill form with previous values
	useEffect(() => {
		setValue('name', user?.name as string);
	}, [user]);

	// update mutation
	const [updateProfileInfo, { loading }] = useMutation(
		UPDATE_PROFILE_MUTATION,
		Notify({
			sucTitle: 'Profile information updated.',
		})
	);

	// submit form with update mutation
	const onSubmit = (values: IProfileFormType) => {
		updateProfileInfo({
			variables: {
				input: {
					name: values?.name,
					email: user?.email,
				},
			},
		});
	};

	return (
		<div>
			{/* <DashboardLayout
				navlinks={[]}
				title='My Profile Settings'
				path='My profile'
			/> */}
			<Paper
				px={20}
				py={20}
				radius={10}
				className='lg:w-6/12 mx-auto items-center place-content-center'
			>
				<Title order={3}>Basic information</Title>

				<Space h={20} />

				<form onSubmit={handleSubmit(onSubmit)}>
					<Flex align={'center'} gap={20}>
						<Dropzone
							onDrop={(files) => console.log('accepted files', files)}
							onReject={(files) => console.log('rejected files', files)}
							maxSize={5 * 1024 ** 2}
							accept={IMAGE_MIME_TYPE}
							w={100}
							h={100}
							disabled
							radius={100}
							className='flex items-center justify-center'
						>
							<IconUpload
								style={{
									width: rem(52),
									height: rem(52),
								}}
								stroke={1.5}
							/>
						</Dropzone>

						<Text fw={500}>Profile Photo</Text>
					</Flex>

					<Space h={'sm'} />

					<Input.Wrapper
						label='Name'
						error={<ErrorMessage name='name' errors={errors} />}
					>
						<Input placeholder='Organization name' {...register('name')} />
					</Input.Wrapper>

					<Space h={'xs'} />

					<Input.Wrapper label='Email'>
						<Input placeholder='Email' disabled value={user?.email as string} />
					</Input.Wrapper>

					{/* <Space h={'xs'} />

					<Input.Wrapper
						label='Description'
						error={<ErrorMessage name='description' errors={errors} />}
					>
						<Textarea placeholder='Description' {...register('description')} />
					</Input.Wrapper> */}

					<Space h={'sm'} />

					<Button type='submit' loading={loading}>
						Save
					</Button>
				</form>
			</Paper>
		</div>
	);
};

export default MyProfilePage;
