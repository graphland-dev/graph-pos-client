import { userAtom } from '@/_app/states/user.atom';
import { Avatar, Menu } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

const UserMenu = () => {
	const [currentUser] = useAtom(userAtom);
	function handleLogout(): void {
		openConfirmModal({
			title: 'Sure to Logout?',
			labels: {
				cancel: 'Cancel',
				confirm: 'Logout',
			},
			onConfirm: () => {
				localStorage.removeItem('erp:accessToken');
				window.location.href = '/auth/login';
			},
		});
	}

	return (
		<>
			<Menu shadow='md' width={200}>
				<Menu.Target>
					<Avatar size={'sm'} color='blue' variant='filled'>
						{currentUser?.name?.slice(0, 1)}
					</Avatar>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Label>{currentUser?.name}</Menu.Label>
					<Menu.Item component={Link} to={'/my-profile'}>
						Settings
					</Menu.Item>
					<Menu.Item onClick={handleLogout}>Logout</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</>
	);
};

export default UserMenu;
