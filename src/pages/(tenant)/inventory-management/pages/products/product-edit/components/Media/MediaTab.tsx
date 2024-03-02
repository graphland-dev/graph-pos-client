import { getFileUrl } from '@/_app/common/utils/getFileUrl';
import { ServerFileInput } from '@/_app/graphql-models/graphql';
import { useServerFile } from '@/_app/hooks/use-upload-file';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	Card,
	FileButton,
	Flex,
	Input,
	Space,
	Text,
	Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';
import { HiOutlinePhotograph } from 'react-icons/hi';
// import 'react-image-crop/dist/ReactCrop.css';
import * as Yup from 'yup';

const UploadFilesForm: React.FC = () => {
	// const { data: vendorData, loading: qLoading } = useQuery(GET_VENDOR_BY_ID, {
	// 	variables: {
	// 		id: vendorId,
	// 	},
	// 	skip: !vendorId,
	//
	// });

	const [thumbnail, setThumbnail] = useState<ServerFileInput>();
	// const [photos, setPhotos] = useState<IFile[]>(vendorData?.photos ?? []);

	const { control } = useForm({
		defaultValues: {
			photos: [
				{
					bucket: '',
					region: '',
					key: '',
				},
			],
		},
		resolver: yupResolver(UPLOAD_PHOTOS_FORM),
		mode: 'onChange',
	});

	const { append } = useFieldArray({
		control,
		name: 'photos',
	});

	// const [uploadedThumbnail, setUploadedThumbnail] =
	// 	useState<ServerFileReference>();

	const { uploadFile } = useServerFile();

	// const handleUploadFiles = (files: File[]) => {

	// 		.catch(() => {
	// 			showNotification({
	// 				title: 'Failed to upload files to server',
	// 				message: '',
	// 				color: 'red',
	// 			});
	// 		});
	// };

	// function handleDeleteFile(index: number) {
	// 	openConfirmModal({
	// 		title: 'Sure to delete this file?',
	// 		labels: {
	// 			confirm: 'Yes, delete',
	// 			cancel: 'No, keep',
	// 		},
	// 		onConfirm: () => {
	// 			const sFile = uploadedFiles[index];
	// 			deleteFiles([sFile.path as string])
	// 				.then(() => {
	// 					showNotification({
	// 						title: 'File deleted',
	// 						message: '',
	// 						color: 'green',
	// 					});
	// 					setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
	// 				})
	// 				.catch(() => {
	// 					showNotification({
	// 						title: 'Failed to delete file',
	// 						message: '',
	// 						color: 'red',
	// 					});
	// 				});
	// 		},
	// 	});
	// }

	// const { uploadFile, uploadingFile, deleteFile, deletingFile } =
	// 	useUploadFile();

	// const [updateVendorSettingsMutation, { loading }] = useMutation(
	// 	UPDATE_VENDOR_MUTATION,
	// 	Notify({
	// 		sucTitle: 'Vendor settings updated',
	// 		sucMessage: 'Vendor settings updated',
	// 	})
	// );

	// const onSubmit = () => {
	// 	updateVendorSettingsMutation({
	// 		variables: {
	// 			input: {
	// 				id: vendorId,
	// 				cover: {
	// 					key: cover?.key,
	// 					bucket: cover?.bucket,
	// 					region: cover?.region,
	// 				},
	// 				photos: photos.map((p) => ({
	// 					key: p?.key,
	// 					bucket: p?.bucket,
	// 					region: p?.region,
	// 				})),
	// 			},
	// 		},
	// 	});
	// };

	// useEffect(() => {
	// 	const photos: IFile[] = [];

	// 	setCover({
	// 		key: vendorData?.vendor?.cover?.key,
	// 		region: vendorData?.vendor?.cover?.region,
	// 		bucket: vendorData?.vendor?.cover?.bucket,
	// 	});

	// 	vendorData?.vendor?.photos?.map((photo: IFile) =>
	// 		photos.push({
	// 			key: photo.key,
	// 			region: photo.region,
	// 			bucket: photo.bucket,
	// 		})
	// 	);

	// 	setPhotos(photos);

	// 	setValue('photos', vendorData?.vendor?.photos);
	// }, [vendorData]);

	return (
		<Card title='Vendor Images' shadow='sm'>
			<Card.Section p={'xs'} withBorder>
				<Text>Upload cover and photos</Text>
			</Card.Section>
			<Space h={'lg'} />
			<Title order={4} fw={500}>
				Medias
			</Title>
			<Space h={'md'} />
			<Input.Wrapper label='Cover' size='md'>
				<Space h={5} />
				<div className='relative w-6/12 overflow-hidden bg-gray-300 rounded-md'>
					<div className='h-[200px] flex items-center justify-center'>
						{thumbnail ? (
							<img
								src={getFileUrl(thumbnail)!}
								alt='Thumbnail'
								className='object-cover object-center w-full h-52'
							/>
						) : (
							<HiOutlinePhotograph size={50} color='#FF9D40' />
						)}
					</div>
					{/* 
					<ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
						<img src={src} />
					</ReactCrop> */}

					<div className='absolute bottom-3 right-3'>
						<FileButton
							onChange={async (files) => {
								// uploadFile(file!, console.log);
								// handleUploadFiles(file!).then((file) => setThumbnail(file));
								uploadFile({
									files: [files!],
									folder: 'Inventory_Product_Thumbnail',
								}).then((res) => {
									setThumbnail(res.data);
								});
							}}
							accept='image/png,image/jpeg'
						>
							{(props) => (
								<Button
									// loading={uploading === 'PACKAGE_THUMBNAIL'}
									// color='orange'
									{...props}
								>
									<FiUpload color='#fff' size={16} />
								</Button>
							)}
						</FileButton>
					</div>
				</div>
			</Input.Wrapper>
			<Space h={'xl'} />

			<Flex justify={'space-between'} align='center'>
				<Title order={4} fw={500}>
					Upload photos
				</Title>
				<Button
					leftIcon={<IconPlus size={20} />}
					variant='light'
					onClick={() =>
						append({
							key: '',
							bucket: '',
							region: '',
						})
					}
				>
					Add new
				</Button>
			</Flex>
			<Space h={'md'} />

			<form
			// onSubmit={handleSubmit(basicInfoFormSubmit)}
			>
				{/* <div className='grid grid-cols-3 gap-3'>
					{fields.map((field, idx: number) => (
						<Input.Wrapper
							label={`Photo ${idx + 1}`}
							size='md'
							key={idx}
							// error={<ErrorMessage errors={errors} name="name" />}
						>
							<Space h={5} />
							<div className='relative bg-gray-300 rounded-md '>
								<div className='h-[200px] flex items-center justify-center'>
									{photos?.[idx] ? (
										<img
											src={getImage(photos?.[idx]!)!}
											alt='Thumbnail'
											className='object-cover object-center w-full rounded-md h-52'
										/>
									) : (
										<HiOutlinePhotograph size={50} color='#FF9D40' />
									)}
								</div>
								<div className='absolute flex gap-3 bottom-3 right-3'>
									{photos[idx]?.key && (
										<Button
											color='red'
											loading={deletingFile}
											onClick={() => {
												deleteFile(photos[idx]?.key);
												remove(idx);
												setPhotos((prev) => {
													prev.splice(idx, 1);
													return [...prev];
												});
											}}
										>
											<IconX color='#fff' size={16} />
										</Button>
									)}
									<FileButton
										onChange={(file) => {
											uploadFile(
												file!,
												`vendor-photos-${vendorId}-${idx}_${Date.now()}`
											).then((file) => {
												setPhotos((prev) => {
													prev.splice(idx, 1);
													return [...prev, file];
												});
											});
										}}
										accept='image/png,image/jpeg'
									>
										{(props) => (
											<Button {...props}>
												<FiUpload color='#fff' size={16} />
											</Button>
										)}
									</FileButton>
								</div>
							</div>
						</Input.Wrapper>
					))}
				</div>
				<Space h={'md'} />
				<div>
					<Button loading={loading} onClick={onSubmit}>
						Save
					</Button>
				</div> */}
			</form>
		</Card>
	);
};

export default UploadFilesForm;

export const UPLOAD_PHOTOS_FORM = Yup.object().shape({
	photos: Yup.array().of(
		Yup.object().shape({
			bucket: Yup.string().required(),
			key: Yup.string().required(),
			region: Yup.string().required(),
		})
	),
});
