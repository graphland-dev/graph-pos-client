import { Notify } from '@/_app/common/Notification/Notify';
import { getFileUrl } from '@/_app/utils/getFileUrl';
import {
  MatchOperator,
  Product,
  ServerFileInput,
  ServerFileReference,
} from '@/_app/graphql-models/graphql';
import { useServerFile } from '@/_app/hooks/use-upload-file';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Card,
  FileButton,
  Flex,
  Input,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconPlus, IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiUpload } from 'react-icons/fi';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import {
  INVENTORY_PRODUCT_MEDIA_QUERY,
  INVENTORY_PRODUCT_UPDATE,
} from '../../utils/productEdit.query';

// import 'react-image-crop/dist/ReactCrop.css';

const MediaTab: React.FC = () => {
  const { productId } = useParams();

  const { data: mediaData, refetch } = useQuery<{
    inventory__product: Product;
  }>(INVENTORY_PRODUCT_MEDIA_QUERY, {
    variables: {
      where: {
        key: '_id',
        operator: MatchOperator.Eq,
        value: productId,
      },
    },
  });

  const [thumbnail, setThumbnail] = useState<ServerFileInput>();
  const [galleryPhotos, setGalleryPhotos] = useState<ServerFileReference[]>([]);

  const {
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gallery: [
        {
          meta: '',
          path: '',
          provider: '',
        },
      ],
    },
    resolver: yupResolver(UPLOAD_PHOTOS_FORM),
    mode: 'onChange',
  });

  const { append, fields, remove } = useFieldArray({
    control,
    name: 'gallery',
  });

  const { uploadFile, deleteFiles, deleting } = useServerFile();

  function handleDeleteFile(index: number) {
    openConfirmModal({
      title: 'Sure to delete this file?',
      labels: {
        confirm: 'Yes, delete',
        cancel: 'No, keep',
      },
      onConfirm: () => {
        const sFile = galleryPhotos[index];
        deleteFiles([sFile.path as string])
          .then(() => {
            showNotification({
              title: 'File deleted',
              message: '',
              color: 'green',
            });
            setGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
            // onUploadDone?.(galleryPhotos.filter((_, i) => i !== index));
            remove(index);
          })
          .catch(() => {
            showNotification({
              title: 'Failed to delete file',
              message: '',
              color: 'red',
            });
          });
      },
    });
  }

  // prefill with prev data
  useEffect(() => {
    setValue(
      'gallery',
      mediaData?.inventory__product?.gallery?.map((g) => ({
        path: g?.path,
        meta: g?.meta,
        provider: g?.provider,
      })) as any,
    );
    setThumbnail({
      path: mediaData?.inventory__product?.thumbnail?.path,
      meta: mediaData?.inventory__product?.thumbnail?.meta,
      provider: mediaData?.inventory__product?.thumbnail?.provider,
    } as ServerFileInput);
  }, [mediaData]);

  // save media
  const [saveMedia, { loading: savingMedia }] = useMutation(
    INVENTORY_PRODUCT_UPDATE,
    Notify({
      sucTitle: 'Media galleries saved!',
      onSuccess() {
        refetch();
      },
    }),
  );

  const onSubmit = (values: any) => {
    saveMedia({
      variables: {
        body: {
          thumbnail,
          gallery: values?.gallery,
        },
        where: {
          key: '_id',
          operator: 'eq',
          value: productId,
        },
      },
    });
    console.log(values);
  };

  return (
    <Card title="Vendor Images" shadow="sm">
      <Card.Section p={'xs'} withBorder>
        <Text>Upload thumbnail and gallery</Text>
      </Card.Section>
      <Space h={'lg'} />
      <Title order={4} fw={500}>
        Medias
      </Title>
      <Space h={'md'} />
      <Input.Wrapper label="Thumbnail" size="md">
        <Space h={5} />
        <div className="relative w-6/12 overflow-hidden bg-gray-300 rounded-md">
          <div className="h-[200px] flex items-center justify-center">
            {thumbnail?.path ? (
              <img
                src={getFileUrl(thumbnail)!}
                alt="Thumbnail"
                className="object-cover object-center w-full h-52"
              />
            ) : (
              <HiOutlinePhotograph
                size={50}
                style={{ color: 'var(--theme-primary)' }}
              />
            )}
          </div>

          {/* 
					<ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
						<img src={src} />
					</ReactCrop> */}

          <div className="absolute bottom-3 right-3">
            <FileButton
              onChange={async (files) => {
                uploadFile({
                  files: [files!],
                  folder: 'Inventory_Product_Thumbnail',
                })
                  .then((res) => {
                    setThumbnail(res.data[0]);
                  })
                  .catch(() =>
                    showNotification({
                      title: 'Failed to upload files to server',
                      message: '',
                      color: 'red',
                    }),
                  );
              }}
              accept="image/png,image/jpeg"
            >
              {(props) => (
                <Button
                  // loading={uploading === 'PACKAGE_THUMBNAIL'}
                  // color='orange'
                  {...props}
                >
                  <FiUpload color="#fff" size={16} />
                </Button>
              )}
            </FileButton>
          </div>
        </div>
      </Input.Wrapper>
      <Space h={'xl'} />

      <Flex justify={'space-between'} align="center">
        <Title order={4} fw={500}>
          Upload Gallery Photos
        </Title>
        <Button
          leftIcon={<IconPlus size={20} />}
          variant="light"
          onClick={() =>
            append({
              meta: '',
              path: '',
              provider: '',
            })
          }
        >
          Add new
        </Button>
      </Flex>
      <Space h={'md'} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-3">
          {fields.map((_, idx: number) => (
            <Input.Wrapper
              label={`Photo ${idx + 1}`}
              size="md"
              key={idx}
              error={
                <ErrorMessage errors={errors} name={`gallery.${idx}.path`} />
              }
            >
              <Space h={5} />
              <div className="relative bg-gray-300 rounded-md ">
                <div className="h-[200px] flex items-center justify-center">
                  {watch(`gallery.${idx}`)?.path ? (
                    <img
                      src={
                        getFileUrl(
                          watch(`gallery.${idx}`) as ServerFileReference,
                        )!
                      }
                      alt="Thumbnail"
                      className="object-cover object-center w-full rounded-md h-52"
                    />
                  ) : (
                    <HiOutlinePhotograph size={50} color="#FF9D40" />
                  )}
                </div>
                <div className="absolute flex gap-3 bottom-3 right-3">
                  <Button
                    color="red"
                    loading={deleting}
                    onClick={() => {
                      if (watch(`gallery.${idx}`)?.path) {
                        handleDeleteFile(idx);
                      } else {
                        remove(idx);
                      }
                    }}
                  >
                    <IconX color="#fff" size={16} />
                  </Button>

                  <FileButton
                    onChange={async (files) => {
                      uploadFile({
                        files: [files!],
                        folder: 'Inventory_Product_Gallery',
                      })
                        .then((res) => {
                          setGalleryPhotos((prev) => {
                            prev.splice(idx, 1);
                            return [...prev, res?.data[0]];
                          });
                          setValue(`gallery.${idx}`, res?.data[0]);
                        })
                        .catch(() =>
                          showNotification({
                            title: 'Failed to upload files to server',
                            message: '',
                            color: 'red',
                          }),
                        );
                    }}
                    accept="image/png,image/jpeg"
                  >
                    {(props) => (
                      <Button {...props}>
                        <FiUpload color="#fff" size={16} />
                      </Button>
                    )}
                  </FileButton>
                </div>
              </div>
            </Input.Wrapper>
          ))}
        </div>
        <Space h={'md'} />
        <div>
          <Button type="submit" loading={savingMedia}>
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MediaTab;

export const UPLOAD_PHOTOS_FORM = Yup.object().shape({
  gallery: Yup.array().of(
    Yup.object().shape({
      meta: Yup.string().required(),
      path: Yup.string().required('File is not uploaded'),
      provider: Yup.string().required(),
    }),
  ),
});
