import { confirmModal } from "@/_app/common/confirm/confirm";
import DataTable from "@/_app/common/data-table/DataTable";
import {
  EmployeeIncrement,
  EmployeeIncrementsWithPagination,
  MatchOperator,
} from "@/_app/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Menu } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import React, { useMemo } from "react";
// import {
//   INCREMENTS_QUERY,
//   INCREMENT_DELETE_MUTATION,
//   INCREMENT_EMPLOYEE_QUERY,
// } from "./utils/increment.query";
import dayjs from "dayjs";
import {
  INCREMENTS_QUERY,
  INCREMENT_DELETE_MUTATION,
} from "../../../increments/utils/increment.query";
import EmployeeIncrementsForm from "./employee_details_form/EmployeeIncrementsForm";

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

  const {
    data: increments,
    loading: fetchingIncrements,
    refetch,
  } = useQuery<{
    people__employeeIncrements: EmployeeIncrementsWithPagination;
  }>(INCREMENTS_QUERY, {
    variables: {
      where: {
        filters: [
          {
            key: "employee",
            operator: "eq",
            value: id,
          },
        ],
      },
    },
  });

  const [deleteIncrementMutation] = useMutation(INCREMENT_DELETE_MUTATION, {
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
      title: "Sure to delete account?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteIncrementMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
        });
      },
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "amount",
        header: "Increment Amount",
      },
      {
        accessorKey: "note",
        header: "Note",
      },
      {
        accessorFn: (row: EmployeeIncrement) => dateFormat(row?.date),
        accessorKey: "date",
        header: "Date",
      },
    ],
    []
  );

  return (
    <div>
      <DataTable
        columns={columns}
        data={increments?.people__employeeIncrements.nodes ?? []}
        refetch={handleRefetch}
        totalCount={
          increments?.people__employeeIncrements.meta?.totalCount ?? 100
        }
        filters={[
          {
            key: "employee",
            operator: MatchOperator.Eq,
            value: id,
          },
        ]}
        RowActionMenu={(row: EmployeeIncrement) => (
          <>
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
              onClick={drawerHandler.open}
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        loading={fetchingIncrements || state.refetching}
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
