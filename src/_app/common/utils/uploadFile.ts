// 'use client';

// import axios from 'axios';

// export const useUploadFile = (onChangeImg?: (state: IFile) => void) => {
// 	const { mutate: deleteFile, isLoading: deletingFile } = useMutation(
// 		(key: string) => {
// 			return axios.delete(env.NEXT_PUBLIC_STORAGE_API_URL!, {
// 				params: { key },
// 			});
// 		}
// 	);

// 	const { mutateAsync, isLoading: uploadingFile } = useMutation(
// 		async (payload: {
// 			file: File;
// 			file_name?: string;
// 			directory?: string;
// 			isUniqueKey?: boolean;
// 		}) => {
// 			const res = await axios.post(
// 				`${process.env.NEXT_PUBLIC_STORAGE_API_URL}/upload`,
// 				payload,
// 				{
// 					headers: {
// 						'Content-type': 'multipart/form-data',
// 					},
// 				}
// 			);
// 			onChangeImg?.(res.data);
// 			return res.data;
// 		}
// 	);

// 	const uploadFile = (
// 		file: File,
// 		file_name?: string,
// 		directory?: string,
// 		isUniqueKey: boolean = false
// 	): Promise<IFile> => {
// 		return new Promise((resolve, reject) => {
// 			mutateAsync({ file, file_name, directory, isUniqueKey })
// 				.then((res) => resolve(res))
// 				.catch((err) => reject(err));
// 		});
// 	};

// 	return { uploadFile, uploadingFile, deleteFile, deletingFile };
// };
