import {
  ServerFileProvider,
  ServerFileReference,
} from '@/commons/graphql-models/graphql';

export const getFileUrl = (file: ServerFileReference) => {
  const path = file?.path;
  const provider = file?.provider;

  if (file?.externalUrl) {
    return file?.externalUrl;
  }

  if (provider === ServerFileProvider.S3) {
    return `https://cdn.pos.graphland.dev/${path}`;
  }
};
