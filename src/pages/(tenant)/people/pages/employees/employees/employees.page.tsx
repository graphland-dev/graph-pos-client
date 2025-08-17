import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import {
  Employee,
  EmployeeDepartmentWithPagination,
  EmployeesWithPagination,
  MatchOperator,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Input, Select, Text } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import EmployeesForm from "./components/EmployeesForm";
import {
  PEOPLE_EMPLOYEES_DELETE_MUTATION,
  PEOPLE_EMPLOYEES_QUERY_LIST,
  PEOPLE_EMPLOYEE_DEPARTMENT_LIST_DROPDOWN,
} from "./utils/query";
import ViewEmployeeDetails from "./components/ViewEmployeeDetails";
import { Subject } from "rxjs";
import PageTitle from "@/commons/components/PageTitle";
import { useSearchParams } from "react-router-dom";

interface IState {
  viewModal: boolean;
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

export const employeeListRefetchSubject = new Subject<boolean>();
const Employees = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    viewModal: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const [viewDetails, setViewDetails] = useState<Employee | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: "",
    direction: null,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Build query variables
  const buildQueryVariables = () => {
    const graphqlFilters: any[] = [];

    // Add search filters for name
    if (filters.name) {
      graphqlFilters.push({
        key: "name",
        operator: MatchOperator.Contains,
        value: filters.name,
      });
    }

    // Add search filters for designation
    if (filters.designation) {
      graphqlFilters.push({
        key: "designation",
        operator: MatchOperator.Contains,
        value: filters.designation,
      });
    }

    // Add search filters for department
    if (filters.department) {
      graphqlFilters.push({
        key: "department",
        operator: MatchOperator.Eq,
        value: filters.department,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? "ASC" : "DESC",
      filters: graphqlFilters,
    };
  };

  const { data, loading, refetch } = useQuery<{
    people__employees: EmployeesWithPagination;
  }>(PEOPLE_EMPLOYEES_QUERY_LIST, {
    variables: {
      where: buildQueryVariables(),
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: employeeDepartments, refetch: refetchEmployeeDepartments } =
    useQuery<{
      people__employeeDepartments: EmployeeDepartmentWithPagination;
    }>(PEOPLE_EMPLOYEE_DEPARTMENT_LIST_DROPDOWN, {
      variables: {
        where: { limit: -1 },
      },
    });

  // Process department options for Select component
  const departmentOptions = useMemo(() => {
    if (!employeeDepartments?.people__employeeDepartments?.nodes) return [];
    return employeeDepartments.people__employeeDepartments.nodes.map((dept) => ({
      value: dept._id,
      label: dept.name,
    }));
  }, [employeeDepartments]);

  const [deleteEmployeeMutation, { loading: deleting }] = useMutation(
    PEOPLE_EMPLOYEES_DELETE_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Employee deleted successfully",
          color: "green",
        });
        handleRefetch({});
      },
      onError: (error) => {
        showNotification({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    }
  );

  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("employeeId");

  const [fetchEmployee] = useLazyQuery<{
    people__employees: EmployeesWithPagination;
  }>(PEOPLE_EMPLOYEES_QUERY_LIST, {
    fetchPolicy: "network-only",
  });

  const handleRefetch = (variables?: any) => {
    setState({ refetching: true });
    refetchEmployeeDepartments();
    refetch({ where: buildQueryVariables(), ...variables }).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteEmployee = (employee: Employee) => {
    modals.openConfirmModal({
      title: "Delete Employee",
      children: (
        <Text size="sm">
          Are you sure you want to delete employee{" "}
          <strong>{employee.name}</strong>?
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleting },
      onConfirm: () =>
        deleteEmployeeMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: employee._id },
          },
        }),
    });
  };

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessor: (row: Employee) => row?.name || "",
        title: "Name",
        sortKey: "name",
        sortable: true,
        Filter: (setValue) => (
          <Input
            placeholder="Filter by name..."
            value={filters.name || ""}
            onChange={(e) => setValue("name", e.target.value)}
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row: Employee) => row?.department?.name || "",
        title: "Department",
        sortKey: "department",
        sortable: true,
        Filter: (setValue) => (
          <Select
            placeholder="Filter by department..."
            value={filters.department || null}
            data={departmentOptions}
            disabled={!employeeDepartments?.people__employeeDepartments?.nodes}
            onChange={(value) => setValue("department", value || "")}
            clearable
            searchable
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row: Employee) => row?.designation || "",
        title: "Designation",
        sortKey: "designation",
        sortable: true,
        Filter: (setValue) => (
          <Input
            placeholder="Filter by designation..."
            value={filters.designation || ""}
            onChange={(e) => setValue("designation", e.target.value)}
            style={{ minWidth: 200 }}
          />
        ),
      },
      {
        accessor: (row: Employee) =>
          `${currencyNumberWithSymbolFormat(row?.salary || 0)} BDT`,
        title: "Salary",
        sortKey: "salary",
        sortable: true,
      },
    ],
    [
      filters.name,
      filters.department,
      filters.designation,
      departmentOptions,
      employeeDepartments?.people__employeeDepartments?.nodes,
    ]
  );

  useEffect(() => {
    employeeListRefetchSubject.subscribe((refetched) => {
      if (refetched) {
        handleRefetch({});
      }
    });
  }, []);

  useEffect(() => {
    if (employeeId) {
      // alert(invoiceId);
      fetchEmployee({
        variables: {
          where: {
            filters: [
              {
                key: "_id",
                operator: MatchOperator.Eq,
                value: employeeId,
              },
            ],
          },
        },
        onError: (err) => console.log(err),
      }).then((res) => {
        if (res.data?.people__employees?.nodes?.[0]) {
          setState({ viewModal: true });
          setViewDetails(res.data?.people__employees?.nodes?.[0]);
        }
      });
    }
  }, [searchParams]);

  return (
    <>
      <PageTitle title="employees" />
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
        size={"80%"}
      >
        <EmployeesForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          departments={
            employeeDepartments?.people__employeeDepartments.nodes || []
          }
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <Drawer
        padding={0}
        m={0}
        opened={state.viewModal}
        onClose={() => setState({ viewModal: false })}
        position="right"
        size={"95%"}
      >
        <ViewEmployeeDetails
          employeeDetails={viewDetails}
          refetch={refetch}
          departments={
            employeeDepartments?.people__employeeDepartments?.nodes || []
          }
        />
      </Drawer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Employee Management
          </Text>
          <Text size="sm" color="dimmed">
            Manage company employees and their information
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleRefetch({})}
            disabled={state.refetching}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {state.refetching ? "Refreshing..." : "Refresh"}
          </button>
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() =>
              setState({ modalOpened: true, operationType: "create", operationPayload: {} })
            }
          >
            Add Employee
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.people__employees?.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.people__employees?.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: Employee) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  modalOpened: true,
                  operationType: "update",
                  operationId: row._id,
                  operationPayload: row,
                });
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 rounded-md bg-green-50 hover:bg-green-100"
            >
              <IconPencil size={14} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState({ viewModal: true });
                setViewDetails(row);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <IconEye size={14} />
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEmployee(row);
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
        loading={loading || state.refetching}
        emptyMessage="No employees found. Try adjusting your filters."
      />
    </>
  );
};

export default Employees;
