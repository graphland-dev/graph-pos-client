import { Notify } from '@/_app/common/Notification/Notify';
import AttachmentUploadArea from '@/_app/common/components/AttachmentUploadArea';
import { Supplier } from '@/_app/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { Divider, Paper, Text, Title } from '@mantine/core';
import { IconBrandBadoo, IconNote } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { PEOPLE_UPDATE_SUPPLIERS } from '../utils/suppliers.query';

interface ISupplierDetailsProps {
	supplierDetails: Supplier | null;
	refetch: () => void;
}

const SupplierDetailsBasicInfo: React.FC<ISupplierDetailsProps> = ({
	supplierDetails,
	refetch,
}) => {
	// update suppliers
	const [updateSupplierWithAttachments, { loading }] = useMutation(
		PEOPLE_UPDATE_SUPPLIERS,
		Notify({
			sucTitle: 'Attachments saved successfully!',
			onSuccess() {
				refetch();
			},
		})
	);

	return (
		<>
			<Paper shadow='md' p={'lg'}>
				<div className='flex items-center justify-between gap-4'>
					<div className='flex items-center gap-4'>
						<IconNote size={24} />
						<Title order={3}>Personal Information</Title>
					</div>
				</div>
				<Divider my='sm' />
				<div className='flex flex-col w-5/12 gap-3'>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Name:
						</Title>
						<Text>{supplierDetails?.name}</Text>
					</div>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Contact number:
						</Title>
						<Text>{supplierDetails?.contactNumber}</Text>
					</div>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Company Name:
						</Title>
						<Text>{supplierDetails?.companyName}</Text>
					</div>
					<div className='flex justify-between '>
						<Title color='gray' order={4}>
							Updated Date:
						</Title>
						<Text>
							{dayjs(supplierDetails?.updatedAt).format('MMMM D, YYYY h:mm A')}
						</Text>
					</div>
					<div className='flex justify-between'>
						<Title color='gray' order={4}>
							Email:
						</Title>
						<Text>{supplierDetails?.email}</Text>
					</div>
					<div className='flex justify-between'>
						<Title color='gray' order={4}>
							Address:
						</Title>
						<Text>{supplierDetails?.address}</Text>
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
					<div className='flex justify-between'>
						<Title color='gray' order={4}>
							Appointment Date:
						</Title>
						<Text>
							{dayjs(supplierDetails?.createdAt).format('MMMM D, YYYY h:mm A')}
						</Text>
					</div>
					<div className='flex justify-between'>
						<Title color='gray' order={4}>
							Joining Date:
						</Title>
						<Text>
							{dayjs(supplierDetails?.updatedAt).format('MMMM D, YYYY h:mm A')}
						</Text>
					</div>
				</div>
			</Paper>

			{/* attachments upload area */}
			<AttachmentUploadArea
				details={supplierDetails}
				updateAttachmentsMutation={updateSupplierWithAttachments}
				updating={loading}
				folder='Graphland__Suppliers__Documents'
			/>
		</>
	);
};

export default SupplierDetailsBasicInfo;
