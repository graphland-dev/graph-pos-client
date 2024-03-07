import { Notify } from '@/_app/common/Notification/Notify';
import { ClientsWithPagination } from '@/_app/graphql-models/graphql';
import { PEOPLE_CREATE_CLIENT } from '@/pages/(tenant)/people/pages/client/utils/client.query';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	ActionIcon,
	Autocomplete,
	Button,
	Drawer,
	Flex,
	Input,
	Space,
	Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Pos_Client_Query } from '../query.pos';

const ClientSelectArea: React.FC<{
	formInstance: any;
	contactNumber: string;
	// onRefetch: () => void;
}> = ({ formInstance, contactNumber }) => {
	const [opened, handler] = useDisclosure();

	// client query
	const {
		data,
		loading: loadingClients,
		refetch,
	} = useQuery<{
		people__clients: ClientsWithPagination;
	}>(Pos_Client_Query);

	// client form instance
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<ClientFormType>({
		resolver: yupResolver(
			Yup.object().shape({
				name: Yup.string().required().label('Name'),
				contactNumber: Yup.string().required().label('Contact Number'),
				email: Yup.string().optional().nullable().email().label('Email'),
			})
		),
	});

	// fill form
	useEffect(() => {
		setValue('contactNumber', contactNumber);
	}, [contactNumber]);

	// client create mutation
	const [createClient, { loading: creatingClient }] = useMutation(
		PEOPLE_CREATE_CLIENT,
		Notify({
			sucTitle: 'Client created',
			onSuccess: () => {
				refetch();
				reset({
					name: '',
					email: '',
					contactNumber: '',
				});
				formInstance.setValue('client', watch('contactNumber'));
				handler.close();
			},
		})
	);

	// client form submit
	const onSubmitClientForm = (values: ClientFormType) => {
		createClient({
			variables: { body: values },
		});
	};

	return (
		<div>
			<Input.Wrapper
				size='md'
				error={
					<ErrorMessage name='client' errors={formInstance.formState.errors} />
				}
			>
				<Flex align={'center'} gap={5}>
					<Autocomplete
						size='md'
						className='w-full'
						disabled={loadingClients}
						data={getClientSelectInputData(data?.people__clients?.nodes)}
						placeholder='Select a client '
						onChange={(clientEvent) =>
							formInstance.setValue('client', clientEvent)
						}
						// defaultValue={watch('client')}
						nothingFound={
							<div>
								<Text>No client with {formInstance.watch('client')}</Text>
								<Space h={5} />
								<Button onClick={handler.open} compact>
									Enter to create
								</Button>
							</div>
						}
					/>

					<ActionIcon
						size={'xl'}
						variant='filled'
						color='blue'
						onClick={handler.open}
					>
						<IconPlus />
					</ActionIcon>
				</Flex>
			</Input.Wrapper>

			<Drawer onClose={handler.close} opened={opened} title='Create client'>
				<form onSubmit={handleSubmit(onSubmitClientForm)}>
					<Input.Wrapper
						label='Name'
						error={<ErrorMessage name='name' errors={errors} />}
					>
						<Input placeholder='Name' {...register('name')} />
					</Input.Wrapper>

					<Space h={'sm'} />

					<Input.Wrapper
						label='Contact Number'
						error={<ErrorMessage name='contactNumber' errors={errors} />}
					>
						<Input
							placeholder='Contact number'
							{...register('contactNumber')}
							defaultValue={watch('contactNumber')}
						/>
					</Input.Wrapper>

					<Space h={'sm'} />

					<Input.Wrapper
						label='Email'
						error={<ErrorMessage name='email' errors={errors} />}
					>
						<Input placeholder='Email' {...register('email')} />
					</Input.Wrapper>

					<Space h={'sm'} />

					<Button type='submit' loading={creatingClient}>
						Create
					</Button>
				</form>
			</Drawer>
		</div>
	);
};

export default ClientSelectArea;

interface ClientFormType {
	name: string;
	email?: string | undefined | null;
	contactNumber: string;
}

const getClientSelectInputData = (data: any) => {
	const clients: any = [];

	data?.map((d: any) =>
		clients.push({
			label: d.name,
			value: d.contactNumber,
		})
	);

	return clients;
};
