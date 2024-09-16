import { commonNotifierCallback } from '@/commons/components/Notification/commonNotifierCallback.ts';
import { Vat } from '@/commons/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Select, Space } from '@mantine/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { PURCHASE__PRODUCT_CREATE } from '../utils/products.query';

interface ICreateProductFormProps {
  onRefetchProducts: () => void;
  onClose: () => void;
  vatProfiles: Vat[];
}

const CreateProductForm: React.FC<ICreateProductFormProps> = ({
  onRefetchProducts,
  onClose,
  vatProfiles,
}) => {
  const [createProduct, { loading: creatingProduct }] = useMutation(
    PURCHASE__PRODUCT_CREATE,
    commonNotifierCallback({
      successTitle: 'Purchase product created successfully!',
      onSuccess() {
        onRefetchProducts();
        onClose();
      },
    }),
  );

  const {
    handleSubmit: handleCreateProductForm,
    register: registerCreateProductForm,
    formState: { errors: createProductErrors },
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      code: '',
      vatId: '',
      price: 0,
    },
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required().label('Name'),
        code: Yup.string().required().label('Code'),
        price: Yup.number().required().label('Price'),
        vatId: Yup.string().required().label('Vat profile'),
      }),
    ),
  });

  const createProductFormSubmit = (values: any) => {
    createProduct({
      variables: {
        body: values,
      },
    });
  };

  return (
    <form onSubmit={handleCreateProductForm(createProductFormSubmit)}>
      <Input.Wrapper
        label="Product name"
        error={<ErrorMessage errors={createProductErrors} name="name" />}
      >
        <Input
          placeholder="Write product name"
          {...registerCreateProductForm('name')}
        />
      </Input.Wrapper>
      <Space h={'sm'} />
      <Input.Wrapper
        label="Product code"
        error={<ErrorMessage errors={createProductErrors} name="code" />}
      >
        <Input
          placeholder="Write product code"
          {...registerCreateProductForm('code')}
        />
      </Input.Wrapper>
      <Input.Wrapper
        label="Product price"
        error={<ErrorMessage errors={createProductErrors} name="price" />}
      >
        <Input
          placeholder="Product price"
          {...registerCreateProductForm('price')}
        />
      </Input.Wrapper>
      <Space h={'sm'} />
      <Input.Wrapper
        label="Vat profile"
        error={<ErrorMessage errors={createProductErrors} name="code" />}
      >
        <Select
          data={getVatProfileSelectInputData(vatProfiles!)}
          placeholder="Select vat profile"
          onChange={(v) => setValue('vatId', v!)}
        />
      </Input.Wrapper>
      <Space h={'sm'} />
      <Button type="submit" loading={creatingProduct}>
        Save
      </Button>
    </form>
  );
};

export default CreateProductForm;

export const getVatProfileSelectInputData = (data: Vat[]) => {
  const vats: any = [];

  data?.map((vat) =>
    vats.push({
      label: vat?.name,
      value: vat?._id,
    }),
  );

  return vats;
};
