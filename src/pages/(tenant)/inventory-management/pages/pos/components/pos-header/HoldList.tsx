import { ProductInvoice } from '@/_app/graphql-models/graphql';
import { Button, Drawer, Group, Paper, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';

const HoldList: React.FC<{
	onSelectInvoice: (state: ProductInvoice) => void;
	holdList: ProductInvoice[];
}> = ({ onSelectInvoice, holdList }) => {
	const [opened, handler] = useDisclosure();

	return (
		<div>
			<Button
				variant='subtle'
				size='xs'
				onClick={handler.open}
				color='red'
				className='cursor-pointer'
			>
				Hold List ({holdList?.length ?? 0})
			</Button>
			<Drawer
				opened={opened}
				onClose={handler.close}
				title='Hold list'
				position='right'
			>
				{holdList?.map((invoice: ProductInvoice, idx: number) => (
					<Paper
						p={10}
						my={5}
						className='flex items-center justify-between gap-4'
						withBorder
						key={idx}
					>
						<div>
							<Text>{invoice?.reference?.slice(0, 20)}</Text>
						</div>
						<Group>
							<Text>{invoice?.netTotal ?? 0} bdt</Text>
							<Button onClick={() => onSelectInvoice(invoice!)} size={'xs'}>
								Proceed
							</Button>
						</Group>
					</Paper>
				))}
			</Drawer>
		</div>
	);
};

export default HoldList;
