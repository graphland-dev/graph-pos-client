import { ServerFileReference } from "@/_app/graphql-models/graphql";
import { useUploadFile } from "@/_app/hooks/use-upload-file";
import { Button, Flex, Paper, Text, UnstyledButton, rem } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import {
  IconCloudUpload,
  IconDownload,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import React, { useState } from "react";

interface IAttachmentUploadProps {
  attachments: ServerFileReference[];
  updateAttachmentsMutation: (input: any) => void;
  updating: boolean;
  isGridStyle?: boolean;
  folder: string;
}

const Attachments: React.FC<IAttachmentUploadProps> = ({
  attachments,
  folder,
}) => {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const { uploadFile, uploading } = useUploadFile();

  const handleUpload = () => {
    uploadFile({
      files: filesToUpload,
      folder,
    }).then((res) => {
      console.log("res", res);
    });
  };

  return (
    <div>
      {/* List */}
      <Text fw={"bold"} my={"md"}>
        Attachments
      </Text>

      <div className="p-5 border border-yellow-400 border-dashed">
        <Dropzone
          onDrop={(files) => {
            setFilesToUpload([...files, ...filesToUpload]);
          }}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 ** 2}
          className="flex items-center justify-center"
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
        <Flex direction={"column"} gap={"sm"} mt={"lg"}>
          {filesToUpload.map((file, idx) => (
            <Paper withBorder p={"sm"} bg={"yellow.1"} key={idx}>
              <div className="flex items-center justify-between">
                <p className="flex-1 line-clamp-1">{file?.name}</p>
                <UnstyledButton>
                  <IconTrash
                    size={24}
                    color="red"
                    onClick={() => {
                      setFilesToUpload((prev) => {
                        prev.splice(idx, 1);
                        return [...prev];
                      });
                    }}
                  />
                </UnstyledButton>
              </div>
            </Paper>
          ))}
        </Flex>

        {filesToUpload.length > 0 && (
          <Button
            onClick={handleUpload}
            mt={"md"}
            leftIcon={<IconCloudUpload />}
            size="sm"
            loading={uploading}
          >
            Upload
          </Button>
        )}
      </div>

      <Flex direction={"column"} gap={"sm"} mt={"lg"}>
        <Paper withBorder p={"sm"}>
          <div className="flex items-center justify-between">
            <p>File 1</p>
            <UnstyledButton>
              <IconDownload size={24} />
            </UnstyledButton>
          </div>
        </Paper>

        <Paper withBorder p={"sm"}>
          <div className="flex items-center justify-between">
            <p>File 1</p>
            <UnstyledButton>
              <IconDownload size={24} />
            </UnstyledButton>
          </div>
        </Paper>

        <Paper withBorder p={"sm"}>
          <div className="flex items-center justify-between">
            <p>File 1</p>
            <UnstyledButton>
              <IconDownload size={24} />
            </UnstyledButton>
          </div>
        </Paper>

        <Paper withBorder p={"sm"}>
          <div className="flex items-center justify-between">
            <p>File 1</p>
            <UnstyledButton>
              <IconDownload size={24} />
            </UnstyledButton>
          </div>
        </Paper>
      </Flex>

      {/* Uploader */}
      <pre>{JSON.stringify(attachments, null, 2)}</pre>
    </div>
  );
};

export default Attachments;
