import { getFileUrl } from '@/commons/utils/getFileUrl';
import { ErrorMessage } from '@hookform/error-message';
import {
  Button,
  Flex,
  Image,
  Input,
  Paper,
  Space,
  Text,
  Textarea,
  Title,
  clsx,
  rem,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconPhoto } from '@tabler/icons-react';
import { FaCamera } from 'react-icons/fa';
import { ORGANIZATION_OVERVIEW_INFO_UPDATE_MUTATION } from '../utils/overview.query.gql';
import { useMutation } from '@apollo/client';
import {
  IOrganizationFormType,
  ORGANIZATION_OVERVIEW_FORM_VALIDATION_SCHEMA,
} from '../utils/form.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useServerFile } from '@/commons/hooks/use-upload-file';
import { useEffect, useRef, useState } from 'react';
import { userTenantsAtom } from '@/commons/states/user.atom';
import { commonNotifierCallback } from '@/commons/components/Notification/commonNotifierCallback.ts';
import { FOLDER__NAME } from '@/commons/models/FolderName';
import { $triggerRefetchMe } from '@/commons/rxjs-controllers';

const OrganizationOverviewPage: React.FC = () => {
  const params = useParams<{ tenant: string }>();
  const [tenants] = useAtom(userTenantsAtom);
  const tenant = tenants?.find((t) => t.uid === params.tenant);
  const file = tenant?.logo;

  const { uploadFile, uploading } = useServerFile();
  const [organizationLogo, setOrganizationLogo] = useState({ path: null });
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  // form initiated
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IOrganizationFormType>({
    resolver: yupResolver(ORGANIZATION_OVERVIEW_FORM_VALIDATION_SCHEMA),
  });

  // prefill form with previous values
  useEffect(() => {
    setValue('name', tenant?.name || '');
    setValue('address', tenant?.address);
    setValue('businessPhoneNumber', tenant?.businessPhoneNumber);
    setValue('description', tenant?.description);
  }, [tenant]);

  // update mutation
  const [updateOrganizationInfo, { loading }] = useMutation(
    ORGANIZATION_OVERVIEW_INFO_UPDATE_MUTATION,
    commonNotifierCallback({
      successTitle: 'Organization information updated.',
      onSuccess() {
        $triggerRefetchMe.next(true);
      },
    }),
  );

  // submit form with update mutation
  const onSubmit = (values: IOrganizationFormType) => {
    updateOrganizationInfo({
      variables: {
        input: {
          logo: organizationLogo,
          address: values?.address,
          businessPhoneNumber: values?.businessPhoneNumber,
          description: values?.description,
          name: values?.name,
        },
      },
    });
  };

  useEffect(() => {
    if (organizationLogo.path !== null) {
      saveButtonRef?.current?.click();
    }
  }, [organizationLogo]);

  return (
    <div>
      <Paper px={20} py={20} radius={10} className="lg:w-8/12">
        <Title order={3}>Organization overview</Title>

        <Space h={20} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex align={'center'} gap={20}>
            <Dropzone
              onDrop={async (files) => {
                const res = await uploadFile({
                  files,
                  folder: FOLDER__NAME.USER__AVATAR,
                });
                if (res.data.length > 0) {
                  setOrganizationLogo(res.data[0]);
                }
              }}
              loading={uploading}
              maxSize={3 * 1024 ** 2}
              className={clsx(
                'flex items-center justify-center group p-0 m-0 h-[200px] w-[200px] rounded-full',
              )}
            >
              {!organizationLogo?.path && !file?.path ? (
                <IconPhoto
                  style={{
                    width: rem(80),
                    height: rem(80),
                    color: 'var(--mantine-color-blue-6)',
                  }}
                  stroke={1.5}
                />
              ) : (
                <div className="relative w-[200px] h-[200px]">
                  <Image
                    height="200px"
                    width="200px"
                    fit="cover"
                    className="overflow-hidden rounded-full"
                    src={
                      organizationLogo?.path
                        ? getFileUrl(organizationLogo)
                        : file?.path
                          ? getFileUrl(file)
                          : ''
                    }
                  />

                  <FaCamera
                    size={rem(55)}
                    color="white"
                    className="absolute shadow-xl opacity-0 group-hover:opacity-100"
                    style={{
                      transform: 'translate(-50%, -50%)',
                      top: '50%',
                      left: '50%',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.5s ease-in-out',
                    }}
                  />
                </div>
              )}
            </Dropzone>

            <Text fw={500}>Organization Logo</Text>
          </Flex>

          <Space h={'sm'} />

          <Input.Wrapper
            label="Name"
            error={<ErrorMessage name="name" errors={errors} />}
          >
            <Input placeholder="Organization name" {...register('name')} />
          </Input.Wrapper>

          <Space h={'xs'} />

          <Input.Wrapper label="Organization Uid">
            <Input
              placeholder="Organization uid"
              disabled
              value={tenant?.uid as string}
            />
          </Input.Wrapper>

          <Space h={'xs'} />

          <Input.Wrapper
            label="Business phone number"
            error={<ErrorMessage name="businessPhoneNumber" errors={errors} />}
          >
            <Input
              placeholder="Business phone number"
              {...register('businessPhoneNumber')}
            />
          </Input.Wrapper>

          <Space h={'xs'} />

          <Input.Wrapper
            label="Address"
            error={<ErrorMessage name="address" errors={errors} />}
          >
            <Input placeholder="Address" {...register('address')} />
          </Input.Wrapper>

          <Space h={'xs'} />

          <Input.Wrapper
            label="Description"
            error={<ErrorMessage name="description" errors={errors} />}
          >
            <Textarea placeholder="Description" {...register('description')} />
          </Input.Wrapper>

          <Space h={'sm'} />

          <Button ref={saveButtonRef} type="submit" loading={loading}>
            Save
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default OrganizationOverviewPage;
