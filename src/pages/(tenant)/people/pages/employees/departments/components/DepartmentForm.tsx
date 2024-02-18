import Attachments from "@/_app/common/components/Attachments";
import {
  EmployeeDepartment,
  MatchOperator,
  ServerFileReference,
} from "@/_app/graphql-models/graphql";
import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Space, Textarea } from "@mantine/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import {
  CREATE_EMPLOYEE_DEPARTMENT,
  UPDATE_EMPLOYEE_DEPARTMENT,
} from "../utils/query";
import { FOLDER__NAME } from "@/_app/models/FolderName";

interface IDepartmentFormProps {
  onFormSubmitted: () => void;
  drawerHandler: {
    open: () => void;
    close: () => void;
  };

  formData: EmployeeDepartment;
  action: "CREATE" | "EDIT";
}
const validationSchema = Yup.object()
  .shape({
    name: Yup.string().required().label("Name"),
    note: Yup.string().optional().nullable(),
  })
  .label("Note");

interface IFormPayload {
  note?: string | null | undefined;
  name: string;
}

const DepartmentForm: React.FC<IDepartmentFormProps> = ({
  onFormSubmitted,
  drawerHandler,
  formData,
  action,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      note: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const attachments =
    formData?.attachments?.map((file) => ({
      meta: file.meta,
      path: file.path,
      provider: file.provider,
    })) ?? [];

  const [uploadedFiles, setUploadedFiles] =
    React.useState<ServerFileReference[]>(attachments);

  useEffect(() => {
    setValue("name", formData?.name);
    setValue("note", formData?.note);
  }, [formData]);

  const [createDepartment, { loading: creating }] = useMutation(
    CREATE_EMPLOYEE_DEPARTMENT,
    {
      onCompleted: () => {
        reset();
        onFormSubmitted();
        drawerHandler.close();
      },
    }
  );
  const [updateDepartment, { loading: updating }] = useMutation(
    UPDATE_EMPLOYEE_DEPARTMENT,
    {
      onCompleted: () => {
        reset();
        onFormSubmitted();
        drawerHandler.close();
      },
    }
  );

  const onSubmit = (v: IFormPayload) => {
    if (action === "CREATE") {
      createDepartment({
        variables: {
          body: v,
        },
      });
    } else {
      updateDepartment({
        variables: {
          body: {
            name: v.name,
            note: v.note,
            attachments:
              [
                ...attachments,
                ...(uploadedFiles?.map((att) => ({
                  meta: att?.meta,
                  path: att?.path,
                  provider: att?.provider,
                })) as ServerFileReference[]),
              ] ?? [],
          },
          where: {
            key: "_id",
            operator: MatchOperator.Eq,
            value: formData?._id,
          },
        },
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper
          label="Department name"
          error={<ErrorMessage errors={errors} name="name" />}
        >
          <Input placeholder="Enter department name" {...register("name")} />
        </Input.Wrapper>
        <Space h={"sm"} />
        <Input.Wrapper
          label="Note"
          error={<ErrorMessage errors={errors} name="note" />}
        >
          <Textarea placeholder="Write note ..." {...register("note")} />
        </Input.Wrapper>
        <Space h={"sm"} />
        {action === "EDIT" && (
          <>
            {/* <AttachmentUploadArea
            details={formData}
            folder="Graphland__Department__Attachments"
            updateAttachmentsMutation={updateDepartment}
            updating={updating}
            isGridStyle={true}
          /> */}
            <Attachments
              attachments={uploadedFiles}
              enableUploader
              onUploadDone={(files) => {
                setUploadedFiles(files);
                console.log(files);
              }}
              folder={FOLDER__NAME.EMPLOYEE_ATTACHMENTS}
            />
          </>
        )}
        <Button
          mt={"md"}
          fullWidth
          type="submit"
          loading={creating || updating}
        >
          Save
        </Button>
      </form>

      <Space h={"md"} />
    </div>
  );
};

export default DepartmentForm;
