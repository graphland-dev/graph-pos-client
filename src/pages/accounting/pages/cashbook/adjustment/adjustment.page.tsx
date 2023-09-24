import { confirmModal } from '@/_app/common/confirm/confirm';
import DataTable from '@/_app/common/data-table/DataTable';
import {
	Account,
	Accounting_Transaction_Source,
	AccountsWithPagination,
	MatchOperator,
	Transaction,
	TransactionsWithPagination,
} from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Menu } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import { ACCOUNTS_LIST_DROPDOWN } from '../transfers/ulits/query';
import BalanceAdjustmentForm from './components/BalanceAdjustmentForm';
import {
	ACCOUNTING_TRANSACTION_QUERY,
	ACCOUNT_REMOVE_TRANSACTION,
} from './utils/query';

interface IState {
	modalOpened: boolean;
	operationType: 'create' | 'update';
	operationId?: string | null;
	operationPayload?: any;
	refetching: boolean;
}

const AdjustmentPage = () => {
	const [state, setState] = useSetState<IState>({
		modalOpened: false,
		operationType: 'create',
		operationId: null,
		operationPayload: {},
		refetching: false,
	});

	const { data, loading, refetch } = useQuery<{
		accounting__transactions: TransactionsWithPagination;
	}>(ACCOUNTING_TRANSACTION_QUERY, {
		variables: {
			where: {
				limit: 10,
				page: 1,
				where: {
					filters: {
						key: 'source',
						operator: 'eq',
						value: Accounting_Transaction_Source.BalanceAdjustment,
					},
				},
			},
		},
	});

	const { data: accountData } = useQuery<{
		accounting__accounts: AccountsWithPagination;
	}>(ACCOUNTS_LIST_DROPDOWN, {
		variables: {
			where: { limit: -1 },
		},
	});

	const [deleteAccountMutation] = useMutation(ACCOUNT_REMOVE_TRANSACTION, {
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
			title: 'Sure to delete account?',
			description: 'Be careful!! Once you deleted, it can not be undone',
			isDangerous: true,
			onConfirm() {
				deleteAccountMutation({
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
				accessorFn: (row: Transaction) =>
					`${row?.account?.name} [${row?.account?.referenceNumber}]`,
				header: 'Bank Name',
			},
			{
				accessorKey: 'account.brunchName',
				header: 'Brunch Name',
			},
			{
				accessorKey: 'type',
				header: 'Type',
			},

			{
				accessorKey: 'createdAt',
				header: 'Date',
			},
		],
		[]
	);

	return (
		<>
			<Drawer
				opened={state.modalOpened}
				onClose={() => setState({ modalOpened: false })}
				position='right'
			>
				<BalanceAdjustmentForm
					onSubmissionDone={() => {
						handleRefetch({});
						setState({ modalOpened: false });
					}}
					accounts={accountData?.accounting__accounts?.nodes || []}
				/>
			</Drawer>
			<DataTable
				columns={columns}
				data={data?.accounting__transactions.nodes ?? []}
				refetch={handleRefetch}
				totalCount={data?.accounting__transactions.meta?.totalCount ?? 10}
				RowActionMenu={(row: Account) => (
					<>
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
								setState({ modalOpened: true, operationType: 'create' })
							}
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

export default AdjustmentPage;
