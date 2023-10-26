import { confirmModal } from "@/_app/common/confirm/confirm";
import DataTable from "@/_app/common/data-table/DataTable";
import {
  Employee,
  EmployeeDepartmentWithPagination,
  EmployeesWithPagination,
  MatchOperator,
} from "@/_app/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import EmployeesForm from "./components/EmployeesForm";
import {
  PEOPLE_EMPLOYEES_DELETE_MUTATION,
  PEOPLE_EMPLOYEES_QUERY_LIST,
  PEOPLE_EMPLOYEE_DEPARTMENT_LIST_DROPDOWN,
} from "./utils/query";
import ViewEmployeeDetails from "./components/ViewEmployeeDetails";
import { Subject } from "rxjs";

interface IState {
  viewModal: boolean;
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
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

  const { data, loading, refetch } = useQuery<{
    people__employees: EmployeesWithPagination;
  }>(PEOPLE_EMPLOYEES_QUERY_LIST);

  const { data: employeeDepartments, refetch: refetchEmployeeDepartments } =
    useQuery<{
      people__employeeDepartments: EmployeeDepartmentWithPagination;
    }>(PEOPLE_EMPLOYEE_DEPARTMENT_LIST_DROPDOWN, {
      variables: {
        where: { limit: -1 },
      },
    });

  const [deleteEmployeeMutation] = useMutation(
    PEOPLE_EMPLOYEES_DELETE_MUTATION
  );

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetchEmployeeDepartments();
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteEmployee = (_id: string) => {
    confirmModal({
      title: "Sure to delete?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteEmployeeMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
          onCompleted: () => handleRefetch({}),
          onError: (error) => console.log({ error }),
        });
      },
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorFn(row: Employee) {
          return row?.department?.name;
        },
        accessorKey: "department",
        header: "Department",
      },
      {
        accessorKey: "designation",
        header: "Designation",
      },
      {
        accessorKey: "salary",
        header: "Salary",
      },
    ],
    []
  );

  useEffect(() => {
    employeeListRefetchSubject.subscribe((refetched) => {
      if (refetched) {
        handleRefetch({});
      }
    });
  }, []);

  return (
    <>
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
      <DataTable
        columns={columns}
        data={data?.people__employees?.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.people__employees?.meta?.totalCount ?? 10}
        RowActionMenu={(row: Employee) => (
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
              onClick={() => handleDeleteEmployee(row._id)}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setState({ viewModal: true });
                setViewDetails(row);
              }}
              icon={<IconEye size={18} />}
            >
              View
            </Menu.Item>
          </>
        )}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() =>
                setState({ modalOpened: true, operationPayload: "create" })
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

export default Employees;
