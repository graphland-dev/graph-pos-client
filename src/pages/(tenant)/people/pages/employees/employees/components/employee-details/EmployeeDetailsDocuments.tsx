import Attachments from "@/_app/common/components/Attachments";
import {
  MatchOperator,
  ServerFileReference,
} from "@/_app/graphql-models/graphql";
import { useMutation } from "@apollo/client";
import { Button, Flex } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import React from "react";
import { PEOPLE_EMPLOYEES_UPDATE_MUTATION } from "../../utils/query";
import { Notify } from "@/_app/common/Notification/Notify";

interface IDocumentsDetailsProps {
  id: string | undefined;
  refetch: () => void;
}
const EmployeeDetailsDocuments: React.FC<IDocumentsDetailsProps> = ({
  id,
  refetch,
}) => {
  const [uploadedfiles, setUploadedFiles] = React.useState<
    ServerFileReference[]
  >([]);

  const [updateEmployeeWithAttachments, { loading }] = useMutation(
    PEOPLE_EMPLOYEES_UPDATE_MUTATION,
    Notify({
      sucTitle: "Attachments saved successfully!",
      onSuccess() {
        refetch();
      },
    })
  );

  const handleUpload = () => {
    updateEmployeeWithAttachments({
      variables: {
        where: {
          key: "_id",
          operator: MatchOperator.Eq,
          value: id,
        },
        body: {
          attachments:
            [
              ...(uploadedfiles?.map((att) => ({
                meta: att?.meta,
                path: att?.path,
                provider: att?.provider,
              })) as ServerFileReference[]),
            ] ?? [],
        },
      },
    });
  };

  return (
    <div>
      <Attachments
        attachments={uploadedfiles}
        enableUploader
        onUploadDone={(files) => {
          setUploadedFiles(files);
          console.log(files);
        }}
        folder={"Graphland__Payroll__Attachments"}
      />
      {uploadedfiles.length > 0 && (
        <Flex justify={"end"} mt={"md"}>
          <Button
            color="yellow.8"
            onClick={handleUpload}
            loading={loading}
            leftIcon={<IconUpload size={20} />}
          >
            Upload
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default EmployeeDetailsDocuments;
