import {
  ServerFileProvider,
  ServerFileReference,
} from "@/_app/graphql-models/graphql";

export const getFileUrl = (file: ServerFileReference) => {
  const path = file?.path;
  const provider = file?.provider;

  if (file.externalUrl) {
    return file.externalUrl;
  }

  if (provider === ServerFileProvider.S3) {
    const meta = JSON.parse(file?.meta || "{}");
    return `https://${meta.bucket}.s3.${meta.region}.amazonaws.com/${path}`;
  }
};
