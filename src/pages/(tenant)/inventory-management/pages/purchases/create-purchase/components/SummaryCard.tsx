import { Box, Flex, Paper, Text } from '@mantine/core';
import React from 'react';
import { getTotalCostAmount, getTotalProductsPrice } from '../utils/helpers';

const SummaryCard: React.FC<{
	watch: any;
}> = ({ watch }) => {
	const productsPrice = getTotalProductsPrice(watch('products')!);
	const taxRate = watch('taxRate');

	const totalCosts = getTotalCostAmount(watch('costs')!);

	const subTotal = productsPrice + totalCosts;

	const totalTax = (subTotal * taxRate) / 100;

	const netTotal = subTotal + totalTax;

	// console.log(netTotal);

	return (
		<Paper withBorder p={'sm'} mb={'xl'}>
			<Flex justify={'space-between'}>
				<Box>
					<Text fw={'bold'}>Tax rate</Text>
					<Text fw={'bold'}>Tax amount</Text>
				</Box>
				<Box>
					<Text>{taxRate || 0} %</Text>
					<Text>{totalTax || 0} BDT</Text>
				</Box>
			</Flex>

			<Flex justify={'space-between'}>
				<Text fw={'bold'}>Cost Amount</Text>
				<Text>{totalCosts || 0} BDT</Text>
			</Flex>

			<hr />

			<Flex justify={'space-between'}>
				<Text fw={'bold'}>Sub total (Product + Cost)</Text>
				<Text>{subTotal || 0} BDT</Text>
			</Flex>

			<Flex justify={'space-between'}>
				<Text fw={'bold'}>Net total (Sub total + Tax amount)</Text>
				<Text>{netTotal || 0} BDT</Text>
			</Flex>
		</Paper>
	);
};

export default SummaryCard;
