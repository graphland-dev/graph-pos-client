import { confirmModal } from '@/commons/components/confirm.tsx';
import DataTable from '@/commons/components/DataTable.tsx';
import {
	MatchOperator,
	ProductCategory,
	ProductCategorysWithPagination,
} from '@/commons/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Menu } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import CreateAndUpdateCategoryForm from './components/CreateAndUpdateCategoryForm';
import {
	INVENTORY_PRODUCT_CATEGORIES_QUERY,
	INVENTORY_PRODUCT_CATEGORY_REMOVE,
} from './utils/category.query';
import PageTitle from '@/commons/components/PageTitle';

interface IState {
	modalOpened: boolean;
	operationType: 'create' | 'update';
	operationId?: string | null;
	operationPayload?: any;
	refetching: boolean;
}

const ProductCategoryPage = () => {
	const [state, setState] = useSetState<IState>({
		modalOpened: false,
		operationType: 'create',
		operationId: null,
		operationPayload: {},
		refetching: false,
	});

	const { data, loading, refetch } = useQuery<{
		inventory__productCategories: ProductCategorysWithPagination;
	}>(INVENTORY_PRODUCT_CATEGORIES_QUERY, {
		variables: {
			where: {
				limit: 10,
				page: 1,
			},
		},
	});

	const [deleteCategoryMutation] = useMutation(
		INVENTORY_PRODUCT_CATEGORY_REMOVE,
		{ onCompleted: () => handleRefetch({}) }
	);

	const handleRefetch = (variables: any) => {
		setState({ refetching: true });
		refetch(variables).finally(() => {
			setState({ refetching: false });
		});
	};

	const handleDeleteAccount = (_id: string) => {
		confirmModal({
			title: 'Sure to delete category?',
			description: 'Be careful!! Once you deleted, it can not be undone',
			isDangerous: true,
			onConfirm() {
				deleteCategoryMutation({
					variables: {
						where: { key: '_id', operator: MatchOperator.Eq, value: _id },
					},
				});
			},
		});
	};

	const columns = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
			},
			{
				accessorKey: 'code',
				header: 'Code',
			},

			{
				accessorKey: 'note',
				header: 'Note',
			},
		],
		[]
	);

	return (
    <>
      <PageTitle title="product-category" />
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <CreateAndUpdateCategoryForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.inventory__productCategories.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.inventory__productCategories.meta?.totalCount ?? 10}
        RowActionMenu={(row: ProductCategory) => (
          <>
            <Menu.Item
              onClick={() =>
                setState({
                  modalOpened: true,
                  operationType: "update",
                  operationId: row._id,
                  operationPayload: row,
                })
              }
              icon={<IconPencil size={18} />}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={() => handleDeleteAccount(row._id)}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
          </>
        )}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() =>
                setState({ modalOpened: true, operationType: "create" })
              }
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        loading={loading || state.refetching}
      />
    </>
  );
};

export default ProductCategoryPage;
