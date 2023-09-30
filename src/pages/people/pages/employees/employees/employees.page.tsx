import DataTable from "@/_app/common/data-table/DataTable";
import {
  Employee,
  EmployeeDepartmentWithPagination,
  EmployeesWithPagination,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import EmployeesForm from "./components/EmployeesForm";
import {
  PEOPLE_EMPLOYEES_QUERY_LIST,
  PEOPLE_EMPLOYEE_DEPARTMENT_LIST_DROPDOWN,
} from "./utils/query";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const Employees = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

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

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetchEmployeeDepartments();
    refetch(variables).finally(() => {
      setState({ refetching: false });
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
              // onClick={() => handleDeleteAccount(row._id)}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
            <Menu.Item
              // onClick={() => handleDeleteAccount(row._id)}
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
                setState({ modalOpened: true, operationPayload: {} })
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
