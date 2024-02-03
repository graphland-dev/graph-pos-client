import { Role } from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import {
	Accordion,
	Button,
	Checkbox,
	Flex,
	Group,
	Skeleton,
	Space,
	Title,
} from '@mantine/core';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { CURRENT__TENANT__ROLES } from './utils/query.gql';

const appCollectionPermissions = [
	{
		name: 'Accounting',
		collections: [
			'accounting__Account',
			'accounting__Expense',
			'accounting__ExpenseCategory',
			'accounting__Payroll',
			'accounting__Transaction',
			'accounting__Transfer',
		],
	},
	{
		name: 'People',
		collections: [
			'people__Client',
			'people__Employee',
			'people__EmployeeDepartment',
			'people__EmployeeIncrement',
			'people__Supplier',
		],
	},
	{
		name: 'Inventory',
		collections: [
			'inventory__Product',
			'inventory__ProductCategory',
			'inventory__ProductPurchase',
			'inventory__ProductStock',
		],
	},
	{
		name: 'Setup',
		collections: ['setup__Brand', 'setup__Unit', 'setup__Vat'],
	},
];

interface IFormPayload {
	roles: {
		name: string;
		permissions: {
			collection: string;
			actions: string[];
		}[];
	}[];
}

const RolesPage = () => {
	const { data, loading } = useQuery(CURRENT__TENANT__ROLES);

	const { control, setValue, watch, handleSubmit } = useForm<IFormPayload>({
		defaultValues: {
			roles: [],
		},
	});

	const { fields } = useFieldArray({
		name: 'roles',
		control,
	});

	useEffect(() => {
		setValue(
			'roles',
			data?.identity__currentTenantRoles?.map((role: Role) => ({
				name: role.name,
				permissions: role.permissions,
			}))
		);
	}, [data?.identity__currentTenantRoles]);

	const handlePermissionChange = (
		roleIndex: number,
		collection: string,
		checked: boolean,
		actionName: string
	) => {
		const rolePermissions = watch(`roles.${roleIndex}.permissions`);
		const collectionIndex = rolePermissions.findIndex(
			(permission) => permission.collection === collection
		);
		if (checked) {
			setValue(
				`roles.${roleIndex}.permissions`,
				rolePermissions.map((permission, index) => {
					if (index === collectionIndex) {
						return {
							...permission,
							actions: [...permission.actions, actionName],
						};
					}
					return permission;
				})
			);
		} else {
			setValue(
				`roles.${roleIndex}.permissions`,
				rolePermissions.map((permission, index) => {
					if (index === collectionIndex) {
						return {
							...permission,
							actions: [],
						};
					}
					return permission;
				})
			);
		}
	};

	// const [] = useMutation();

	const onSubmitForm = (values: any) => {
		console.log(values);
	};

	// console.log(watch('roles'));
	return (
		<div>
			<Flex>
				<Title order={2} fw={700}>
					Roles Management
				</Title>
			</Flex>

			<Space h={'lg'} />

			{loading && (
				<>
					{new Array(12).fill(12).map(() => (
						<Skeleton h={80} radius={5} my={10} />
					))}
				</>
			)}

			<form onSubmit={handleSubmit(onSubmitForm)}>
				<Accordion defaultValue='customization' variant='contained'>
					{fields.map((role, roleIndex) => (
						<Accordion.Item value={role?.id} key={roleIndex}>
							<Accordion.Control>
								<Flex justify={'space-between'} align={'center'}>
									<Title order={4}>{role?.name} Module</Title>
									<Group position='right'>
										<Button variant='subtle' color='teal'>
											Clone
										</Button>
										<Button variant='light' color='red'>
											Delete
										</Button>
									</Group>
								</Flex>
							</Accordion.Control>
							<Space h={'xs'} />
							<Accordion.Panel>
								<div>
									{appCollectionPermissions.map((collection) => (
										<div>
											<Title order={5}>{collection.name}</Title>

											<Space h={'xs'} />

											{collection.collections.map((collectionName) => (
												<div>
													{/* {collectionName} */}
													<Flex gap={10} my={10}>
														<Checkbox
															label='*'
															value={'*'}
															onChange={(e) => {
																handlePermissionChange(
																	roleIndex,
																	collectionName,
																	e.target.checked,
																	'*'
																);
															}}
															color='teal'
															radius={0}
														/>
														<Checkbox
															label='Read'
															value={'read'}
															checked={watch(`roles.${roleIndex}.permissions`)
																.find(
																	(permission) =>
																		permission.collection === collectionName
																)
																?.actions.includes('read')}
															onChange={(e) => {
																handlePermissionChange(
																	roleIndex,
																	collectionName,
																	e.target.checked,
																	'read'
																);
															}}
															color='teal'
															radius={0}
														/>
														<Checkbox
															label='Create'
															value={'create'}
															checked={watch(`roles.${roleIndex}.permissions`)
																.find(
																	(permission) =>
																		permission.collection === collectionName
																)
																?.actions.includes('create')}
															onChange={(e) => {
																handlePermissionChange(
																	roleIndex,
																	collectionName,
																	e.target.checked,
																	'create'
																);
															}}
															color='teal'
															radius={0}
														/>
														<Checkbox
															label='Update'
															value={'update'}
															checked={
																watch(`roles.${roleIndex}.permissions`)
																	.find(
																		(permission) =>
																			permission.collection === collectionName
																	)
																	?.actions.includes('update') ||
																watch(`roles.${roleIndex}.permissions`)
																	.find(
																		(permission) =>
																			permission.collection === collectionName
																	)
																	?.actions.includes('*')
															}
															onChange={(e) => {
																handlePermissionChange(
																	roleIndex,
																	collectionName,
																	e.target.checked,
																	'update'
																);
															}}
															color='teal'
															radius={0}
														/>

														<Checkbox
															label='Delete'
															value={'delete'}
															checked={watch(`roles.${roleIndex}.permissions`)
																.find(
																	(permission) =>
																		permission.collection === collectionName
																)
																?.actions.includes('delete')}
															onChange={(e) => {
																handlePermissionChange(
																	roleIndex,
																	collectionName,
																	e.target.checked,
																	'delete'
																);
															}}
															color='teal'
															radius={0}
														/>
													</Flex>
												</div>
											))}
										</div>
									))}
								</div>
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>

				<Space h={'md'} />

				<Button type='submit'>Save</Button>
			</form>
		</div>
	);
};

export default RolesPage;
