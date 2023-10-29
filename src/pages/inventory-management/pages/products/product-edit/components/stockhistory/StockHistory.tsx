import { Button, Drawer, Space, Tabs } from "@mantine/core";
import StockIn from "./StockIn";
import StockOut from "./StockOut";
import { useMutation, useQuery } from "@apollo/client";
import {
  PRODUCT_STOCK_HISTORY_QUERY,
  PRODUCT_STOCK_REMOVE_MUTATION,
} from "../../utils/productEdit.query";
import {
  MatchOperator,
  ProductStocksWithPagination,
} from "@/_app/graphql-models/graphql";
import { useSetState } from "@mantine/hooks";
import StockAddForm from "./StockAddForm";
import { IconPlus } from "@tabler/icons-react";
import { confirmModal } from "@/_app/common/confirm/confirm";
import { useParams } from "react-router-dom";

interface IState {
  modalOpened: boolean;
  operationType: "STOCK_IN" | "STOCK_OUT";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const StockHistory = () => {
  const { productId } = useParams();
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "STOCK_IN",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const { data, refetch } = useQuery<{
    inventory__productStocks: ProductStocksWithPagination;
  }>(PRODUCT_STOCK_HISTORY_QUERY, {
    variables: {
      where: {
        limit: -1,
        filters: [
          {
            key: "product",
            operator: "eq",
            value: productId,
          },
        ],
      },
    },
  });

  const filteredStockInData = data?.inventory__productStocks.nodes?.filter(
    (item: any) => item.type === "STOCK_IN"
  );
  const filteredStockOutData = data?.inventory__productStocks.nodes?.filter(
    (item) => item.type === "STOCK_OUT"
  );

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const [deleteProductStockMutation] = useMutation(
    PRODUCT_STOCK_REMOVE_MUTATION,
    { onCompleted: () => handleRefetch({}) }
  );

  const handleDeleteStock = (_id: string) => {
    // console.log(_id);
    confirmModal({
      title: "Sure to delete account?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteProductStockMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
        });
      },
    });
  };
  return (
    <>
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <StockAddForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          data={data?.inventory__productStocks?.nodes ?? []}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <Tabs
        defaultValue="Stock In"
        className="flex flex-col justify-between"
        onTabChange={(event) =>
          setState((prev: any) => {
            return { ...prev, operationType: event };
          })
        }
      >
        <div className="flex justify-end">
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() =>
              setState({
                modalOpened: true,
                operationType: state.operationType,
              })
            }
            size="sm"
          >
            Adjustment
          </Button>
        </div>

        <Tabs.List>
          <Tabs.Tab value="Stock In">Stock In</Tabs.Tab>
          <Tabs.Tab value="Stock Out">StockOut</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Stock In">
          <Space h={20} />
          <StockIn
            removeStock={handleDeleteStock}
            data={filteredStockInData || []}
            totalCount={data?.inventory__productStocks?.meta?.totalCount ?? 10}
            refetch={handleRefetch}
          />
        </Tabs.Panel>

        <Tabs.Panel value="Stock Out">
          <Space h={20} />
          <StockOut
            removeStock={handleDeleteStock}
            data={filteredStockOutData || []}
            totalCount={data?.inventory__productStocks?.meta?.totalCount ?? 10}
            refetch={handleRefetch}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default StockHistory;
