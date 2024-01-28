import { PurchaseProductItemReference } from '@/_app/graphql-models/graphql';
import { Flex, Paper, Text } from '@mantine/core';
import React from 'react';

const PurchaseItemsShowCase: React.FC<{
	items: PurchaseProductItemReference[];
}> = ({ items }) => {
	return (
		<div>
			{/* <Title order={3}>Purchase items</Title>
			<Space h={'md'} /> */}

			{items?.map((item, idx) => (
				<Paper key={idx} py={10} px={15} radius={5} withBorder my={5}>
					<Flex justify={'space-between'} align={'center'}>
						<Flex gap={8} align={'center'}>
							<Text fw={500}>{item?.name}</Text> -
							<Text fw={500}>{item?.quantity}</Text>
						</Flex>
						<Text fw={500}>{item?.netAmount} BDT</Text>
					</Flex>
				</Paper>
			))}
		</div>
	);
};

export default PurchaseItemsShowCase;
