import { confirmModal } from '@/commons/components/confirm.tsx';
import DataTable from '@/commons/components/DataTable.tsx';
import {
	MatchOperator,
	Transfer,
	Unit,
	UnitsWithPagination,
} from '@/commons/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Menu } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';

import { IconPencil } from '@tabler/icons-react';
import CreateAndUpdateUnitForm from './components/CreateAndUpdateUnitForm';
import { SETUP_REMOVE_UNIT, SETUP_UNITS_QUERY } from './utils/units.query';
import PageTitle from '@/commons/components/PageTitle';

interface IState {
	modalOpened: boolean;
	operationType: 'create' | 'update';
	operationId?: string | null;
	operationPayload?: any;
	refetching: boolean;
}

const UnitPage = () => {
	const [state, setState] = useSetState<IState>({
		modalOpened: false,
		operationType: 'create',
		operationId: null,
		operationPayload: {},
		refetching: false,
	});

	const { data, loading, refetch } = useQuery<{
		setup__units: UnitsWithPagination;
	}>(SETUP_UNITS_QUERY, {
		variables: {
			where: {
				limit: 10,
				page: 1,
			},
		},
	});

	// const { data: unitsData, refetch: refetchAccounts } = useQuery<{
	//   setup__units: AccountsWithPagination;
	// }>(ACCOUNTS_LIST_DROPDOWN, {
	//   variables: {
	//     where: { limit: -1 },
	//   },
	// });

	const [deleteUnitMutation] = useMutation(SETUP_REMOVE_UNIT, {
		onCompleted: () => handleRefetch({}),
	});

	const handleDeleteAccount = (_id: string) => {
		confirmModal({
			title: 'Sure to delete?',
			description: 'Be careful!! Once you deleted, it can not be undone',
			isDangerous: true,
			onConfirm() {
				deleteUnitMutation({
					variables: {
						where: { key: '_id', operator: MatchOperator.Eq, value: _id },
					},
				});
			},
		});
	};

	const handleRefetch = (variables: any) => {
		setState({ refetching: true });
		// refetchAccounts();
		refetch(variables).finally(() => {
			setState({ refetching: false });
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
				accessorKey: 'percentage',
				header: 'Percentage',
			},
			{
				accessorKey: 'note',
				header: 'Note',
			},
			{
				accessorFn: (row: Unit) =>
					dayjs(row?.createdAt).format('MMMM D, YYYY h:mm A'),
				accessorKey: 'createdAt',
				header: 'Date',
			},
		],
		[]
	);
	return (
    <>
      <PageTitle title="setting-unit" />
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <CreateAndUpdateUnitForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          // units={unitsData?.accounting__accounts?.nodes || []}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.setup__units?.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.setup__units?.meta?.totalCount ?? 10}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() =>
                setState({ modalOpened: true, operationPayload: {} })
              }
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        RowActionMenu={(row: Transfer) => (
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
              onClick={() => handleDeleteAccount(row?._id)}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
          </>
        )}
        loading={loading || state.refetching}
      />
    </>
  );
};

export default UnitPage;
