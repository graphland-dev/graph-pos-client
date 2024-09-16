import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Textarea, Title } from '@mantine/core';
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { SETTINGS_BRAND_CREATE_MUTATION, SETTING_BRAND_UPDATE_MUTATION } from '../utils/query';
import { useMutation } from '@apollo/client';
import { MatchOperator } from '@/commons/graphql-models/graphql';

interface IBrandFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update";
  operationId?: string | null;
  formData?: any;

}

const BrandsForm: React.FC<IBrandFormProps> = ({ onSubmissionDone, operationType, operationId, formData }) => {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(vatValidationSchema),
    defaultValues: {
      name: "",
      note: "",
      code: "",
      percentage: 0.0,
    },
  })

  const [brandCreateMutation, { loading: createLoading }] = useMutation(SETTINGS_BRAND_CREATE_MUTATION);
  const [brandUpdateMutation, { loading: updateLoading }] = useMutation(SETTING_BRAND_UPDATE_MUTATION);

  useEffect(() => {
    setValue("name", formData?.name);
    setValue("code", formData?.code);
    setValue("note", formData?.note);
   
  }, [formData]);

  const onSubmit = (data: any) => {
    if (operationType === "create") {
      const createData = {
        code: data.code,
        note: data.note,
        name: data.name,

      };
      brandCreateMutation({
        variables: {
          body: createData,
        },
        onCompleted: () => {
          onSubmissionDone();
        },
        onError: (err) => console.log(err),
      });
    }

    if (operationType === "update") {
      const updateData = {
        code: data.code,
        note: data.note,
        name: data.name,
        
      };
      brandUpdateMutation({
        variables: {
          where: {
            key: "_id",
            operator: MatchOperator.Eq,
            value: operationId,
          },
          body: updateData,
        },
        onCompleted: (res) => {
          console.log(res);
          onSubmissionDone();
        },
        onError: (err) => console.log(err),
      });
    }
  }


  return (
    <div>
      <Title order={4}>
        <span className="capitalize">{operationType}</span> Account
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
          withAsterisk
          error={<ErrorMessage name={"code"} errors={errors} />}
          label="Code"
        >
          <Input placeholder="code" {...register("code")} />
        </Input.Wrapper>
        <Textarea
          label="Note"
          {...register("note")}
          placeholder="Write your note"
        />



        <Button

          loading={createLoading || updateLoading}
          type="submit"
        >
          Save
        </Button>
      </form>
    </div>
  )
}

export default BrandsForm

const vatValidationSchema = yup.object({
  name: yup.string().required().label("Name"),
  note: yup.string().optional().label("Note"),
  code: yup.string().required().label("Code"),
  percentage: yup.number().required().label("Percentage"),

});