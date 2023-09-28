import { Button, Drawer, Flex, Space, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

const Increments = () => {
	const [openedDrawer, drawerHandler] = useDisclosure();
	const [action, setAction] = useState<'CREATE' | 'EDIT'>();

	return (
		<div>
			<Flex justify={'space-between'} align={'center'}>
				<Title order={2}>Employee Increment</Title>
				<Button
					leftIcon={<IconPlus size={16} />}
					onClick={() => {
						drawerHandler.open();
						setAction('CREATE');
					}}
				>
					Add new
				</Button>
			</Flex>

			<Space h={50} />

			<Drawer
				opened={openedDrawer}
				onClose={drawerHandler.close}
				position='right'
				title='Create or update increment'
				withCloseButton={true}
			>
				<div></div>
			</Drawer>
		</div>
	);
};

export default Increments;
