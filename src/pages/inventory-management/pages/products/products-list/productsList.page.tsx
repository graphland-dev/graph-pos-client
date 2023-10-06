import { confirmModal } from '@/_app/common/confirm/confirm';
import DataTable from '@/_app/common/data-table/DataTable';
import {
	MatchOperator,
	Product,
	ProductsWithPagination,
} from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Menu } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
	INVENTORY_PRODUCTS_LIST_QUERY,
	INVENTORY_PRODUCT_REMOVE,
} from './utils/product.query';

interface IState {
	refetching: boolean;
}

const ProductListPage = () => {
	const [state, setState] = useSetState<IState>({
		refetching: false,
	});

	const { data, loading, refetch } = useQuery<{
		inventory__products: ProductsWithPagination;
	}>(INVENTORY_PRODUCTS_LIST_QUERY, {
		variables: {
			where: {
				limit: 10,
				page: 1,
			},
		},
	});

	const [deleteProductMutation] = useMutation(INVENTORY_PRODUCT_REMOVE, {
		onCompleted: () => handleRefetch({}),
	});

	const handleRefetch = (variables: any) => {
		setState({ refetching: true });
		refetch(variables).finally(() => {
			setState({ refetching: false });
		});
	};

	const handleDeleteAccount = (_id: string) => {
		confirmModal({
			title: 'Sure to delete product?',
			description: 'Be careful!! Once you deleted, it can not be undone',
			isDangerous: true,
			onConfirm() {
				deleteProductMutation({
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
				accessorKey: 'category.name',
				header: 'Category',
			},
			{
				accessorKey: 'price',
				header: 'Price',
			},
		],
		[]
	);

	return (
		<>
			<DataTable
				columns={columns}
				data={data?.inventory__products.nodes ?? []}
				refetch={handleRefetch}
				totalCount={data?.inventory__products.meta?.totalCount ?? 10}
				RowActionMenu={(row: Product) => (
					<>
						<Menu.Item
							component={Link}
							to={`/inventory-management/products/${row?._id}`}
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
							// onClick={() =>
							// 	setState({ modalOpened: true, operationType: 'create' })
							// }
							size='sm'
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

export default ProductListPage;
