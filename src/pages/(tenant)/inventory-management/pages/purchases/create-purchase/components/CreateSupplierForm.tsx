import { Notify } from '@/_app/common/Notification/Notify';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space } from '@mantine/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { PURCHASE__SUPPLIER_CREATE } from '../utils/products.query';

interface ICreateSupplierFormProps {
  onRefetchSuppliers: () => void;
  onClose: () => void;
}

const CreateSupplierForm: React.FC<ICreateSupplierFormProps> = ({
  onRefetchSuppliers,
  onClose,
}) => {
  const [createSupplier, { loading: creatingSupplier }] = useMutation(
    PURCHASE__SUPPLIER_CREATE,
    Notify({
      successTitle: 'Purchase supplier created successfully!',
      onSuccess() {
        onRefetchSuppliers();
        onClose();
      },
    }),
  );

  const {
    handleSubmit: handleCreateSupplierForm,
    register: registerCreateSupplierForm,
    formState: { errors: createSupplierErrors },
  } = useForm({
    defaultValues: {
      name: '',
      contactNumber: '',
      companyName: '',
    },
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required().label('Name'),
        contactNumber: Yup.string().required().label('Contact number'),
        companyName: Yup.string().required().label('Company name'),
      }),
    ),
  });

  const createSupplierFormSubmit = (values: any) => {
    createSupplier({
      variables: {
        body: values,
      },
    });
  };

  return (
    <form onSubmit={handleCreateSupplierForm(createSupplierFormSubmit)}>
      <Input.Wrapper
        label="Supplier name"
        error={<ErrorMessage errors={createSupplierErrors} name="name" />}
      >
        <Input
          placeholder="Write supplier name"
          {...registerCreateSupplierForm('name')}
        />
      </Input.Wrapper>

      <Space h={'sm'} />

      <Input.Wrapper
        label="Supplier contact number"
        error={
          <ErrorMessage errors={createSupplierErrors} name="contactNumber" />
        }
      >
        <Input
          placeholder="Write supplier contact number"
          {...registerCreateSupplierForm('contactNumber')}
        />
      </Input.Wrapper>

      <Space h={'sm'} />

      <Input.Wrapper
        label="Company Name"
        error={
          <ErrorMessage errors={createSupplierErrors} name="companyName" />
        }
      >
        <Input
          placeholder="Write company name"
          {...registerCreateSupplierForm('companyName')}
        />
      </Input.Wrapper>

      <Space h={'sm'} />

      <Button type="submit" loading={creatingSupplier}>
        Save
      </Button>
    </form>
  );
};

export default CreateSupplierForm;
