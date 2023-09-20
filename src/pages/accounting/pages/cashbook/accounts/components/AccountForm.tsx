import { Button, Input, Space, Switch, Textarea, Title } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@apollo/client";
import {
  ACCOUNT_CREATE_MUTATION,
  ACCOUNT_UPDATE_MUTATION,
} from "../utils/query";
import { MatchOperator } from "@/_app/graphql-models/graphql";
import { useEffect } from "react";

interface IAccountFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update";
  operationId?: string | null;
  formData?: any;
}

const AccountForm: React.FC<IAccountFormProps> = ({
  onSubmissionDone,
  operationType,
  operationId,
  formData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      brunchName: "",
      note: "",
      referenceNumber: "",
      openedAt: new Date().toISOString(),
      isActive: false,
    },
  });

  useEffect(() => {
    setValue("name", formData?.["name"]);
    setValue("brunchName", formData?.["brunchName"]);
    setValue("note", formData?.["note"]);
    setValue("openedAt", formData?.["openedAt"]);
  }, [formData]);

  const [createMutation, { loading: creating }] = useMutation(
    ACCOUNT_CREATE_MUTATION
  );
  const [updateMutation, { loading: updating }] = useMutation(
    ACCOUNT_UPDATE_MUTATION
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
        onError: (err) => console.log(err),
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
          error={<ErrorMessage name={"brunchName"} errors={errors} />}
          label="Branch Name"
        >
          <Input placeholder="Branch Name" {...register("brunchName")} />
        </Input.Wrapper>
        <Textarea
          label="Note"
          {...register("note")}
          placeholder="Write your note"
        />
        <Input.Wrapper
          label="Reference Number"
          withAsterisk
          error={<ErrorMessage name={"referenceNumber"} errors={errors} />}
        >
          <Input
            placeholder="Reference Number"
            {...register("referenceNumber")}
          />
        </Input.Wrapper>
        <DateTimePicker
          withAsterisk
          {...register("openedAt")}
          className="w-full"
          valueFormat="DD MMM YYYY hh:mm A"
          value={new Date(watch("openedAt"))}
          onChange={(e) => {
            const dateTimeValue = e?.toISOString() || new Date().toISOString();
            setValue("openedAt", dateTimeValue);
          }}
          label="Date & Time"
          placeholder="Select your date and time"
          mx="auto"
        />

        <Switch
          checked={watch("isActive")}
          onChange={(event) => {
            console.log(event.currentTarget.checked);

            setValue("isActive", event.currentTarget.checked);
          }}
          label="Is active"
          size="lg"
          onLabel="True"
          offLabel="False"
        />
        <Button loading={creating || updating} type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};

export default AccountForm;

const validationSchema = yup.object({
  name: yup.string().required().label("Bank Name"),
  brunchName: yup.string().required().label("Brunch Name"),
  note: yup.string().optional().label("Note"),
  referenceNumber: yup.string().required().label("Reference Number"),
  openedAt: yup.string().required().label("Opening Data"),
  isActive: yup.boolean().optional().label("Active"),
});
