import { User, UsersWithPagination } from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
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
import { useDisclosure, useSetState } from "@mantine/hooks";
import UserCreateForm from "./components/UserCreateFrom";
import { Organization__Employees__Query } from "./utils/query.gql";

interface IState {
  refetch: boolean;
  selectedUser: User | null;
  viewModal: boolean;
}

const UsersPage = () => {
  const [opened, handler] = useDisclosure();
  const [state] = useSetState<IState>({
    refetch: false,
    selectedUser: null,
    viewModal: false,
  });
  const { data, loading, refetch } = useQuery<{
    identity__currentTenantUsers: UsersWithPagination;
  }>(Organization__Employees__Query);

  return (
    <div>
      <Drawer
        opened={opened}
        onClose={handler.close}
        position="right"
        title="Create User"
        withCloseButton={true}
      >
        <UserCreateForm
          formData={state.selectedUser!}
          onFormSubmitted={() => {
            refetch();
            handler.close();
          }}
        />
      </Drawer>
      <Flex justify={"space-between"}>
        <Title order={2} fw={700}>
          Organization Employees
        </Title>
        <Button
          onClick={() => {
            handler.open();
          }}
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
            <div>
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
            <Badge
              className="cursor-pointer"
              onClick={() => {
                handler.open();
              }}
            >
              Edit
            </Badge>
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
