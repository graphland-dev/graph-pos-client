import { User, UsersWithPagination } from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Flex,
  Image,
  Paper,
  Skeleton,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { Organization__Employees__Query } from "./utils/query.gql";

const UsersPage = () => {
  const { data, loading } = useQuery<{
    identity__currentTenantUsers: UsersWithPagination;
  }>(Organization__Employees__Query);

  return (
    <div>
      <Flex justify={"space-between"}>
        <Title order={2} fw={700}>
          Organization Employees
        </Title>
        <Button variant="outline">Invite Member </Button>
      </Flex>

      <Space h={"lg"} />

      {data?.identity__currentTenantUsers?.nodes?.map(
        (user: User, idx: number) => (
          <Paper
            key={idx}
            className="flex items-center gap-4 rounded-md"
            p={10}
            my={10}
          >
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
