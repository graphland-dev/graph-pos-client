import { confirmModal } from '@/_app/common/confirm/confirm';
import DataTable from '@/_app/common/data-table/DataTable';
import {
	MatchOperator,
	Supplier,
	SuppliersWithPagination,
} from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Menu } from '@mantine/core';
import { useDisclosure, useSetState } from '@mantine/hooks';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import SuppliersCreateFrom from './components/SuppliersCreateFrom';
import {
	PEOPLE_REMOVE_SUPPLIERS,
	PEOPLE_SUPPLIERS_QUERY,
} from './utils/suppliers.query';

interface IState {
	refetching: boolean;
	action: 'CREATE' | 'EDIT';
	selectedSuppliers: Supplier | null;
}

const SuppliersPage = () => {
	const [openedDrawer, drawerHandler] = useDisclosure();
	const [state, setState] = useSetState<IState>({
		refetching: false,
		action: 'CREATE',
		selectedSuppliers: null,
	});

	const {
		data,
		refetch,
		loading: fetchingPeople,
	} = useQuery<{
		people__suppliers: SuppliersWithPagination;
	}>(PEOPLE_SUPPLIERS_QUERY);

	const [deleteClientMutation] = useMutation(PEOPLE_REMOVE_SUPPLIERS, {
		onCompleted: () => handleRefetch({}),
	});

	const handleRefetch = (variables: any) => {
		setState({ refetching: true });
		refetch(variables).finally(() => {
			setState({ refetching: false });
		});
	};

	const handleDeleteIncrement = (_id: string) => {
		confirmModal({
			title: 'Sure to delete supplier?',
			description: 'Be careful!! Once you deleted, it can not be undone',
			isDangerous: true,
			onConfirm() {
				deleteClientMutation({
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
				accessorKey: 'companyName',
				header: 'Company Name',
			},
			{
				accessorKey: 'contactNumber',
				header: 'Contact number',
			},
			{
				accessorKey: 'email',
				header: 'Email',
			},
			{
				accessorKey: 'address',
				header: 'Address',
			},
		],
		[]
	);
	return (
		<div>
			<DataTable
				columns={columns}
				data={data?.people__suppliers?.nodes ?? []}
				refetch={handleRefetch}
				totalCount={data?.people__suppliers?.meta?.totalCount ?? 100}
				RowActionMenu={(row: Supplier) => (
					<>
						<Menu.Item
							onClick={() => {
								drawerHandler.open();
								setState({
									selectedSuppliers: row,
									action: 'EDIT',
								});
							}}
							icon={<IconPencil size={18} />}
						>
							Edit
						</Menu.Item>
						<Menu.Item
							onClick={() => handleDeleteIncrement(row._id)}
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
							onClick={() => {
								drawerHandler.open();
								setState({
									action: 'CREATE',
								});
							}}
							size='sm'
						>
							Add new
						</Button>
					</>
				}
				loading={fetchingPeople || state.refetching}
			/>

			<Drawer
				opened={openedDrawer}
				onClose={drawerHandler.close}
				position='right'
				title='Create client'
				withCloseButton={true}
			>
				<SuppliersCreateFrom
					action={state.action}
					formData={state.selectedSuppliers!}
					onFormSubmitted={() => {
						refetch();
						drawerHandler.close();
					}}
				/>
			</Drawer>
		</div>
	);
};

export default SuppliersPage;
