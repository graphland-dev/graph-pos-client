import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Space, Textarea, Title } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  INVENTORY_PRODUCT_CATEGORY_CREATE,
  INVENTORY_PRODUCT_CATEGORY_UPDATE,
} from "../utils/category.query";
import { CategoryValidationSchema } from "../utils/category.validations";

interface ICreateAndUpdateCategoryFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update";
  operationId?: string | null;
  formData?: any;
  parentCategoryId?: string | null;
}

const CreateAndUpdateCategoryForm: React.FC<
  ICreateAndUpdateCategoryFormProps
> = ({
  onSubmissionDone,
  operationType,
  operationId,
  formData,
  parentCategoryId,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CategoryValidationSchema),
    defaultValues: {
      name: "",
      code: "",
      note: "",
      parentCategoryId: parentCategoryId || "",
    },
  });

  useEffect(() => {
    if (formData) {
      setValue("name", formData?.name || "");
      setValue("code", formData?.code || "");
      setValue("note", formData?.note || "");
      setValue("parentCategoryId", formData?.parentCategory || "");
    }
    if (parentCategoryId) {
      setValue("parentCategoryId", parentCategoryId);
    }
  }, [formData, parentCategoryId, setValue]);

  const [createMutation, { loading: creating }] = useMutation(
    INVENTORY_PRODUCT_CATEGORY_CREATE
  );
  const [updateMutation, { loading: updating }] = useMutation(
    INVENTORY_PRODUCT_CATEGORY_UPDATE
  );

  const onSubmit = (data: any) => {
    // Clean up the data - remove empty parentCategoryId
    const submitData = {
      ...data,
      parentCategoryId: data.parentCategoryId || null,
    };

    if (operationType === "create") {
      createMutation({
        variables: {
          body: submitData,
        },
        onCompleted: (res) => {
          console.log("Category created:", res);
          onSubmissionDone();
        },
        onError: (err) => console.error("Error creating category:", err),
      });
    }

    if (operationType === "update") {
      updateMutation({
        variables: {
          categoryId: operationId,
          body: submitData,
        },
        onCompleted: (res) => {
          console.log("Category updated:", res);
          onSubmissionDone();
        },
        onError: (err) => console.error("Error updating category:", err),
      });
    }
  };

  return (
    <div>
      <Title order={4}>
        <span className="capitalize">{operationType}</span> Category
      </Title>
      <Space h={"lg"} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input.Wrapper
          withAsterisk
          error={<ErrorMessage name={"name"} errors={errors} />}
          label="Name"
        >
          <Input placeholder="Name" {...register("name")} />
        </Input.Wrapper>
        <Input.Wrapper
          error={<ErrorMessage name={"code"} errors={errors} />}
          label="Code"
          description="Auto-generated from name if left empty"
        >
          <Input placeholder="Category code (optional)" {...register("code")} />
        </Input.Wrapper>

        <Textarea
          label="Note"
          {...register("note")}
          placeholder="Write your note"
        />

        <Button loading={creating || updating} type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};

export default CreateAndUpdateCategoryForm;
