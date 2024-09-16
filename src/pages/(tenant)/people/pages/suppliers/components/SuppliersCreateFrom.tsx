import { Notify } from '@/_app/common/Notification/Notify';
import { MatchOperator, Supplier } from '@/_app/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Textarea } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import {
  PEOPLE_CREATE_SUPPLIERS,
  PEOPLE_UPDATE_SUPPLIERS,
} from '../utils/suppliers.query';

interface IClientFormProps {
  onFormSubmitted: () => void;
  formData?: Supplier;
  action: 'CREATE' | 'EDIT';
}

const SuppliersCreateFrom: React.FC<IClientFormProps> = ({
  onFormSubmitted,
  action,
  formData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      companyName: '',
      contactNumber: '',
      email: '',
      address: '',
    },
    resolver: yupResolver(formValidationSchema),
  });

  useEffect(() => {
    setValue('name', formData?.name as string);
    setValue('companyName', formData?.companyName as string);
    setValue('email', formData?.email as string);
    setValue('address', formData?.address as string);
    setValue('contactNumber', formData?.contactNumber as string);
  }, [formData]);

  const [createSupplier, { loading: creating }] = useMutation(
    PEOPLE_CREATE_SUPPLIERS,
    Notify({
      successTitle: 'Supplier successfully created!',
      onSuccess() {
        reset();
        onFormSubmitted();
      },
    }),
  );

  const [updateSupplier, { loading: updating }] = useMutation(
    PEOPLE_UPDATE_SUPPLIERS,
    Notify({
      successTitle: 'Supplier successfully updated!',
      onSuccess() {
        reset();
        onFormSubmitted();
      },
    }),
  );

  const onSubmit = (values: ISUPPLIERSCREATEFORM) => {
    if (action === 'CREATE') {
      createSupplier({
        variables: {
          body: {
            name: values.name,
            companyName: values.companyName,
            email: values.email,
            contactNumber: values.contactNumber,
            address: values.address,
          },
        },
      });
    } else {
      updateSupplier({
        variables: {
          where: {
            key: '_id',
            operator: MatchOperator.Eq,
            value: formData?._id,
          },

          body: {
            name: values.name,
            companyName: values.companyName,
            email: values.email,
            contactNumber: values.contactNumber,
            address: values.address,
          },
        },
      });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper
          label="Name"
          error={<ErrorMessage name="name" errors={errors} />}
        >
          <Input placeholder="Write client name" {...register('name')} />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Input.Wrapper
          label="Company name"
          error={<ErrorMessage name="companyName" errors={errors} />}
        >
          <Input
            placeholder="Write company name"
            {...register('companyName')}
          />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Input.Wrapper
          label="Email"
          error={<ErrorMessage name="email" errors={errors} />}
        >
          <Input placeholder="Write email" {...register('email')} />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Input.Wrapper
          label="Contact number"
          error={<ErrorMessage name="contactNumber" errors={errors} />}
        >
          <Input
            placeholder="Write contact number"
            {...register('contactNumber')}
          />
        </Input.Wrapper>
        <Space h={'sm'} />

        <Input.Wrapper
          label="Address"
          error={<ErrorMessage name="address" errors={errors} />}
        >
          <Textarea placeholder="Write address" {...register('address')} />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Button type="submit" loading={creating || updating} fullWidth>
          Save
        </Button>
      </form>
    </div>
  );
};

export default SuppliersCreateFrom;

export const formValidationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  companyName: Yup.string().required().label('Company Name'),
  contactNumber: Yup.string().required().label('Contact number'),
  email: Yup.string().email().required().label('Email'),
  address: Yup.string().required().label('Address'),
});

interface ISUPPLIERSCREATEFORM {
  name: string;
  companyName: string;
  contactNumber: string;
  email: string;
  address: string;
}
