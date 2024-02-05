import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Space, Title } from "@mantine/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { ACCOUNTING_EXPENSE_CATEGORY_CREATE_MUTATION, ACCOUNTING_EXPENSE_CATEGORY_UPDATE_MUTATION } from "../utils/query";
import { useMutation } from "@apollo/client";
import { MatchOperator } from "@/_app/graphql-models/graphql";

interface IExpenseCategoryFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update";
  operationId?: string | null;
  formData?: any;
}

const ExpenseCategoryForm: React.FC<IExpenseCategoryFormProps> = ({
  onSubmissionDone,
  operationType,
  operationId,
  formData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    setValue("name", formData?.name);
  }, [formData]);
    
    const [createMutation, { loading: creating }] = useMutation(
      ACCOUNTING_EXPENSE_CATEGORY_CREATE_MUTATION
    );
    const [updateMutation, { loading: updating }] = useMutation(
      ACCOUNTING_EXPENSE_CATEGORY_UPDATE_MUTATION
    );

    
     const onSubmit = (data: any) => {
       if (operationType === "create") {
         createMutation({
           variables: {
             body: data,
           },
           onCompleted: (res) => {
             console.log(res);
             onSubmissionDone();
           },
           onError: (error) => console.log(error),
         });
       }

       if (operationType === "update") {
         updateMutation({
           variables: {
             where: {
               key: "_id",
               operator: MatchOperator.Eq,
               value: operationId,
             },
             body: data,
           },
           onCompleted: (res) => {
             console.log(res);
             onSubmissionDone();
           },
           onError: (err) => console.log(err),
         });
       }
     };

  return (
    <div>
      <Title order={4}>
        <span className="capitalize">{operationType}</span> Expense
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
        <Button loading={creating || updating} type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};

export default ExpenseCategoryForm;

const validationSchema = yup.object({
  name: yup.string().required().label("Bank Name"),
});
