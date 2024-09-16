import { commonNotifierCallback } from '@/commons/components/Notification/commonNotifierCallback.ts';
import Attachments from '@/commons/components/Attactment/Attachments.tsx';
import {
  Client,
  MatchOperator,
  ServerFileReference,
} from '@/commons/graphql-models/graphql';
import { FOLDER__NAME } from '@/commons/models/FolderName';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Textarea } from '@mantine/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import {
  PEOPLE_CREATE_CLIENT,
  PEOPLE_UPDATE_CLIENT,
} from '../utils/client.query';

interface IClientFormProps {
  onFormSubmitted: () => void;
  formData?: Client;
  action: 'CREATE' | 'EDIT';
}

const ClientCreateForm: React.FC<IClientFormProps> = ({
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
      contactNumber: '',
      email: '',
      address: '',
    },
    resolver: yupResolver(formValidationSchema),
  });

  const [uploadedfiles, setUploadedFiles] = React.useState<
    ServerFileReference[]
  >([]);

  useEffect(() => {
    setValue('name', formData?.name as string);
    setValue('email', formData?.email as string);
    setValue('address', formData?.address as string);
    setValue('contactNumber', formData?.contactNumber as string);
  }, [formData]);

  const [createClient, { loading: creating }] = useMutation(
    PEOPLE_CREATE_CLIENT,
    commonNotifierCallback({
      successTitle: 'Client successfully created!',
    }),
  );

  const [updateClient, { loading: updating }] = useMutation(
    PEOPLE_UPDATE_CLIENT,
    commonNotifierCallback({
      successTitle: 'Client successfully updated!',
    }),
  );

  const onSubmit = async (values: ICLIENTCREATEFORM) => {
    if (action === 'CREATE') {
      await createClient({
        variables: {
          body: {
            name: values.name,
            email: values.email,
            contactNumber: values.contactNumber,
            address: values.address,
            attachments: uploadedfiles || [],
          },
        },
      });
      reset();
      onFormSubmitted();
    } else {
      await updateClient({
        variables: {
          where: {
            key: '_id',
            operator: MatchOperator.Eq,
            value: formData?._id,
          },
          body: {
            name: values.name,
            email: values.email,
            contactNumber: values.contactNumber,
            address: values.address,
          },
        },
      });
      reset();
      onFormSubmitted();
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

        <div className="my-6">
          <Attachments
            attachments={formData?.attachments || []}
            enableUploader
            onUploadDone={(files) => {
              if (action === 'EDIT') {
                return updateClient({
                  variables: {
                    where: {
                      key: '_id',
                      operator: MatchOperator.Eq,
                      value: formData?._id,
                    },
                    body: {
                      attachments: files.map((file) => ({
                        path: file.path,
                        provider: file.provider,
                        meta: file.meta,
                      })),
                    },
                  },
                });
              }
              setUploadedFiles(
                files.map((file) => ({
                  path: file.path,
                  provider: file.provider,
                  meta: file.meta,
                })),
              );
            }}
            folder={FOLDER__NAME.CLIENT_ATTACHMENTS}
          />
        </div>

        <Button type="submit" loading={creating || updating} fullWidth>
          Save
        </Button>
      </form>
    </div>
  );
};

export default ClientCreateForm;

export const formValidationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  contactNumber: Yup.string().required().label('Contact number'),
  email: Yup.string().email().required().label('Email'),
  address: Yup.string().required().label('Address'),
});

interface ICLIENTCREATEFORM {
  name: string;
  contactNumber: string;
  email: string;
  address: string;
}
