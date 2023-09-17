import { Button, Input, Space, Switch, Textarea, Title } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@apollo/client";
import { ACCOUNT_CREATE_MUTATION } from "../utils/query";

interface IAccountFormProps {
  onSubmissionDone: () => void;
}

const AccountForm: React.FC<IAccountFormProps> = ({ onSubmissionDone }) => {
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

  const [mutate] = useMutation(ACCOUNT_CREATE_MUTATION);

  const onSubmit = (data: any) => {
    mutate({
      variables: {
        body: data,
      },
      onCompleted: (res) => {
        console.log(res);
        onSubmissionDone();
      },
      onError: (err) => console.log(err),
    });
  };

  console.log(watch("openedAt"), new Date(watch("openedAt")).toLocaleString());
  return (
    <div>
      <Title order={4}>Account Create</Title>
      <Space h={"lg"} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input.Wrapper
          error={<ErrorMessage name={"name"} errors={errors} />}
          label="Name"
        >
          <Input placeholder="Name" {...register("name")} />
        </Input.Wrapper>
        <Input.Wrapper
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
          error={<ErrorMessage name={"referenceNumber"} errors={errors} />}
        >
          <Input
            placeholder="Reference Number"
            {...register("referenceNumber")}
          />
        </Input.Wrapper>
        <DateTimePicker
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
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
};

export default AccountForm;

const validationSchema = yup.object({
  name: yup.string().required("Required"),
  brunchName: yup.string().required(),
  note: yup.string().optional(),
  referenceNumber: yup.string().optional(),
  openedAt: yup.string().required(),
  isActive: yup.boolean().optional(),
});
