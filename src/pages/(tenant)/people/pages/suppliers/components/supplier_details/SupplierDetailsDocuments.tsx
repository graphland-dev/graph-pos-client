import { Notify } from "@/_app/common/Notification/Notify";
import Attachments from "@/_app/common/components/Attachments";
import {
  MatchOperator,
  ServerFileReference,
  Supplier,
} from "@/_app/graphql-models/graphql";
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
  const [uploadedfiles, setUploadedFiles] = React.useState<
    ServerFileReference[]
  >(supplierDetails?.attachments || []);

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

  const handleUpload = () => {
    updateAttachmentsMutation({
      variables: {
        where: {
          key: "_id",
          operator: MatchOperator.Eq,
          value: supplierDetails?._id,
        },
        body: {
          attachments: [
            ...uploadedfiles.map((file) => ({
              path: file.path,
              provider: file.provider,
              meta: file.meta,
            })),
            ...(supplierDetails?.attachments?.map((file) => ({
              path: file.path,
              provider: file.provider,
              meta: file.meta,
            })) || []),
          ],
        },
      },
    });
  };

  return (
    <div>
      <Attachments
        attachments={uploadedfiles || []}
        enableUploader
        onUploadDone={(files) => {
          setUploadedFiles([...files, ...uploadedfiles]);
          handleUpload();
        }}
        folder={"Graphland__Payroll__Attachments"}
      />
    </div>
  );
};

export default SupplierDetailsDocuments;
