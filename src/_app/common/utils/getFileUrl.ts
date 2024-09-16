import {
  ServerFileProvider,
  ServerFileReference,
} from '@/_app/graphql-models/graphql';

export const getFileUrl = (file: ServerFileReference) => {
  const path = file?.path;
  const provider = file?.provider;

  if (file?.externalUrl) {
    return file?.externalUrl;
  }

  if (provider === ServerFileProvider.S3) {
    return `https://graph-pos.s3.ap-southeast-1.amazonaws.com/${path}`;
  }
};
