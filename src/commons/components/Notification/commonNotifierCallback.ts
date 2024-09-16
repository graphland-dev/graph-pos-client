import { ApolloError } from '@apollo/client';
import { showNotification } from '@mantine/notifications';
import { DoneIcon, ErrorIcon } from './notification.icon';

interface INotification {
  successTitle: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
}

export const commonNotifierCallback = ({
  successTitle,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
}: INotification) => {
  return {
    onCompleted: (res: any) => {
      onSuccess?.(res);
      showNotification({
        title: successTitle,
        icon: DoneIcon,
        color: 'teal',
        message: successMessage,
      });
    },
    onError: (err: ApolloError) => {
      onError?.(err);
      showNotification({
        title: errorMessage || err?.message,
        icon: ErrorIcon,
        color: 'red',
        message: err?.message,
      });
    },
  };
};
