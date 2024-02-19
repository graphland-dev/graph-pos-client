import { Notify } from "@/_app/common/Notification/Notify";
import Attachments from "@/_app/common/components/Attachments";
import {
  MatchOperator,
  ServerFileReference,
  Supplier,
} from "@/_app/graphql-models/graphql";
import { FOLDER__NAME } from "@/_app/models/FolderName";
import { useMutation } from "@apollo/client";
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
  const attachments =
    supplierDetails?.attachments?.map((file) => ({
      meta: file.meta,
      path: file.path,
      provider: file.provider,
    })) ?? [];

  // console.log(attachments);
  // update suppliers
  const [updateAttachmentsMutation] = useMutation(
    PEOPLE_UPDATE_SUPPLIERS,
    Notify({
      sucTitle: "Attachments saved successfully!",
      onSuccess() {
        refetch();
      },
    })
  );

  const handleUpload = (files: ServerFileReference[]) => {
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
              ...attachments,
              ...(files?.map((att) => ({
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
        attachments={attachments}
        enableUploader
        onUploadDone={(files) => {
          handleUpload(files);
        }}
        folder={FOLDER__NAME.SUPPLIER_ATTACHMENTS}
      />
      {/* {uploadedfiles.length > 0 && (
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
      )} */}
    </div>
  );
};

export default SupplierDetailsDocuments;
