import { Notify } from '@/_app/common/Notification/Notify';
import { Role, User } from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, MultiSelect, Space, Title } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { CURRENT__TENANT__ROLES } from '../../roles/utils/query.gql';
import {
  IDENTITY_ADD_USER_TO_CURRENT_TENANT,
  IDENTITY_UPDATE_CURRENT_TENANT_USER_ROLE,
} from '../utils/query.gql';

interface IUserFormProps {
  onSubmissionDone: () => void;
  operationType: 'create' | 'update';
  operationId?: string | null;
  formData?: User;
}
const UserCreateForm: React.FC<IUserFormProps> = ({
  onSubmissionDone,
  operationType,
  operationId,
  formData,
}) => {
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      roles: [],
    },
    resolver: yupResolver(formValidationSchema),
  });

  const { tenant } = useParams();

  const { data: roleData } = useQuery<{
    identity__currentTenantRoles: Role[];
  }>(CURRENT__TENANT__ROLES);

  const userRoles = formData?.memberships?.find(
    (membership) => membership?.tenant === tenant,
  );

  const [roleUpdateMutation, { loading: updating }] = useMutation(
    IDENTITY_UPDATE_CURRENT_TENANT_USER_ROLE,
    Notify({
      successTitle: 'User role successfully updated!',
      onSuccess() {
        reset();
        onSubmissionDone();
      },
    }),
  );

  const [createUser, { loading: creating }] = useMutation(
    IDENTITY_ADD_USER_TO_CURRENT_TENANT,
    Notify({
      successTitle: 'User successfully created!',
      onSuccess() {
        reset();
        onSubmissionDone();
      },
    }),
  );

  useEffect(() => {
    if (operationType === 'update') {
      setValue('email', formData?.email || '');
      setValue('roles', userRoles?.roles || []);
    } else {
      setValue('email', '');
      setValue('roles', []);
    }
  }, [formData, userRoles]);

  const onSubmit = (values: IUserForm) => {
    if (operationType == 'create') {
      createUser({
        variables: {
          input: {
            roles: values.roles,
            email: values.email,
          },
        },
      });
    } else {
      roleUpdateMutation({
        variables: {
          roles: values.roles,
          userId: operationId,
        },
      });
    }
  };

  return (
    <div>
      <Title order={4}>
        <span className="capitalize">{operationType} Employee roles </span>
      </Title>
      <Space h={'md'} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input.Wrapper
          label="Email"
          error={<ErrorMessage name="email" errors={errors} />}
        >
          <Input
            disabled={operationType === 'update'}
            placeholder="Write email"
            {...register('email')}
          />
        </Input.Wrapper>

        <Input.Wrapper
          label="Select Roles"
          withAsterisk
          error={<ErrorMessage name={'departmentId'} errors={errors} />}
        >
          <MultiSelect
            searchable
            clearable
            onChange={(roles) => {
              setValue('roles', roles || '', {
                shouldValidate: true,
              });
            }}
            placeholder="Select Role"
            data={
              roleData?.identity__currentTenantRoles.map((role) => role.name) ||
              []
            }
            value={watch('roles')}
          />
        </Input.Wrapper>

        <Button type="submit" loading={creating || updating} fullWidth>
          Save
        </Button>
      </form>
    </div>
  );
};

export default UserCreateForm;

export const formValidationSchema = Yup.object().shape({
  email: Yup.string().email().required().label('Email'),
  roles: Yup.array().of(Yup.string().required('At least one Role is required')),
});

interface IUserForm {
  email: string;
  roles?: string[];
}
