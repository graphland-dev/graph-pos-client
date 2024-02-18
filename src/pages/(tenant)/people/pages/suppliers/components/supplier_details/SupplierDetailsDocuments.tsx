import { Notify } from "@/_app/common/Notification/Notify";
import Attachments from "@/_app/common/components/Attachments";
import {
  MatchOperator,
  ServerFileReference,
  Supplier,
} from "@/_app/graphql-models/graphql";
import { useMutation } from "@apollo/client";
import { Button, Flex } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import React from "react";
import { PEOPLE_UPDATE_SUPPLIERS } from "../../utils/suppliers.query";

interface ISupplierDetailsProps {
  supplierDetails: Supplier | null;
  refetch: () => void;
}

const SupplierDetailsDocuments: React.FC<ISupplierDetailsProps> = ({
  supplierDetails,
  refetch,
}) => {
  const [uploadedfiles, setUploadedFiles] = React.useState<
    ServerFileReference[]
  >([]);
  // update suppliers
  const [updateAttachmentsMutation, { loading }] = useMutation(
    PEOPLE_UPDATE_SUPPLIERS,
    Notify({
      sucTitle: "Attachments saved successfully!",
      onSuccess() {
        refetch();
      },
    })
  );

  const handleUpload = () => {
    console.log(uploadedfiles);
    updateAttachmentsMutation({
      variables: {
        where: {
          key: "_id",
          operator: MatchOperator.Eq,
          value: supplierDetails?._id,
        },
        body: {
          attachments:
            [
              ...uploadedfiles?.map((att) => ({
                meta: att?.meta,
                path: att?.path,
                provider: att?.provider,
              })) as ServerFileReference[],
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

export default SupplierDetailsDocuments;
