import {
  Client,
  Employee,
  EmployeeDepartment,
  MatchOperator,
  Payroll,
  ServerFileReference,
  Supplier,
} from "@/_app/graphql-models/graphql";
import { useServerFile } from "@/_app/hooks/use-upload-file";
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Input,
  Paper,
  Space,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  IconDownload,
  IconFile,
  IconFiles,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";

interface IAttachmentUploadProps {
  details: Supplier | Employee | Client | EmployeeDepartment | Payroll | null;
  updateAttachmentsMutation: (input: any) => void;
  updating: boolean;
  isGridStyle?: boolean;
  folder: string;
}

const AttachmentUploadArea: React.FC<IAttachmentUploadProps> = ({
  details,
  updating,
  updateAttachmentsMutation,
  folder,
  isGridStyle,
}) => {
  // attachments state
  const [attachments, setAttachments] = useState<File[] | null>([]);

  // upload file
  const { uploadFile, uploading } = useServerFile();

  return (
    <Paper shadow="md" p={"lg"}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <IconFiles size={24} />
          <Title order={isGridStyle ? 4 : 3}>Document Attachments</Title>
        </div>
      </div>
      <Divider my="sm" />
      <div className={isGridStyle ? "grid gap-8" : "grid grid-cols-2 gap-3"}>
        <div>
          {details?.attachments?.length ? (
            <>
              {details?.attachments?.map((attachment, idx) => (
                <Paper
                  shadow="md"
                  p={10}
                  key={idx}
                  my={5}
                  className="flex items-center justify-between gap-2"
                  withBorder
                >
                  <div className="flex items-center gap-2">
                    <IconFile color="teal" size={24} />
                    <Text fw={500} fz={"xs"} className="line-clamp-1">
                      {attachment?.path}
                    </Text>
                  </div>

                  <Group position="right" align="center">
                    <ActionIcon color="blue" variant="subtle">
                      <IconDownload size={18} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="filled"
                      size={"sm"}
                      onClick={() => {
                        const restAttachments = details?.attachments?.filter(
                          (attach) => attach?.path !== attachment?.path
                        );
                        // console.log(restAttachments);

                        updateAttachmentsMutation({
                          variables: {
                            where: {
                              key: "_id",
                              operator: MatchOperator.Eq,
                              value: details?._id,
                            },
                            body: {
                              attachments:
                                [
                                  restAttachments?.map((att) => ({
                                    meta: att?.meta,
                                    path: att?.path,
                                    provider: att?.provider,
                                  })) as ServerFileReference[],
                                ] ?? [],
                            },
                          },
                        });
                      }}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <IconFiles color="red" size={24} />
              <Title order={5} color="red">
                No documents found!
              </Title>
            </div>
          )}{" "}
        </div>

        {isGridStyle && <Divider h={1} />}

        <div
          className={isGridStyle ? "pl-5" : "border-l-[2px] border-solid  pl-5"}
        >
          <Input.Wrapper size="md" label="Upload attachments">
            <Dropzone
              onDrop={(files) => {
                setAttachments((prev) => [...prev!, ...files]);
              }}
              onReject={(files) => console.log("rejected files", files)}
              maxSize={5 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              className="flex items-center justify-center"
            >
              <div>
                <IconUpload
                  style={{
                    width: rem(42),
                    height: rem(42),
                    color: "var(--mantine-color-blue-6)",
                  }}
                  color="teal"
                  stroke={1.5}
                />
              </div>
            </Dropzone>
          </Input.Wrapper>

          <Space h={"md"} />

          {Boolean(attachments?.length) && (
            <div>
              <Title order={5}>Selected files</Title>
              <Space h={5} />

              {attachments?.map((attachment: File, idx: number) => (
                <Paper
                  shadow="md"
                  p={10}
                  key={idx}
                  my={5}
                  className="flex items-center justify-between gap-2"
                  withBorder
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <IconFile color="teal" size={24} />
                      <Text fw={500} fz={"xs"} className="line-clamp-1">
                        {attachment?.name}
                      </Text>
                    </div>

                    <ActionIcon
                      onClick={() => {
                        setAttachments((prev) => {
                          prev?.splice(idx, 1);
                          return [...prev!];
                        });
                      }}
                    >
                      <IconX color="red" />
                    </ActionIcon>
                  </div>
                </Paper>
              ))}

              <Space h={"sm"} />
              <Group position="right">
                <Button
                  color="orange"
                  loading={uploading || updating}
                  onClick={async () => {
                    const res = await uploadFile({
                      files: attachments!,
                      folder,
                    }).finally(() => setAttachments([]));
                    updateAttachmentsMutation({
                      variables: {
                        where: {
                          key: "_id",
                          operator: MatchOperator.Eq,
                          value: details?._id,
                        },
                        body: {
                          attachments:
                            [
                              ...(details?.attachments?.map((att) => ({
                                meta: att?.meta,
                                path: att?.path,
                                provider: att?.provider,
                              })) as ServerFileReference[]),
                              ...(res?.data as ServerFileReference[]),
                            ] ?? [],
                        },
                      },
                    });
                  }}
                >
                  Upload
                </Button>
              </Group>
            </div>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default AttachmentUploadArea;
