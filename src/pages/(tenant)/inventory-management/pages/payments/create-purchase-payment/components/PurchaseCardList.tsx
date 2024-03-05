import currencyNumberFormat from "@/_app/common/utils/commaNumber";
import { ProductPurchase } from "@/_app/graphql-models/graphql";
import {
  Button,
  Group,
  Paper,
  Skeleton,
  Space,
  Text,
  clsx,
} from "@mantine/core";
import { IconSquareCheckFilled } from "@tabler/icons-react";
import React, { useMemo } from "react";

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
  const dueAmount = useMemo(() => {
    return (purchase: ProductPurchase) => {
      const netTotal = purchase.netTotal || 0;
      const paidAmount = purchase.paidAmount || 0;
      return currencyNumberFormat(netTotal - paidAmount);
    };
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {purchases?.map((purchase, idx: number) => (
          <Paper
            key={idx}
            p={10}
            withBorder
            className={clsx("relative cursor-pointer", {
              "bg-red-100 cursor-not-allowed": dueAmount(purchase) === "0",
            })}
            onClick={() => {
              if (dueAmount(purchase) === "0") return;
              onAddItem({
                ...purchase,
                purchaseId: purchase?._id,
                purchaseUID: purchase?.purchaseUID,
              });
            }}
          >
            {watch(`items.${idx}._id`) === purchase?._id && (
              <IconSquareCheckFilled
                size={20}
                className="absolute top-3 right-3"
              />
            )}
            nnnnnnn
            <Text size={"md"} fw={700}>
              {purchase?.purchaseUID}
            </Text>
            <Text size={"sm"}>
              Due amount: {dueAmount(purchase)}
              BDT
            </Text>
            <Text size={"sm"}>
              Net total: {currencyNumberFormat(purchase?.netTotal || 0)} BDT{" "}
            </Text>
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
