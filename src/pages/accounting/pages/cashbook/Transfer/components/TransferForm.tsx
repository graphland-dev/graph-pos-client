import { useMutation, useQuery } from "@apollo/client";
import { ACCOUNT_CREATE_TRANSFER_MUTATION } from "../ulits/query";
import { Button, Input, Select, Space, Textarea, Title } from "@mantine/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ErrorMessage } from "@hookform/error-message";
import { DateTimePicker } from "@mantine/dates";
import { AccountsWithPagination } from "@/_app/graphql-models/graphql";
import { ACCOUNTING_ACCOUNTS_LIST } from "../../accounts/utils/query";
import { useEffect } from "react";

interface IAccountTransferFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update";
  operationId?: string | null;
  formData?: any;
}

const TransferForm: React.FC<IAccountTransferFormProps> = ({
  onSubmissionDone,
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
      note: "",
      fromAccountId: "",
      toAccountId: "",
      amount: 0.0,
      date: new Date().toISOString(),
    },
  });

  const { data: accountData } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTING_ACCOUNTS_LIST, {
    variables: {
      where: {
        limit: 10,
        page: 1,
      },
    },
  });

  useEffect(() => {
    if (formData?.date) {
      setValue("fromAccountId", formData?.fromAccount?._id);
      setValue("toAccountId", formData?.toAccount?._id);
      setValue("note", formData?.["note"]);
      setValue("date", formData?.["date"]);
      setValue("amount", formData?.["amount"]);
    } else {
      setValue("fromAccountId", "");
      setValue("toAccountId", "");
      setValue("note", "");
      setValue("date", new Date().toISOString());
      setValue("amount", 0.0);
    }
  }, [formData]);

  const allAccounts = accountData?.accounting__accounts?.nodes?.map((item) => {
    return {
      value: item._id,
      label: item.name,
    };
  });
  console.log(accountData?.accounting__accounts?.nodes);
  console.log(allAccounts);

  const [transferCreateMutation, { loading: transferLoading }] = useMutation(
    ACCOUNT_CREATE_TRANSFER_MUTATION
  );

  const onSubmit = (data: any) => {
    transferCreateMutation({
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
  return (
    <div>
      <Title order={4}>Create a Balance transfer</Title>
      <Space h={"lg"} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select
          searchable
          onChange={(e) => setValue("fromAccountId", e || "")}
          label="From Account"
          placeholder="From Account"
          data={allAccounts || []}
          value={watch("fromAccountId")}
        />
        <Select
          searchable
          onChange={(e) => setValue("toAccountId", e || "")}
          label="To Account"
          placeholder="To Account"
          data={allAccounts || []}
          value={watch("toAccountId")}
        />

        <Textarea
          label="Note"
          {...register("note")}
          placeholder="Write your note"
        />
        <Input.Wrapper
          label="Amount"
          withAsterisk
          error={<ErrorMessage name={"amount"} errors={errors} />}
        >
          <Input placeholder="Amount" {...register("amount")} />
        </Input.Wrapper>
        <DateTimePicker
          withAsterisk
          {...register("date")}
          className="w-full"
          valueFormat="DD MMM YYYY hh:mm A"
          value={new Date(watch("date"))}
          onChange={(e) => {
            const dateTimeValue = e?.toISOString() || new Date().toISOString();
            setValue("date", dateTimeValue);
          }}
          label="Date & Time"
          placeholder="Select your date and time"
          mx="auto"
        />

        <Button loading={transferLoading} type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};

export default TransferForm;

const validationSchema = yup.object({
  fromAccountId: yup.string().required().label("From Account"),
  toAccountId: yup.string().required().label("To Account"),
  note: yup.string().optional().label("Note"),
  amount: yup.number().required().label("Available Balance"),
  date: yup.string().required().label("Opening Data"),
});
