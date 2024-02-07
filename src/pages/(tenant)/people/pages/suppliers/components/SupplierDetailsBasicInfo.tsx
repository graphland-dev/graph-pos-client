import { Notify } from '@/_app/common/Notification/Notify';
import {
	MatchOperator,
	ServerFileReference,
	Supplier,
} from '@/_app/graphql-models/graphql';
import { useUploadFile } from '@/_app/hooks/use-upload-file';
import { useMutation } from '@apollo/client';
import {
	ActionIcon,
	Button,
	Divider,
	Group,
	Input,
	Paper,
	Space,
	Text,
	Title,
	rem,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import {
	IconBrandBadoo,
	IconDownload,
	IconFile,
	IconFiles,
	IconNote,
	IconUpload,
	IconX,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { PEOPLE_UPDATE_SUPPLIERS } from '../utils/suppliers.query';

interface ISupplierDetailsProps {
	supplierDetails: Supplier | null;
	refetch: () => void;
}

const SupplierDetailsBasicInfo: React.FC<ISupplierDetailsProps> = ({
	supplierDetails,
	refetch,
}) => {
	// attachments state
	const [attachments, setAttachments] = useState<File[] | null>([]);

	// upload file
	const { uploadFile, uploading } = useUploadFile();

	// update suppliers
	const [updateSupplierWithAttachments, { loading }] = useMutation(
		PEOPLE_UPDATE_SUPPLIERS,
		Notify({
			sucTitle: 'Attachments saved successfully!',
			onSuccess() {
				refetch();
				setAttachments([]);
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
			<Paper shadow='md' p={'lg'}>
				<div className='flex items-center justify-between gap-4'>
					<div className='flex items-center gap-4'>
						<IconFiles size={24} />
						<Title order={3}>Document Attachments</Title>
					</div>
				</div>
				<Divider my='sm' />
				<div className='grid grid-cols-2 gap-3'>
					<div>
						{supplierDetails?.attachments?.length ? (
							<>
								{supplierDetails?.attachments?.map((attachment, idx) => (
									<Paper
										shadow='md'
										p={10}
										key={idx}
										my={5}
										className='flex items-center gap-2 justify-between'
										withBorder
									>
										<div className='flex items-center gap-2'>
											<IconFile color='teal' size={24} />
											<Text fw={500} fz={'xs'} className='line-clamp-1'>
												{attachment?.path}
											</Text>
										</div>

										<ActionIcon color='blue' variant='subtle'>
											<IconDownload size={18} />
										</ActionIcon>
									</Paper>
								))}
							</>
						) : (
							<div className='flex items-center gap-2 justify-center'>
								<IconFiles color='red' size={24} />
								<Title order={5} color='red'>
									No documents found!
								</Title>
							</div>
						)}{' '}
					</div>
					<div className='border-l-[2px] border-solid  pl-5'>
						<Input.Wrapper size='md' label='Upload attachments'>
							<Dropzone
								onDrop={(files) => {
									setAttachments((prev) => [...prev!, ...files]);
								}}
								onReject={(files) => console.log('rejected files', files)}
								maxSize={5 * 1024 ** 2}
								accept={IMAGE_MIME_TYPE}
								className='flex justify-center items-center'
							>
								<div>
									<IconUpload
										style={{
											width: rem(42),
											height: rem(42),
											color: 'var(--mantine-color-blue-6)',
										}}
										color='teal'
										stroke={1.5}
									/>
								</div>
							</Dropzone>
						</Input.Wrapper>

						<Space h={'md'} />

						{Boolean(attachments?.length) && (
							<div>
								<Title order={5}>Selected files</Title>
								<Space h={5} />

								{attachments?.map((attachment: File, idx: number) => (
									<Paper
										shadow='md'
										p={10}
										key={idx}
										my={5}
										className='flex items-center gap-2 justify-between'
										withBorder
									>
										<div className='w-full flex items-center justify-between'>
											<div className='flex items-center gap-2'>
												<IconFile color='teal' size={24} />
												<Text fw={500} fz={'xs'} className='line-clamp-1'>
													{attachment?.name}
												</Text>
											</div>

											<ActionIcon
												onClick={() => {
													setAttachments((prev) => {
														prev?.splice(idx, 1);
														return [...prev!];
													});
												}}
											>
												<IconX color='red' />
											</ActionIcon>
										</div>
									</Paper>
								))}

								<Space h={'sm'} />
								<Group position='right'>
									<Button
										color='orange'
										loading={uploading || loading}
										onClick={async () => {
											const res = await uploadFile({
												files: attachments!,
												folder: 'Graphland__Suppliers__Documents',
											});
											updateSupplierWithAttachments({
												variables: {
													where: {
														key: '_id',
														operator: MatchOperator.Eq,
														value: supplierDetails?._id,
													},
													body: {
														attachments:
															[
																...(supplierDetails?.attachments?.map(
																	(att) => ({
																		meta: att?.meta,
																		path: att?.path,
																		provider: att?.provider,
																	})
																) as ServerFileReference[]),
																...(res?.data as ServerFileReference[]),
															] ?? [],
													},
												},
											});
										}}
									>
										Upload
									</Button>
								</Group>
							</div>
						)}
					</div>
				</div>
			</Paper>
		</>
	);
};

export default SupplierDetailsBasicInfo;
