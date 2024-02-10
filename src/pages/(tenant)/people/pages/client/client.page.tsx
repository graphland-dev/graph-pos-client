import PageTitle from '@/_app/common/PageTitle';
import { confirmModal } from '@/_app/common/confirm/confirm';
import DataTable from '@/_app/common/data-table/DataTable';
import {
	Client,
	ClientsWithPagination,
	MatchOperator,
} from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Menu } from '@mantine/core';
import { useDisclosure, useSetState } from '@mantine/hooks';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import ClientCreateFrom from './components/ClientCreateFrom';
import {
	PEOPLE_CLIENTS_QUERY,
	PEOPLE_REMOVE_CLIENT,
} from './utils/client.query';

interface IState {
	refetching: boolean;
	action: 'CREATE' | 'EDIT';
	selectedClient: Client | null;
}

const ClientPage = () => {
	const [openedDrawer, drawerHandler] = useDisclosure();
	const [state, setState] = useSetState<IState>({
		refetching: false,
		action: 'CREATE',
		selectedClient: null,
	});

	const {
		data,
		refetch,
		loading: fetchingPeople,
	} = useQuery<{
		people__clients: ClientsWithPagination;
	}>(PEOPLE_CLIENTS_QUERY);

	const [deleteClientMutation] = useMutation(PEOPLE_REMOVE_CLIENT, {
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
			title: 'Sure to delete client?',
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
			<PageTitle title='client' />
			<DataTable
				columns={columns}
				data={data?.people__clients?.nodes ?? []}
				refetch={handleRefetch}
				totalCount={data?.people__clients?.meta?.totalCount ?? 100}
				RowActionMenu={(row: Client) => (
					<>
						<Menu.Item
							onClick={() => {
								drawerHandler.open();
								setState({
									selectedClient: row,
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
				size={'60%'}
			>
				<ClientCreateFrom
					action={state.action}
					formData={state.selectedClient!}
					onFormSubmitted={() => {
						refetch();
						drawerHandler.close();
					}}
				/>
			</Drawer>
		</div>
	);
};

export default ClientPage;
