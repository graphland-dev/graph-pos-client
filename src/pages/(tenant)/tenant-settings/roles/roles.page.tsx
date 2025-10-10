import PageTitle from "@/commons/components/PageTitle";
import { confirmModal } from "@/commons/components/confirm";
import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback.ts";
import { MatchOperator, Role } from "@/commons/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Input,
  Modal,
  Paper,
  Skeleton,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconShield, IconCopy, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import RolePermissionForm from "./components/RolePermissionForm";
import {
  CREATE_OR_CLONE_ROLE,
  CURRENT__TENANT__ROLES,
  DELETE_ROLE_MUTATION,
} from "./utils/query.gql";
//
const RolesPage = () => {
  const [opened, handler] = useDisclosure();
  const [selectedRole, setSelectedRole] = useState<Role | null>();

  const { data, loading, refetch } = useQuery<{
    identity__currentTenantRoles: Role[];
  }>(CURRENT__TENANT__ROLES);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    name: string;
  }>({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required().label("Role name"),
      })
    ),
  });

  const [cloneRole, { loading: cloningOrCreating }] = useMutation(
    CREATE_OR_CLONE_ROLE,
    commonNotifierCallback({
      successTitle: "New role created successfully.",
      onSuccess() {
        refetch();
        handler.close();
        reset({
          name: "",
        });
        setSelectedRole(null);
      },
    })
  );

  const [deleteRole] = useMutation(
    DELETE_ROLE_MUTATION,
    commonNotifierCallback({
      successTitle: "Role deleted successfully.",
      onSuccess() {
        refetch();
      },
    })
  );

  const onSubmitCloneForm = (values: { name: string }) => {
    cloneRole({
      variables: {
        body: {
          name: values?.name,
          permissions: selectedRole?.permissions ?? [],
          tenantId: selectedRole?.tenant,
        },
      },
    });
  };

  const handleDeleteRole = (roleId: string, roleName: string) => {
    confirmModal({
      title: "Delete Role",
      description: `Are you sure you want to delete the role "${roleName}"? This action cannot be undone. Users assigned to this role will lose their permissions.`,
      isDangerous: true,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm() {
        deleteRole({
          variables: {
            where: {
              key: "_id",
              operator: MatchOperator.Eq,
              value: roleId,
            },
          },
        });
      },
    });
  };

  return (
    <div>
      <PageTitle title="Roles & Permissions" />

      {/* Header Section */}
      <Card shadow="sm" p="lg" radius="md" mb="xl">
        <Flex justify="space-between" align="center">
          <div>
            <Flex align="center" gap="sm">
              <IconShield size={28} className="text-teal-600" />
              <Title order={2} fw={700}>
                Roles & Permissions
              </Title>
            </Flex>
            <Text size="sm" color="dimmed" mt={8}>
              Manage user roles and their access permissions across the system
            </Text>
          </div>
          <Button
            size="md"
            onClick={() => {
              handler.open();
            }}
            leftSection={<IconPlus size={18} />}
          >
            Create Role
          </Button>
        </Flex>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {new Array(5).fill(0).map((_, idx) => (
            <Skeleton key={idx} height={80} radius="md" />
          ))}
        </div>
      )}

      {/* Roles List */}
      {!loading && (
        <Accordion variant="separated" radius="md">
          {data?.identity__currentTenantRoles?.map((role) => (
            <Accordion.Item value={role?._id} key={role?._id}>
              <Accordion.Control>
                <Flex
                  justify="space-between"
                  align="center"
                  px="md"
                  className="border-border"
                >
                  <Flex align="center" gap="md">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-50">
                      <IconShield size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <Flex align="center" gap="sm">
                        <Text fw={600} size="lg">
                          {role?.name}
                        </Text>
                        {!role?.tenant && (
                          <Badge size="sm" color="orange" variant="light">
                            System Role
                          </Badge>
                        )}
                      </Flex>
                      <Text size="xs" color="dimmed" mt={4}>
                        {role?.permissions?.length || 0} permission
                        {role?.permissions?.length !== 1 ? "s" : ""} configured
                      </Text>
                    </div>
                  </Flex>
                  <Group justify="flex-end" gap="xs">
                    <Button
                      component="div"
                      variant="light"
                      color="teal"
                      size="sm"
                      leftSection={<IconCopy size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRole({
                          createdAt: role?.createdAt,
                          updatedAt: role?.updatedAt,
                          _id: role?._id,
                          name: role?.name,
                          permissions: role?.permissions?.map((permission) => ({
                            collectionName: permission.collectionName,
                            actions: permission.actions,
                          })),
                          tenant: role?.tenant,
                        });
                        handler.open();
                      }}
                    >
                      Clone
                    </Button>
                    {role?.tenant && (
                      <Button
                        component="div"
                        variant="light"
                        color="red"
                        size="sm"
                        leftSection={<IconTrash size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role._id, role.name);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </Group>
                </Flex>
              </Accordion.Control>
              <Accordion.Panel>
                <Divider mb="lg" />
                <RolePermissionForm
                  rolePermissions={role.permissions || []}
                  isReadOnly={Boolean(!role.tenant)}
                  roleName={role?.name as string}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      {/* Empty State */}
      {!loading && data?.identity__currentTenantRoles?.length === 0 && (
        <Paper p="xl" radius="md" withBorder className="text-center">
          <IconShield size={48} className="mx-auto mb-4 text-gray-400" />
          <Title order={3} c="dimmed" mb="sm">
            No roles found
          </Title>
          <Text size="sm" color="dimmed" mb="lg">
            Create your first role to start managing permissions
          </Text>
          <Button
            onClick={() => handler.open()}
            leftSection={<IconPlus size={18} />}
          >
            Create Role
          </Button>
        </Paper>
      )}

      {/* Create/Clone Role Modal */}
      <Modal
        opened={opened}
        onClose={() => {
          handler.close();
          setSelectedRole(null);
          reset({ name: "" });
        }}
        title={
          <Flex align="center" gap="sm">
            <IconShield size={24} className="text-teal-600" />
            <Text fw={600} size="lg">
              {selectedRole ? "Clone Role" : "Create New Role"}
            </Text>
          </Flex>
        }
        centered
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitCloneForm)}>
          <Text size="sm" color="dimmed" mb="md">
            {selectedRole
              ? `Create a new role based on "${selectedRole.name}" with the same permissions`
              : "Create a new role and configure its permissions"}
          </Text>
          <Input.Wrapper
            label="Role Name"
            description="Enter a unique name for this role"
            error={<ErrorMessage errors={errors} name="name" />}
          >
            <Input
              placeholder="e.g., Manager, Cashier, Accountant"
              {...register("name")}
              size="md"
            />
          </Input.Wrapper>
          <Space h="lg" />
          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => {
                handler.close();
                setSelectedRole(null);
                reset({ name: "" });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={cloningOrCreating}>
              {selectedRole ? "Clone Role" : "Create Role"}
            </Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
};

export default RolesPage;
