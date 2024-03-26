import {
	MatchOperator,
	ProductInvoice,
	ProductInvoicesWithPagination,
} from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { Button, Group, Paper, Popover, Text } from '@mantine/core';
import React from 'react';
import { Pos_Hold_List } from '../../utils/query.pos';

const HoldList: React.FC<{
	setSelectedInvoice: (state: ProductInvoice) => void;
}> = ({ setSelectedInvoice }) => {
	// hold list data API
	const { data } = useQuery<{
		inventory__productInvoices: ProductInvoicesWithPagination;
	}>(Pos_Hold_List, {
		variables: {
			where: {
				limit: -1,
				filters: {
					key: 'status',
					operator: MatchOperator.Eq,
					value: 'HOLD',
				},
			},
		},
	});

	return (
		<div>
			<Popover position='bottom' withArrow shadow='md'>
				<Popover.Target>
					<Text color='red' className='cursor-pointer'>
						Hold List ({data?.inventory__productInvoices?.nodes?.length ?? 0})
					</Text>
				</Popover.Target>
				<Popover.Dropdown p={5}>
					{data?.inventory__productInvoices?.nodes?.map(
						(invoice: ProductInvoice, idx: number) => (
							<Paper
								p={10}
								my={5}
								className='flex items-center gap-4 justify-between'
								withBorder
								key={idx}
							>
								<div>
									<Text>{invoice?.client?.name}</Text>
								</div>
								<Group>
									<Text>{invoice?.netTotal ?? 0} bdt</Text>
									<Button
										onClick={() => setSelectedInvoice(invoice!)}
										size={'sm'}
									>
										Proceed
									</Button>
								</Group>
							</Paper>
						)
					)}
				</Popover.Dropdown>
			</Popover>
		</div>
	);
};

export default HoldList;
