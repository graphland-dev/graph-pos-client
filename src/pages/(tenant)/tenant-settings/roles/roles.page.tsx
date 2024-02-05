import { Role } from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import {
  Accordion,
  Badge,
  Button,
  Flex,
  Group,
  Skeleton,
  Space,
  Text,
  Title,
} from "@mantine/core";
import RolePermissionForm from "./components/RolePermissionForm";
import { CURRENT__TENANT__ROLES } from "./utils/query.gql";
//
const RolesPage = () => {
  const { data, loading } = useQuery<{ identity__currentTenantRoles: Role[] }>(
    CURRENT__TENANT__ROLES
  );

  return (
    <div>
      <Flex>
        <Title order={2} fw={700}>
          Roles Management
        </Title>
      </Flex>

      <Space h={"lg"} />

      {loading && (
        <>
          {new Array(12).fill(12).map(() => (
            <Skeleton h={80} radius={5} my={10} />
          ))}
        </>
      )}

      <Accordion defaultValue="customization" variant="contained">
        {data?.identity__currentTenantRoles?.map((role) => (
          <Accordion.Item value={role?._id} key={role?._id}>
            <Accordion.Control>
              <Flex justify={"space-between"} align={"center"}>
                <Text fz={18}>
                  {role?.name}
                  {!role?.tenant && (
                    <Badge size="xs" color="red.5">
                      Readonly
                    </Badge>
                  )}
                </Text>
                <Group position="right">
                  <Button variant="subtle" color="teal" size="xs">
                    Clone
                  </Button>
                  {role?.tenant && (
                    <Button variant="light" color="red" size="xs">
                      Delete
                    </Button>
                  )}
                </Group>
              </Flex>
            </Accordion.Control>
            <Space h={"xs"} />
            <Accordion.Panel>
              <RolePermissionForm
                rolePermissions={role.permissions || []}
                isReadOnly={Boolean(!role.tenant)}
              />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

      <Space h={"md"} />

      <Button type="submit">Save</Button>
    </div>
  );
};

export default RolesPage;
