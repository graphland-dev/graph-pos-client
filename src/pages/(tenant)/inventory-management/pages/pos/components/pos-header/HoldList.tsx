import { ProductInvoice } from '@/_app/graphql-models/graphql';
import { Button, Drawer, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

const HoldList: React.FC<{
	onSelectInvoice: (state: ProductInvoice) => void;
	holdList: ProductInvoice[];
}> = ({ onSelectInvoice, holdList }) => {
	const [opened, handler] = useDisclosure();
	const params = useParams<{ tenant: string }>();

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
				size={'lg'}
			>
				<Table withBorder>
					<thead>
						<tr>
							<th>Client</th>
							<th>Reference</th>
							<th>Net Amount</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{holdList?.map((invoice: ProductInvoice, idx: number) => (
							<tr key={idx}>
								<td>
									<NavLink
										to={`/${params?.tenant}/people/client?clientId=${invoice?.client?._id}`}
										className='text-blue-400 underline'
									>
										{invoice?.client?.name}
									</NavLink>
								</td>
								<td>{invoice?.reference}</td>
								<td className='font-bold'>{invoice?.netTotal ?? 0} BDT</td>
								<td>
									{' '}
									<Button onClick={() => onSelectInvoice(invoice!)} size={'xs'}>
										Proceed
									</Button>
									&nbsp; &nbsp;
									<Button color='red' size={'xs'}>
										Remove
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Drawer>
		</div>
	);
};

export default HoldList;
