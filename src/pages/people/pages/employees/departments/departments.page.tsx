import {
  EmployeeDepartment,
  EmployeeDepartmentWithPagination,
  MatchOperator,
} from "@/_app/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import {
  ActionIcon,
  Button,
  Drawer,
  Flex,
  Skeleton,
  Space,
  Title,
} from "@mantine/core";
import cls from "classnames";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useState } from "react";
import DepartmentCard from "./components/DepartmentCard";
import DepartmentForm from "./components/DepartmentForm";
import {
  GET_EMPLOYEE_DEPARTMENT,
  REMOVE_EMPLOYEE_DEPARTMENT,
} from "./utils/query";

const Departments = () => {
  const [openedDrawer, drawerHandler] = useDisclosure();
  const [selectedDepartment, onSelectDepartment] =
    useState<EmployeeDepartment>();
  const [action, setAction] = useState<"CREATE" | "EDIT">();
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, loading, refetch } = useQuery<{
    people__employeeDepartments: EmployeeDepartmentWithPagination;
  }>(GET_EMPLOYEE_DEPARTMENT);

  const handleOnRefetch = () => {
    setIsRefetching(true);
    refetch().finally(() => {
      setIsRefetching(false);
    });
  };

  const [removeDepartment, { loading: deleting }] = useMutation(
    REMOVE_EMPLOYEE_DEPARTMENT,
    {
      onCompleted: handleOnRefetch,
    }
  );

  return (
    <div>
      <Flex justify={"space-between"} align={"center"}>
        <Title order={2}>Employee Departments</Title>
        <Flex gap={"md"}>
          <ActionIcon
            onClick={() => refetch()}
            variant="outline"
            radius={100}
            size={"lg"}
          >
            <IconRefresh
              className={cls({
                "animate-reverse-spin": loading || deleting || isRefetching,
              })}
            />
          </ActionIcon>
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() => {
              drawerHandler.open();
              setAction("CREATE");
            }}
          >
            Add new
          </Button>
        </Flex>
      </Flex>

      <Space h={50} />

      <div className="grid grid-cols-3 gap-4">
        {data?.people__employeeDepartments?.nodes?.map((department, idx) => (
          <DepartmentCard
            key={idx}
            drawerHandler={drawerHandler}
            onSelectDepartment={() => onSelectDepartment(department)}
            onAction={() => setAction("EDIT")}
            departmentData={department}
            onRemove={() => {
              removeDepartment({
                variables: {
                  where: {
                    key: "_id",
                    operator: MatchOperator.Eq,
                    value: department?._id,
                  },
                },
              });
            }}
          />
        ))}

        {loading && (
          <>
            {" "}
            {new Array(12).fill(12).map((_, idx: number) => (
              <Skeleton key={idx} h={250} radius={10} />
            ))}
          </>
        )}
      </div>

      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title="Create or update department"
        withCloseButton={true}
      >
        <DepartmentForm
          onFormSubmitted={handleOnRefetch}
          drawerHandler={drawerHandler}
          action={action as "CREATE" | "EDIT"}
          formData={
            selectedDepartment as {
              _id: string;
              name: string;
              note: string;
            }
          }
        />
      </Drawer>
    </div>
  );
};

export default Departments;
