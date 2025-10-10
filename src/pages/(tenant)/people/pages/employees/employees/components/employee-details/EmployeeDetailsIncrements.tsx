import { confirmModal } from '@/commons/components/confirm.tsx';
import AppDatatable, { ColumnDef } from '@/commons/components/AppDatatable/AppDatatable';
import {
  CommonPaginationDto,
  EmployeeIncrement,
  EmployeeIncrementsWithPagination,
  MatchOperator,
  SortType,
} from '@/commons/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer } from '@mantine/core';
import { useDisclosure, useSetState } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import React, { useMemo, useState } from 'react';
import {
  INCREMENTS_QUERY,
  INCREMENT_DELETE_MUTATION,
} from '../../../increments/utils/increment.query';
import EmployeeIncrementsForm from './employee_details_form/EmployeeIncrementsForm';
import { formatTableColumnDate } from '@/commons/utils/dateFormat';

interface IState {
  refetching: boolean;
}

interface IIncrementsDetailsProps {
  id: string | undefined;
}

const EmployeeDetailsIncrements: React.FC<IIncrementsDetailsProps> = ({
  id,
}) => {
  const [openedDrawer, drawerHandler] = useDisclosure();
  const [state, setState] = useSetState<IState>({
    refetching: false,
  });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [sorting, setSorting] = useState<{
    column: string;
    direction: 'asc' | 'desc' | null;
  }>({ column: 'createdAt', direction: 'desc' });

  const buildWhereClause = (): CommonPaginationDto => {
    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || 'createdAt',
      sort: sorting.direction === 'asc' ? SortType.Asc : SortType.Desc,
      filters: [
        {
          key: 'employee',
          operator: MatchOperator.Eq,
          value: id,
        },
      ],
    };
  };

  const {
    data: increments,
    loading: fetchingIncrements,
    refetch,
  } = useQuery<{
    people__employeeIncrements: EmployeeIncrementsWithPagination;
  }>(INCREMENTS_QUERY, {
    variables: { where: buildWhereClause() },
    skip: !id,
  });

  const [deleteIncrementMutation] = useMutation(INCREMENT_DELETE_MUTATION, {
    onCompleted: () => handleRefetch(),
  });

  const handleRefetch = () => {
    setState({ refetching: true });
    refetch().finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteIncrement = (_id: string) => {
    confirmModal({
      title: 'Sure to delete increment?',
      description: 'Be careful!! Once you deleted, it can not be undone',
      isDangerous: true,
      onConfirm() {
        deleteIncrementMutation({
          variables: {
            where: { key: '_id', operator: MatchOperator.Eq, value: _id },
          },
        });
      },
    });
  };

  const handleSortChange = (
    column: string,
    direction: 'asc' | 'desc' | null
  ) => {
    setSorting({ column, direction });
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, pageSize });
  };

  const columns = useMemo<ColumnDef<EmployeeIncrement>[]>(
    () => [
      {
        accessor: 'amount',
        title: 'Increment Amount',
        sortable: true,
      },
      {
        accessor: 'note',
        title: 'Note',
        sortable: true,
      },
      {
        accessor: (row) => formatTableColumnDate(row?.date),
        title: 'Date',
        sortKey: 'date',
        sortable: true,
      },
    ],
    [],
  );

  const ActionColumn = (row: EmployeeIncrement) => (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteIncrement(row._id);
        }}
        className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 transition-colors hover:text-red-700"
        title="Delete"
      >
        <IconTrash size={16} />
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={drawerHandler.open}
          size="sm"
        >
          Add new
        </Button>
      </div>

      <AppDatatable
        columns={columns}
        data={increments?.people__employeeIncrements.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: increments?.people__employeeIncrements.meta?.totalCount || 0,
          currentPage: pagination.page,
        }}
        ActionColumn={ActionColumn}
        onSortChange={handleSortChange}
        onPaginationChange={handlePaginationChange}
        loading={fetchingIncrements || state.refetching}
        emptyMessage="No increments found for this employee."
      />

      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title="Create increment"
        withCloseButton={true}
      >
        <EmployeeIncrementsForm
          employeeId={id}
          onFormSubmitted={() => {
            refetch();
            drawerHandler.close();
          }}
        />
      </Drawer>
    </div>
  );
};

export default EmployeeDetailsIncrements;
