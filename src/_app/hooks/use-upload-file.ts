import axios from 'axios';
import { useState } from 'react';

export const useUploadFile = () => {
	const [uploading, setUploading] = useState<boolean>(false);

	const uploadFile = async (body: { files: File[]; folder: string }) => {
		setUploading(true);

		const fd = new FormData();

		fd.append('folder', body.folder);

		body?.files?.map((file: File) => fd.append('files', file));

		return axios
			.post(`${import.meta.env.VITE_API_URL}/storage`, fd)
			.finally(() => setUploading(false));
	};

	return {
		uploadFile,
		uploading,
	};
};

// export const useUploadVideo = () => {
// 	const [uploadingVideo, setUploadingVideo] = useState<boolean>(false);

// 	const uploadVideo = async (body: { file: File; folder: string }) => {
// 		setUploadingVideo(true);
// 		return axios
// 			.post(import.meta.env.VITE_STORAGE_VIDEO_API, body, {
// 				headers: {
// 					'Content-Type': 'multipart/form-data',
// 				},
// 			})
// 			.finally(() => setUploadingVideo(false));
// 	};
// 	return { uploadVideo, uploadingVideo };
// };
