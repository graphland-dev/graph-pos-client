import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Space, Textarea, Title } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {useEffect} from "react";
import { SETTINGS_VAT_CREATE_MUTATION, SETTINGS_VAT_UPDATE_MUTATION } from "../utils/query";
import { MatchOperator } from "@/_app/graphql-models/graphql";

interface IVatFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update";
  operationId?: string | null;
  formData?: any;
  
}

const VatForm: React.FC<IVatFormProps> = ({onSubmissionDone, operationType, operationId, formData}) => {

  const {register, setValue, handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(vatValidationSchema),
    defaultValues: {
      name: "",
      note: "",
      code : "",
      percentage: 0.0,
    },
  })


  const [vatCreateMutation, {loading: createLoading}] = useMutation(SETTINGS_VAT_CREATE_MUTATION)
  const [vatUpdateMutation, {loading: updateLoading}] = useMutation(SETTINGS_VAT_UPDATE_MUTATION)


  useEffect(() => {
    setValue("name", formData?.name);
    setValue("code", formData?.code);
    setValue("note", formData?.note);
    setValue("percentage", formData?.percentage);
  }, [formData]);

  const onSubmit = (data:any) => {
    if (operationType === "create") {
      vatCreateMutation({
        variables: {
          body: {...data, percentage: parseFloat(data?.percentage)},
        },
        onCompleted: () => {
          onSubmissionDone();
        },
        onError: (err) => console.log(err),
      });
    }

    if (operationType === "update") {
      const updateData = {
        departmentId: data.departmentId,
       
      };
      vatUpdateMutation({
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
      <Input.Wrapper
        label="Percentage"
        withAsterisk
        error={<ErrorMessage name={"percentage"} errors={errors} />}
      >
        <Input placeholder="Percentage" {...register("percentage")} />
      </Input.Wrapper>
     
      

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

export default VatForm

const vatValidationSchema = yup.object({
  name: yup.string().required().label("Name"),
  note: yup.string().optional().label("Note"),
  code: yup.string().required().label("Code"),
  percentage: yup.number().required().label("Percentage"),
  
});