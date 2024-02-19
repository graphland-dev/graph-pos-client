import Attachments from "@/_app/common/components/Attachments";
import { ServerFileReference } from "@/_app/graphql-models/graphql";
import React from "react";

interface IDocumentsDetailsProps {
  id: string | undefined;
  refetch: () => void;
}
const EmployeeDetailsDocuments: React.FC<IDocumentsDetailsProps> = () => {
  const [uploadedfiles, setUploadedFiles] = React.useState<
    ServerFileReference[]
  >([]);

  // const [updateEmployeeWithAttachments, { loading }] = useMutation(
  //   PEOPLE_EMPLOYEES_UPDATE_MUTATION,
  //   Notify({
  //     sucTitle: "Attachments saved successfully!",
  //     onSuccess() {
  //       refetch();
  //     },
  //   })
  // );

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
    </div>
  );
};

export default EmployeeDetailsDocuments;
