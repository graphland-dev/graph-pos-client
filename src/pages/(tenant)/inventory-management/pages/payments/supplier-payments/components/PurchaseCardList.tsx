import { ProductPurchase } from "@/_app/graphql-models/graphql";
import { Button, Group, Paper, Skeleton, Space, Text } from "@mantine/core";
import { IconSquareCheckFilled } from "@tabler/icons-react";
import React from "react";

const PurchaseCardList: React.FC<{
  purchases: ProductPurchase[];
  setValue: any;
  watch: any;
  isFetchingPurchases: boolean;
  hasNextPage: boolean;
  purchasePage: number;
  onChangePurchasePage: (state: number) => void;
  onAddItem: (state: any) => void;
}> = ({
  purchases,
  watch,
  isFetchingPurchases,
  hasNextPage,
  purchasePage,
  onChangePurchasePage,
  onAddItem,
}) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {purchases?.map((purchase: ProductPurchase, idx: number) => (
          <Paper
            key={idx}
            p={10}
            withBorder
            className="relative cursor-pointer hover:bg-slate-100 hover:duration-200"
            onClick={() => onAddItem(purchase)}
          >
            {watch(`items.${idx}._id`) === purchase?._id && (
              <IconSquareCheckFilled
                size={20}
                className="absolute top-3 right-3"
              />
            )}
            <Text size={"md"} fw={700}>
              {purchase?.purchaseId}
            </Text>
            <Text size={"sm"}>Due amount: {purchase?.dueAmount || 0} BDT</Text>
            <Text size={"sm"}>Net total: {purchase?.netTotal || 0} BDT </Text>
          </Paper>
        ))}
      </div>
      {isFetchingPurchases && (
        <div className="grid grid-cols-3 gap-3">
          {new Array(6).fill(6).map((_, idx) => (
            <Skeleton key={idx} h={90} radius={"sm"} />
          ))}
        </div>
      )}

      <Space h={"md"} />

      <Group position="left">
        <Button
          variant="subtle"
          size="xs"
          disabled={purchasePage === 1}
          onClick={() => onChangePurchasePage(purchasePage - 1)}
        >
          Load Previous
        </Button>{" "}
        <Button
          variant="subtle"
          disabled={!hasNextPage}
          size="xs"
          onClick={() => onChangePurchasePage(purchasePage + 1)}
        >
          Load Next
        </Button>
      </Group>
    </div>
  );
};

export default PurchaseCardList;
