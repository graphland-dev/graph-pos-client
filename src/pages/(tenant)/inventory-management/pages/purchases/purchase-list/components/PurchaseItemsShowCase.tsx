import { ProductItemReference } from "@/_app/graphql-models/graphql";
import { Paper, Text } from "@mantine/core";
import React from "react";

const PurchaseItemsShowCase: React.FC<{
  items: ProductItemReference[];
}> = () => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-5">
        <Paper shadow="md" p={10} withBorder>
          <Text>Purchase Date: XXX XX XXXX</Text>
          <Text>Order Date: XXX XX XXXX</Text>
          <Text>Purchase UID: XXX XX XXXX</Text>
        </Paper>
        <Paper shadow="md" p={10} withBorder>
          <Text>Net Bill: XXXX</Text>
          <Text>Paid Amount: XXXX</Text>
          <Text>Due Amount: XXXX</Text>
        </Paper>
        <Paper shadow="md" p={10} withBorder></Paper>
      </div>
      {/* {items?.map((item, idx) => (
				<Paper key={idx} py={10} px={15} radius={5} withBorder my={5}>
					<Flex justify={'space-between'} align={'center'}>
						<Flex gap={8} align={'center'}>
							<Text fw={500}>{item?.name}</Text> -
							<Text fw={500}>{item?.quantity}</Text>
						</Flex>
						<Text fw={500}>{item?.netAmount} BDT</Text>
					</Flex>
				</Paper>
			))} */}
    </div>
  );
};

export default PurchaseItemsShowCase;
