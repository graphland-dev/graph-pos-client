import { getFileUrl } from '@/_app/common/utils/getFileUrl';
import {
	ServerFileInput,
	ServerFileReference,
} from '@/_app/graphql-models/graphql';
import { useServerFile } from '@/_app/hooks/use-upload-file';
import { ErrorMessage } from '@hookform/error-message';
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
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconPlus, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';
import { HiOutlinePhotograph } from 'react-icons/hi';
import * as Yup from 'yup';

// import 'react-image-crop/dist/ReactCrop.css';

const MediaTab: React.FC = () => {
	const [thumbnail, setThumbnail] = useState<ServerFileInput>();
	const [galleryPhotos, setGalleryPhotos] = useState<ServerFileReference[]>([]);

	const {
		setValue,
		watch,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			gallery: [
				{
					meta: '',
					path: '',
					provider: '',
				},
			],
		},
		resolver: yupResolver(UPLOAD_PHOTOS_FORM),
		mode: 'onChange',
	});

	const { append, fields, remove } = useFieldArray({
		control,
		name: 'gallery',
	});

	// const [uploadedThumbnail, setUploadedThumbnail] =
	// 	useState<ServerFileReference>();

	const { uploadFile, deleteFiles, deleting } = useServerFile();

	function handleDeleteFile(index: number) {
		openConfirmModal({
			title: 'Sure to delete this file?',
			labels: {
				confirm: 'Yes, delete',
				cancel: 'No, keep',
			},
			onConfirm: () => {
				const sFile = galleryPhotos[index];
				deleteFiles([sFile.path as string])
					.then(() => {
						showNotification({
							title: 'File deleted',
							message: '',
							color: 'green',
						});
						setGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
						// onUploadDone?.(galleryPhotos.filter((_, i) => i !== index));
					})
					.catch(() => {
						showNotification({
							title: 'Failed to delete file',
							message: '',
							color: 'red',
						});
					});
			},
		});
	}

	// const { uploadFile, uploadingFile, deleteFile, deletingFile } =
	// 	useUploadFile();

	// const [updateVendorSettingsMutation, { loading }] = useMutation(
	// 	UPDATE_VENDOR_MUTATION,
	// 	Notify({
	// 		sucTitle: 'Vendor settings updated',
	// 		sucMessage: 'Vendor settings updated',
	// 	})
	// );

	const onSubmit = (values: any) => {
		// updateVendorSettingsMutation({
		// 	variables: {
		// 		input: {
		// 			id: vendorId,
		// 			cover: {
		// 				key: cover?.key,
		// 				bucket: cover?.bucket,
		// 				region: cover?.region,
		// 			},
		// 			photos: photos.map((p) => ({
		// 				key: p?.key,
		// 				bucket: p?.bucket,
		// 				region: p?.region,
		// 			})),
		// 		},
		// 	},
		// });
		console.log(values);
	};

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
				<Text>Upload thumbnail and gallery</Text>
			</Card.Section>
			<Space h={'lg'} />
			<Title order={4} fw={500}>
				Medias
			</Title>
			<Space h={'md'} />
			<Input.Wrapper label='Thumbnail' size='md'>
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
								uploadFile({
									files: [files!],
									folder: 'Inventory_Product_Thumbnail',
								})
									.then((res) => {
										setThumbnail(res.data[0]);
									})
									.catch(() =>
										showNotification({
											title: 'Failed to upload files to server',
											message: '',
											color: 'red',
										})
									);
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
					Upload Gallery Photos
				</Title>
				<Button
					leftIcon={<IconPlus size={20} />}
					variant='light'
					onClick={() =>
						append({
							meta: '',
							path: '',
							provider: '',
						})
					}
				>
					Add new
				</Button>
			</Flex>
			<Space h={'md'} />

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='grid grid-cols-3 gap-3'>
					{fields.map((field, idx: number) => (
						<Input.Wrapper
							label={`Photo ${idx + 1}`}
							size='md'
							key={idx}
							error={
								<ErrorMessage errors={errors} name={`gallery.${idx}.path`} />
							}
						>
							<Space h={5} />
							<div className='relative bg-gray-300 rounded-md '>
								<div className='h-[200px] flex items-center justify-center'>
									{watch(`gallery.${idx}`)?.path ? (
										<img
											src={
												getFileUrl(
													watch(`gallery.${idx}`) as ServerFileReference
												)!
											}
											alt='Thumbnail'
											className='object-cover object-center w-full rounded-md h-52'
										/>
									) : (
										<HiOutlinePhotograph size={50} color='#FF9D40' />
									)}
								</div>
								<div className='absolute flex gap-3 bottom-3 right-3'>
									<Button
										color='red'
										loading={deleting}
										onClick={() => {
											if (watch(`gallery.${idx}`)?.path) {
												handleDeleteFile(idx);
												setGalleryPhotos((prev) => {
													prev.splice(idx, 1);
													return [...prev];
												});
											}
											remove(idx);
										}}
									>
										<IconX color='#fff' size={16} />
									</Button>

									<FileButton
										onChange={async (files) => {
											uploadFile({
												files: [files!],
												folder: 'Inventory_Product_Gallery',
											})
												.then((res) => {
													setGalleryPhotos((prev) => {
														prev.splice(idx, 1);
														return [...prev, res?.data[0]];
													});
													setValue(`gallery.${idx}`, res?.data[0]);
												})
												.catch(() =>
													showNotification({
														title: 'Failed to upload files to server',
														message: '',
														color: 'red',
													})
												);
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
					<Button
						type='submit'
						// loading={loading} onClick={onSubmit}
					>
						Save
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default MediaTab;

export const UPLOAD_PHOTOS_FORM = Yup.object().shape({
	gallery: Yup.array().of(
		Yup.object().shape({
			meta: Yup.string().required(),
			path: Yup.string().required('File is not uploaded'),
			provider: Yup.string().required(),
		})
	),
});
