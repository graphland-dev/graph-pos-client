import {
	EmployeeDepartment,
	EmployeeDepartmentWithPagination,
	MatchOperator,
} from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Flex, Skeleton, Space, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import DepartmentCard from './components/DepartmentCard';
import DepartmentForm from './components/DepartmentForm';
import {
	GET_EMPLOYEE_DEPARTMENT,
	REMOVE_EMPLOYEE_DEPARTMENT,
} from './utils/query';

const Departments = () => {
	const [openedDrawer, drawerHandler] = useDisclosure();
	const [selectedDepartment, onSelectDepartment] =
		useState<EmployeeDepartment>();
	const [action, setAction] = useState<'CREATE' | 'EDIT'>();

	const { data, loading, refetch } = useQuery<{
		people__employeeDepartments: EmployeeDepartmentWithPagination;
	}>(GET_EMPLOYEE_DEPARTMENT);

	const [removeDepartment] = useMutation(REMOVE_EMPLOYEE_DEPARTMENT, {
		onCompleted: refetch,
	});

	return (
		<div>
			<Flex justify={'space-between'} align={'center'}>
				<Title order={2}>Employee Departments</Title>
				<Button
					leftIcon={<IconPlus size={16} />}
					onClick={() => {
						drawerHandler.open();
						setAction('CREATE');
					}}
				>
					Add new
				</Button>
			</Flex>

			<Space h={50} />

			<div className='grid grid-cols-3 gap-4'>
				{data?.people__employeeDepartments?.nodes?.map((department, idx) => (
					<DepartmentCard
						key={idx}
						drawerHandler={drawerHandler}
						onSelectDepartment={() => onSelectDepartment(department)}
						onAction={() => setAction('EDIT')}
						departmentData={department}
						onRemove={() =>
							removeDepartment({
								variables: {
									where: {
										key: '_id',
										operator: MatchOperator.Eq,
										value: department?._id,
									},
								},
							})
						}
					/>
				))}

				{loading && (
					<>
						{' '}
						{new Array(12).fill(12).map((_, idx: number) => (
							<Skeleton key={idx} h={250} radius={10} />
						))}
					</>
				)}
			</div>

			<Drawer
				opened={openedDrawer}
				onClose={() => drawerHandler.open()}
				position='right'
				title='Create or update department'
				withCloseButton={true}
			>
				<DepartmentForm
					onRefetch={() => refetch()}
					drawerHandler={drawerHandler}
					action={action as 'CREATE' | 'EDIT'}
					formData={
						selectedDepartment as {
							_id: string;
							name: string;
							note: string;
						}
					}
				/>
			</Drawer>
		</div>
	);
};

export default Departments;
