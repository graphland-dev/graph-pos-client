import { Notify } from '@/_app/common/Notification/Notify';
import AttachmentUploadArea from '@/_app/common/components/AttachmentUploadArea';
import { Employee, EmployeeDepartment } from '@/_app/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { Divider, Drawer, Paper, Text, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconBrandBadoo, IconNote } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { employeeListRefetchSubject } from '../../employees.page';
import { PEOPLE_EMPLOYEES_UPDATE_MUTATION } from '../../utils/query';
import EmployeesForm from '../EmployeesForm';

interface IEmployeesDetailsProps {
	employeeDetails: Employee | null;
	departments: EmployeeDepartment[] | null;
	refetch: () => void;
}

interface IState {
	viewModal: boolean;
	modalOpened: boolean;
	operationType: 'create' | 'update';
	operationId?: string | null;
	operationPayload?: any;
	refetching: boolean;
}

const EmployeeDetailsBasicInfo: React.FC<IEmployeesDetailsProps> = ({
	employeeDetails,
	departments,
	refetch,
}) => {
	const [state, setState] = useSetState<IState>({
		modalOpened: false,
		viewModal: false,
		operationType: 'create',
		operationId: null,
		operationPayload: {},
		refetching: false,
	});

	// update suppliers
	const [updateEmployeeWithAttachments, { loading }] = useMutation(
		PEOPLE_EMPLOYEES_UPDATE_MUTATION,
		Notify({
			sucTitle: 'Attachments saved successfully!',
			onSuccess() {
				refetch();
			},
		})
	);

	return (
		<>
			<Drawer
				opened={state.modalOpened}
				onClose={() => setState({ modalOpened: false })}
				position='right'
				size={'80%'}
			>
				<EmployeesForm
					onSubmissionDone={() => {
						employeeListRefetchSubject.next(true);
						setState({ modalOpened: false });
					}}
					departments={departments || []}
					operationType={state.operationType}
					operationId={state.operationId}
					formData={state.operationPayload}
				/>
			</Drawer>
			<Paper shadow='md' p={'lg'}>
				<div className='flex items-center justify-between gap-4'>
					<div className='flex items-center gap-4'>
						<IconNote size={24} />
						<Title order={3}>Personal Information</Title>
					</div>
					{/* <Button
            onClick={() =>
              setState({
                modalOpened: true,
                operationType: "update",
                operationId: employeeDetails?._id,
                operationPayload: employeeDetails,
              })
            }
          >
            Edit
          </Button> */}
				</div>
				<Divider my='sm' />
				<div className='flex flex-col w-5/12 gap-3'>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Name:
						</Title>
						<Text>{employeeDetails?.name}</Text>
					</div>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Contact number:
						</Title>
						<Text>{employeeDetails?.contactNumber}</Text>
					</div>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Religion:
						</Title>
						<Text>{employeeDetails?.religion}</Text>
					</div>

					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Department name:
						</Title>
						<Text>{employeeDetails?.department?.name}</Text>
					</div>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Gender:
						</Title>
						<Text>{employeeDetails?.gender}</Text>
					</div>
					<div className='flex justify-between'>
						<Title color='gray' order={4}>
							Salary:
						</Title>
						<Text>{employeeDetails?.salary}</Text>
					</div>
					<div className='flex justify-between'>
						<Title color='gray' order={4}>
							Address:
						</Title>
						<Text>{employeeDetails?.address}</Text>
					</div>
				</div>
			</Paper>
			<Paper shadow='md' p={'lg'}>
				<div className='flex items-center justify-between gap-4'>
					<div className='flex items-center gap-4'>
						<IconBrandBadoo size={24} />
						<Title order={3}>Others</Title>
					</div>
				</div>
				<Divider my='sm' />
				<div className='flex flex-col w-5/12 gap-3'>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Designation:
						</Title>
						<Text>{employeeDetails?.designation}</Text>
					</div>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Date Of Birth:
						</Title>
						<Text>
							{dayjs(employeeDetails?.dateOfBirth).format(
								'MMMM D, YYYY h:mm A'
							)}
						</Text>
					</div>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Blood Group:
						</Title>
						<Text>{employeeDetails?.bloodGroup}</Text>
					</div>
					<div className='flex justify-between'>
						<Title color='gray' order={4}>
							Starting Salary:
						</Title>
						<Text>{employeeDetails?.startingSalary}</Text>
					</div>
					<div className='flex justify-between'>
						<Title color='gray' order={4}>
							Appointment Date:
						</Title>
						<Text>
							{dayjs(employeeDetails?.appointmentDate).format(
								'MMMM D, YYYY h:mm A'
							)}
						</Text>
					</div>
					<div className='flex justify-between'>
						<Title color='gray' order={4}>
							Joining Date:
						</Title>
						<Text>
							{dayjs(employeeDetails?.joiningDate).format(
								'MMMM D, YYYY h:mm A'
							)}
						</Text>
					</div>
				</div>
			</Paper>

			{/* attachments upload area */}
			<AttachmentUploadArea
				details={employeeDetails}
				updateAttachmentsMutation={updateEmployeeWithAttachments}
				updating={loading}
				folder='Graphland__Employee__Documents'
			/>
		</>
	);
};

export default EmployeeDetailsBasicInfo;
