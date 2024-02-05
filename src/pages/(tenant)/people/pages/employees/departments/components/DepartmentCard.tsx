import { confirmModal } from '@/_app/common/confirm/confirm';
import { EmployeeDepartment } from '@/_app/graphql-models/graphql';
import {
	ActionIcon,
	Flex,
	Menu,
	Paper,
	Space,
	Text,
	Title,
} from '@mantine/core';
import { IconDotsVertical, IconPencil, IconTrash } from '@tabler/icons-react';
import React from 'react';

const DepartmentCard: React.FC<{
	drawerHandler: {
		open: () => void;
		close: () => void;
	};
	onRemove: () => void;
	onSelectDepartment: () => void;
	onAction: () => void;
	departmentData: EmployeeDepartment;
}> = ({
	drawerHandler,
	onSelectDepartment,
	onAction,
	departmentData,
	onRemove,
}) => {
	return (
		<Paper px={10} py={15} shadow='lg' radius={10}>
			<Flex justify={'space-between'} align={'center'}>
				<Title order={4}>{departmentData?.name}</Title>

				<Menu>
					<Menu.Target>
						<ActionIcon>
							<IconDotsVertical size={20} />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item
							icon={<IconPencil size={16} />}
							color='orange'
							onClick={() => {
								onAction();
								onSelectDepartment();
								drawerHandler.open();
							}}
						>
							Edit
						</Menu.Item>
						<Menu.Item
							icon={<IconTrash size={16} />}
							color='red'
							onClick={() =>
								confirmModal({
									title: 'Are you sure?',
									cancelLabel: 'Cencel',
									confirmLabel: 'Yes',
									isDangerous: true,
									description: 'Please proceed to delete this item.',
									onConfirm: () => onRemove(),
								})
							}
						>
							Delete
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Flex>
			<Space h={5} />

			<Text size={15}>{departmentData?.note}</Text>
		</Paper>
	);
};

export default DepartmentCard;
