import { Notify } from '@/_app/common/Notification/Notify';
import { userTenantsAtom } from '@/_app/states/user.atom';
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
	Textarea,
	Title,
	rem,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
	IOrganizationFormType,
	ORGANIZATION_OVERVIEW_FORM_VALIDATION_SCHEMA,
} from '../utils/form.validation';
import { ORGANIZATION_OVERVIEW_INFO_UPDATE_MUTATION } from '../utils/overview.query.gql';

const OrganizationOverviewPage = () => {
	const params = useParams<{ tenant: string }>();
	const [tenants] = useAtom(userTenantsAtom);
	const tenant = tenants?.find((t) => t.uid === params.tenant);

	// form initiated
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<IOrganizationFormType>({
		resolver: yupResolver(ORGANIZATION_OVERVIEW_FORM_VALIDATION_SCHEMA),
	});

	// prefill form with previous values
	useEffect(() => {
		setValue('name', tenant?.name as string);
		// @ts-ignore
		setValue('address', tenant?.address as string);
		// @ts-ignore
		setValue('businessPhoneNumber', tenant?.businessPhoneNumber as string);
		// @ts-ignore
		setValue('description', tenant?.description as string);
	}, [tenant]);

	// update mutation
	const [updateOrganizationInfo, { loading }] = useMutation(
		ORGANIZATION_OVERVIEW_INFO_UPDATE_MUTATION,
		Notify({
			sucTitle: 'Organization information updated.',
		})
	);

	// submit form with update mutation
	const onSubmit = (values: IOrganizationFormType) => {
		updateOrganizationInfo({
			variables: { input: values },
		});
	};

	return (
		<div>
			{/* <pre>{JSON.stringify(tenant, null, 2)}</pre> */}

			<Paper px={20} py={20} radius={10} className='lg:w-8/12'>
				<Title order={3}>Organization overview</Title>

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

						<Text fw={500}>Organization Logo</Text>
					</Flex>

					<Space h={'sm'} />

					<Input.Wrapper
						label='Name'
						error={<ErrorMessage name='name' errors={errors} />}
					>
						<Input placeholder='Organization name' {...register('name')} />
					</Input.Wrapper>

					<Space h={'xs'} />

					<Input.Wrapper label='Organization Uid'>
						<Input
							placeholder='Organization uid'
							disabled
							value={tenant?.uid as string}
						/>
					</Input.Wrapper>

					<Space h={'xs'} />

					<Input.Wrapper
						label='Business phone number'
						error={<ErrorMessage name='businessPhoneNumber' errors={errors} />}
					>
						<Input
							placeholder='Business phone number'
							{...register('businessPhoneNumber')}
						/>
					</Input.Wrapper>

					<Space h={'xs'} />

					<Input.Wrapper
						label='Address'
						error={<ErrorMessage name='address' errors={errors} />}
					>
						<Input placeholder='Address' {...register('address')} />
					</Input.Wrapper>

					<Space h={'xs'} />

					<Input.Wrapper
						label='Description'
						error={<ErrorMessage name='description' errors={errors} />}
					>
						<Textarea placeholder='Description' {...register('description')} />
					</Input.Wrapper>

					<Space h={'sm'} />

					<Button type='submit' loading={loading}>
						Save
					</Button>
				</form>
			</Paper>
		</div>
	);
};

export default OrganizationOverviewPage;
