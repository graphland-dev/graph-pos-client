import AppDatatable, {
  ColumnDef,
} from '@/commons/components/AppDatatable/AppDatatable';
import {
  Employee,
  EmployeeIncrement,
  EmployeeIncrementsWithPagination,
  EmployeesWithPagination,
  MatchOperator,
} from '@/commons/graphql-models/graphql';
import { currencyNumberWithSymbolFormat } from '@/commons/utils/commaNumber';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Input, NumberInput, Select, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure, useSetState } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import IncrementForm from './components/IncrementForm';
import {
  INCREMENTS_QUERY,
  INCREMENT_DELETE_MUTATION,
  INCREMENT_EMPLOYEE_QUERY,
} from './utils/increment.query';
import PageTitle from '@/commons/components/PageTitle';
import { dateTimeFormatter } from '@/commons/utils/dateFormat';

interface IState {
  refetching: boolean;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: 'asc' | 'desc' | null;
}

const Increments = () => {
  const [openedDrawer, drawerHandler] = useDisclosure();
  const [state, setState] = useSetState<IState>({
    refetching: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: '',
    direction: null,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Build query variables
  const buildQueryVariables = () => {
    const graphqlFilters: any[] = [];

    // Add search filters for employee
    if (filters.employee) {
      graphqlFilters.push({
        key: 'employee',
        operator: MatchOperator.Eq,
        value: filters.employee,
      });
    }

    // Add search filters for note
    if (filters.note) {
      graphqlFilters.push({
        key: 'note',
        operator: MatchOperator.Contains,
        value: filters.note,
      });
    }

    // Add amount range filters
    if (filters.minAmount) {
      graphqlFilters.push({
        key: 'amount',
        operator: MatchOperator.Gte,
        value: filters.minAmount,
      });
    }

    if (filters.maxAmount) {
      graphqlFilters.push({
        key: 'amount',
        operator: MatchOperator.Lte,
        value: filters.maxAmount,
      });
    }

    // Add date range filters
    if (filters.startDate) {
      graphqlFilters.push({
        key: 'date',
        operator: MatchOperator.Gte,
        value: filters.startDate,
      });
    }

    if (filters.endDate) {
      graphqlFilters.push({
        key: 'date',
        operator: MatchOperator.Lte,
        value: filters.endDate,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || 'createdAt',
      sort: sorting.direction === 'asc' ? 'ASC' : 'DESC',
      filters: graphqlFilters,
    };
  };

  const { data } = useQuery<{
    people__employees: EmployeesWithPagination;
  }>(INCREMENT_EMPLOYEE_QUERY);

  const {
    data: increments,
    loading: fetchingIncrements,
    refetch,
  } = useQuery<{
    people__employeeIncrements: EmployeeIncrementsWithPagination;
  }>(INCREMENTS_QUERY, {
    variables: {
      where: buildQueryVariables(),
    },
    fetchPolicy: 'cache-and-network',
  });

  // Process employee options for Select component
  const employeeOptions = useMemo(() => {
    if (!data?.people__employees?.nodes) return [];
    return data.people__employees.nodes.map((employee) => ({
      value: employee._id,
      label: employee.name,
    }));
  }, [data]);

  const [deleteIncrementMutation, { loading: deleting }] = useMutation(
    INCREMENT_DELETE_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: 'Success',
          message: 'Increment deleted successfully',
          color: 'green',
        });
        handleRefetch({});
      },
      onError: (error) => {
        showNotification({
          title: 'Error',
          message: error.message,
          color: 'red',
        });
      },
    }
  );

  const handleRefetch = (variables?: any) => {
    setState({ refetching: true });
    refetch({ where: buildQueryVariables(), ...variables }).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteIncrement = (increment: EmployeeIncrement) => {
    modals.openConfirmModal({
      title: 'Delete Increment',
      children: (
        <Text size="sm">
          Are you sure you want to delete increment for{' '}
          <strong>{increment.employee?.name}</strong> with amount{' '}
          <strong>
            {currencyNumberWithSymbolFormat(increment.amount || 0)}
          </strong>
          ? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red', loading: deleting },
      onConfirm: () =>
        deleteIncrementMutation({
          variables: {
            where: {
              key: '_id',
              operator: MatchOperator.Eq,
              value: increment._id,
            },
          },
        }),
    });
  };

  const columns = useMemo<ColumnDef<EmployeeIncrement>[]>(
    () => [
      {
        accessor: (row: EmployeeIncrement) => row?.employee?.name || '',
        title: 'Employee Name',
        sortKey: 'employee',
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by employee..."
            value={filters.employee || null}
            data={employeeOptions}
            disabled={!data?.people__employees?.nodes}
            onChange={(value) => setValue('employee', value || '')}
            clearable
            searchable
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row: EmployeeIncrement) =>
          currencyNumberWithSymbolFormat(row?.amount || 0),
        title: 'Increment Amount',
        sortKey: 'amount',
        sortable: true,
        Filter: (setValue) => (
          <div className="flex gap-2" style={{ minWidth: 200 }}>
            <NumberInput
              placeholder="Min"
              value={filters.minAmount ? Number(filters.minAmount) : undefined}
              onChange={(value) =>
                setValue('minAmount', value?.toString() || '')
              }
              size="sm"
              min={0}
            />
            <NumberInput
              placeholder="Max"
              value={filters.maxAmount ? Number(filters.maxAmount) : undefined}
              onChange={(value) =>
                setValue('maxAmount', value?.toString() || '')
              }
              size="sm"
              min={0}
            />
          </div>
        ),
      },
      {
        accessor: (row: EmployeeIncrement) => row?.note || '',
        title: 'Note',
        sortKey: 'note',
        sortable: true,
        Filter: (setValue) => (
          <Input
            placeholder="Filter by note..."
            value={filters.note || ''}
            onChange={(e) => setValue('note', e.target.value)}
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row: EmployeeIncrement) =>
          row?.date ? dateTimeFormatter.displayDate(row?.date) : '',
        title: 'Date',
        sortKey: 'date',
        sortable: true,
        Filter: (setValue) => (
          <div className="flex flex-col gap-2" style={{ minWidth: 200 }}>
            <DatePickerInput
              label="Start date"
              value={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(value: Date | null) =>
                setValue('startDate', value?.toISOString() || '')
              }
              size="sm"
              clearable
            />
            <DatePickerInput
              label="End date"
              value={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(value: Date | null) =>
                setValue('endDate', value?.toISOString() || '')
              }
              size="sm"
              clearable
            />
          </div>
        ),
      },
    ],
    [
      filters.employee,
      filters.note,
      filters.minAmount,
      filters.maxAmount,
      filters.startDate,
      filters.endDate,
      employeeOptions,
      data?.people__employees?.nodes,
    ]
  );
  return (
    <>
      <PageTitle title="employee-increment" />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Employee Increments
          </Text>
          <Text size="sm" color="dimmed">
            Manage employee salary increments and adjustments
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleRefetch({})}
            disabled={state.refetching}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {state.refetching ? 'Refreshing...' : 'Refresh'}
          </button>
          <Button leftIcon={<IconPlus size={16} />} onClick={drawerHandler.open}>
            Add Increment
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={increments?.people__employeeIncrements.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems:
            increments?.people__employeeIncrements.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: EmployeeIncrement) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteIncrement(row);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 rounded-md bg-red-50 hover:bg-red-100"
            >
              <IconTrash size={14} />
              Delete
            </button>
          </div>
        )}
        onSortChange={(column, direction) => {
          setSorting({ column, direction });
        }}
        onFilterChange={(column, value) => {
          setFilters((prev) => ({ ...prev, [column]: value }));
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onPaginationChange={(page, pageSize) => {
          setPagination({ page, pageSize });
        }}
        loading={fetchingIncrements || state.refetching}
        emptyMessage="No increments found. Try adjusting your filters."
      />

      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title="Create increment"
        withCloseButton={true}
      >
        <IncrementForm
          employees={data?.people__employees?.nodes as Employee[]}
          onFormSubmitted={() => {
            refetch();
            drawerHandler.close();
          }}
        />
      </Drawer>
    </>
  );
};

export default Increments;
