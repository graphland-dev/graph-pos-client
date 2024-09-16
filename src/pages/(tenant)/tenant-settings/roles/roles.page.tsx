import { commonNotifierCallback } from '@/commons/components/Notification/commonNotifierCallback.ts';
import { Role } from '@/commons/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Accordion,
  Badge,
  Button,
  Flex,
  Group,
  Input,
  Modal,
  Skeleton,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import RolePermissionForm from './components/RolePermissionForm';
import {
  CREATE_OR_CLONE_ROLE,
  CURRENT__TENANT__ROLES,
} from './utils/query.gql';
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
        name: Yup.string().required().label('Role name'),
      }),
    ),
  });

  const [cloneRole, { loading: cloningOrCreating }] = useMutation(
    CREATE_OR_CLONE_ROLE,
    commonNotifierCallback({
      successTitle: 'New role created successfully.',
      onSuccess() {
        refetch();
        handler.close();
        reset({
          name: '',
        });
        setSelectedRole(null);
      },
    }),
  );

  const onSubmitCloneForm = (values: { name: string }) => {
    cloneRole({
      variables: {
        body: {
          name: values?.name,
          permissions: selectedRole?.permissions,
          tenantId: selectedRole?.tenant,
        },
      },
    });
  };

  return (
    <div>
      {/* {JSON.stringify(errors, null)} */}
      <Flex justify={'space-between'} align={'center'}>
        <Title order={2} fw={700}>
          Roles Management
        </Title>
        <Button
          size="xs"
          onClick={() => {
            handler.open();
          }}
          leftIcon={<IconPlus />}
        >
          Add new
        </Button>{' '}
      </Flex>

      <Space h={'lg'} />

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
              <Flex justify={'space-between'} align={'center'}>
                <Text fz={18}>
                  {role?.name}
                  {!role?.tenant && (
                    <Badge size="xs" color="red.5">
                      Readonly
                    </Badge>
                  )}
                </Text>
                <Group position="right">
                  <Button
                    variant="subtle"
                    color="teal"
                    size="xs"
                    onClick={() => {
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
                    <Button variant="light" color="red" size="xs">
                      Delete
                    </Button>
                  )}
                </Group>
              </Flex>
            </Accordion.Control>
            <Space h={'xs'} />
            <Modal
              opened={opened}
              onClose={handler.close}
              title={'Clone Role'}
              centered
            >
              <form onSubmit={handleSubmit(onSubmitCloneForm)}>
                <Input.Wrapper
                  label={'Role name'}
                  error={<ErrorMessage errors={errors} name="name" />}
                >
                  <Input placeholder="Type name" {...register('name')} />
                </Input.Wrapper>
                <Space h={'sm'} />
                <Button type="submit" loading={cloningOrCreating}>
                  Save
                </Button>
              </form>
            </Modal>
            <Accordion.Panel>
              <RolePermissionForm
                rolePermissions={role.permissions || []}
                isReadOnly={Boolean(!role.tenant)}
                roleName={role?.name as string}
              />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default RolesPage;
