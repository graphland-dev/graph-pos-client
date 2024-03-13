import { confirmModal } from "@/_app/common/confirm/confirm";
import { User, UsersWithPagination } from "@/_app/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Flex,
  Image,
  Paper,
  Skeleton,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import UserCreateForm from "./components/UserCreateFrom";
import {
  IDENTITY_REMOVE_CURRENT_TENANT_USER_ROLE,
  Organization__Employees__Query
} from "./utils/query.gql";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const UsersPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const { data, loading, refetch } = useQuery<{
    identity__currentTenantUsers: UsersWithPagination;
  }>(Organization__Employees__Query);





  const [deleteEmployeeRoleMutation] = useMutation(
    IDENTITY_REMOVE_CURRENT_TENANT_USER_ROLE,
    { onCompleted: () => handleRefetch({}) }
  );

  const handleDeleteEmployeeRole = (_id: string) => {
    confirmModal({
      title: "Sure to delete employee role?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteEmployeeRoleMutation({
          variables: {
            userId: _id,
          },
        });
      },
    });
  };

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  return (
    <div>
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
        withCloseButton={true}
      >
        <UserCreateForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <Flex justify={"space-between"}>
        <Title order={2} fw={700}>
          Organization Employees
        </Title>
        <Button
          onClick={() =>
            setState({ modalOpened: true, operationType: "create" })
          }
          variant="outline"
        >
          Invite Member{" "}
        </Button>
      </Flex>

      <Space h={"lg"} />

      {data?.identity__currentTenantUsers?.nodes?.map(
        (user: User, idx: number) => (
          <Paper
            key={idx}
            className="flex items-center justify-between gap-4 rounded-md"
            p={10}
            my={10}
          >
            <div className="flex gap-3">
              <Avatar radius={7}>
                <Image
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                    user?.name ?? user?.email
                  }`}
                />
              </Avatar>
              <div>
                <Text fw={500} tt={"capitalize"}>
                  {user?.name ?? user?.email?.split("@")[0]}
                </Text>
                <Text size={"xs"}>{user?.email}</Text>
              </div>
            </div>
            <div>
              <Badge
                className="cursor-pointer"
                onClick={() =>
                  setState({
                    modalOpened: true,
                    operationType: "update",
                    operationId: user._id,
                    operationPayload: user,
                  })
                }
              >
                Edit
              </Badge>
              <Badge
                color="red"
                className="cursor-pointer"
                onClick={() => handleDeleteEmployeeRole(user._id)}
              >
                Delete
              </Badge>
            </div>
          </Paper>
        )
      )}

      {loading && (
        <>
          {new Array(12).fill(12).map(() => (
            <Skeleton h={80} radius={5} my={10} />
          ))}
        </>
      )}
    </div>
  );
};

export default UsersPage;
