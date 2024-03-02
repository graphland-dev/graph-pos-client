import Attachments from "@/_app/common/components/Attachments";
import { Employee, MatchOperator, ServerFileReference } from "@/_app/graphql-models/graphql";
import React from "react";
import { PEOPLE_EMPLOYEES_UPDATE_MUTATION } from "../../utils/query";
import { useMutation } from "@apollo/client";
import { Notify } from "@/_app/common/Notification/Notify";
import { FOLDER__NAME } from "@/_app/models/FolderName";

interface IDocumentsDetailsProps {
  employeeDetails: Employee | null;
  refetch: () => void;
}
const EmployeeDetailsDocuments: React.FC<IDocumentsDetailsProps> = ({refetch, employeeDetails}) => {
 
  
   const attachments =
     employeeDetails?.attachments?.map((file) => ({
       meta: file.meta,
       path: file.path,
       provider: file.provider,
     })) ?? [];

  const [updateEmployeeWithAttachments] = useMutation(
    PEOPLE_EMPLOYEES_UPDATE_MUTATION,
    Notify({
      sucTitle: "Attachments saved successfully!",
      onSuccess() {
        refetch();
      },
    })
  );

   const handleUpload = (files: ServerFileReference[]) => {
     updateEmployeeWithAttachments({
       variables: {
         where: {
           key: "_id",
           operator: MatchOperator.Eq,
           value: employeeDetails?._id,
         },
         body: {
           attachments: files?.map((att) => ({
             meta: att?.meta,
             path: att?.path,
             provider: att?.provider,
           })),
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
          console.log(files);
        }}
        folder={FOLDER__NAME.EMPLOYEE_ATTACHMENTS}
      />
    </div>
  );
};

export default EmployeeDetailsDocuments;
