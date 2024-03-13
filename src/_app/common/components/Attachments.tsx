import { FileIcon, defaultStyles } from "react-file-icon";

import { ServerFileReference } from "@/_app/graphql-models/graphql";
import { useServerFile } from "@/_app/hooks/use-upload-file";
import {
  Flex,
  LoadingOverlay,
  Paper,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import {
  IconBucketDroplet,
  IconExternalLink,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { getFileUrl } from "../utils/getFileUrl";

interface IAttachmentUploadProps {
  attachments: ServerFileReference[];
  enableUploader?: boolean;
  enableDelete?: boolean;
  folder: string;
  title?: string;
  onUploadDone?: (files: ServerFileReference[]) => void;
}

const Attachments: React.FC<IAttachmentUploadProps> = ({
  attachments,
  folder,
  onUploadDone,
  enableUploader,
  title = "Attachments",
  enableDelete = true,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<ServerFileReference[]>(
    attachments || []
  );
  const { uploadFile, deleteFiles, uploading, deleting } = useServerFile();

  const handleUploadFiles = (files: File[]) => {
    uploadFile({
      files,
      folder,
    })
      .then((res) => {
        setUploadedFiles((prev) => [...prev, ...res.data]);
        onUploadDone?.([...uploadedFiles, ...res.data]);
      })
      .catch(() => {
        showNotification({
          title: "Failed to upload files to server",
          message: "",
          color: "red",
        });
      });
  };

  const handleDownloadFile = (file: ServerFileReference) => {
    window.open(getFileUrl(file));
  };

  function handleDeleteFile(index: number) {
    openConfirmModal({
      title: "Sure to delete this file?",
      labels: {
        confirm: "Yes, delete",
        cancel: "No, keep",
      },
      onConfirm: () => {
        const sFile = uploadedFiles[index];
        deleteFiles([sFile.path as string])
          .then(() => {
            showNotification({
              title: "File deleted",
              message: "",
              color: "green",
            });
            setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
            onUploadDone?.(uploadedFiles.filter((_, i) => i !== index));
          })
          .catch(() => {
            showNotification({
              title: "Failed to delete file",
              message: "",
              color: "red",
            });
          });
      },
    });
  }

  const fileExtension = (file: ServerFileReference) => {
    return JSON.parse(file?.meta || "{}")?.mimetype?.split("/")[1] || "file";
  };

  const getFileIconStyle = (file: ServerFileReference) => {
    const styles = defaultStyles as any;
    return styles[fileExtension(file)];
  };

  return (
    <div className="relative">
      <LoadingOverlay visible={uploading || deleting} />
      {/* List */}
      <Text fw={"bold"} my={"md"}>
        {title}
      </Text>

      {!enableUploader && attachments.length === 0 && (
        <Flex align={"center"} gap={"md"} className="p-4 border border-dashed">
          <IconBucketDroplet size={20} />
          <Text color="gray.6">No file attached</Text>
        </Flex>
      )}

      {enableUploader && (
        <div>
          <Dropzone
            onDrop={(files) => {
              handleUploadFiles(files);
            }}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            className="flex items-center justify-center"
            accept={[
              "image/*",
              MIME_TYPES.pdf,
              MIME_TYPES.doc,
              MIME_TYPES.docx,
              MIME_TYPES.xls,
              MIME_TYPES.xlsx,
              MIME_TYPES.ppt,
              MIME_TYPES.pptx,
              MIME_TYPES.csv,
              MIME_TYPES.zip,
            ]}
          >
            <Flex direction={"column"} gap={"sm"} align={"center"}>
              <IconUpload
                style={{
                  width: rem(42),
                  height: rem(42),
                  color: "var(--mantine-color-blue-6)",
                }}
                color="teal"
                stroke={1.5}
              />
              <Text color="gray.6" align={"center"}>
                Drag and drop files here
              </Text>
            </Flex>
          </Dropzone>

          {/* Future Upload */}
          {/* <Flex direction={"column"} gap={"sm"} mt={"lg"}>
            {uploadedFiles.map((file, idx) => (
              <Paper withBorder p={"sm"} key={idx}>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="flex-none w-6 mr-2">
                      <FileIcon
                        extension={fileExtension(file)}
                        {...getFileIconStyle(file)}
                      />
                    </div>
                    <p className="line-clamp-1">
                      {JSON.parse(file?.meta || "{}")?.originalname}
                    </p>
                  </div>
                  <UnstyledButton>
                    <IconTrash
                      size={24}
                      color="red"
                      onClick={() => handleDeleteFile(file)}
                    />
                  </UnstyledButton>
                </div>
              </Paper>
            ))}
          </Flex> */}
        </div>
      )}

      <Flex direction={"column"} gap={"sm"} mt={"lg"}>
        {uploadedFiles?.map((file, idx) => (
          <Paper withBorder p={"sm"} key={idx}>
            <div className="flex items-center justify-between">
              <Flex align={"center"} wrap={"wrap"}>
                <div className="flex-none w-6 mr-2">
                  <FileIcon
                    extension={fileExtension(file)}
                    {...getFileIconStyle(file)}
                  />
                </div>
                <Text className="flex-1 min-w-0 truncate">
                  {JSON.parse(file?.meta || "{}")?.originalname}
                </Text>
              </Flex>

              <Flex align={"center"}>
                {enableDelete && (
                  <UnstyledButton
                    onClick={() => handleDeleteFile(idx)}
                    className="pl-2"
                  >
                    <IconTrash size={24} />
                  </UnstyledButton>
                )}
                <UnstyledButton
                  onClick={() => handleDownloadFile(file)}
                  className="pl-2"
                >
                  <IconExternalLink size={24} />
                </UnstyledButton>
              </Flex>
            </div>
          </Paper>
        ))}
      </Flex>
    </div>
  );
};

export default Attachments;
