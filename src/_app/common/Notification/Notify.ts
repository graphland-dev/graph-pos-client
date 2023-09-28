import { ApolloError } from '@apollo/client';
import { showNotification } from '@mantine/notifications';
import { DoneIcon, ErrorIcon } from './notification.icon';

interface INotification {
	sucTitle: string;
	sucMessage?: string;
	errMessage?: string;
	onSuccess?: (res: any) => void;
	onError?: (res: any) => void;
}

export const Notify = ({
	sucTitle,
	sucMessage,
	errMessage,
	onSuccess,
	onError,
}: INotification) => {
	return {
		onCompleted: (res: any) => {
			onSuccess?.(res);
			showNotification({
				title: sucTitle,
				icon: DoneIcon,
				color: 'teal',
				message: sucMessage,
			});
		},
		onError: (err: ApolloError) => {
			onError?.(err);
			showNotification({
				title: errMessage,
				icon: ErrorIcon,
				color: 'red',
				message: err?.message,
			});
		},
	};
};
