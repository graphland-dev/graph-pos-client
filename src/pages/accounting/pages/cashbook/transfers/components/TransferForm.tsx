import { Account, MatchOperator } from "@/_app/graphql-models/graphql";
import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Badge,
  Button,
  Input,
  Select,
  Space,
  Textarea,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  ACCOUNT_CREATE_TRANSFER_MUTATION,
  ACCOUNT_UPDATE_TRANSFER_MUTATION,
} from "../ulits/query";
import { getAccountBalance } from "@/_app/common/utils/getBalance";

interface IAccountTransferFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update";
  operationId?: string | null;
  formData?: any;
  accounts?: Account[];
}

const TransferForm: React.FC<IAccountTransferFormProps> = ({
  onSubmissionDone,
  formData,
  operationType,
  operationId,
  accounts,
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

  useEffect(() => {
    setValue("fromAccountId", formData?.fromAccount?._id);
    setValue("toAccountId", formData?.toAccount?._id);
    setValue("note", formData?.["note"]);
    setValue("date", formData?.["date"] || new Date().toISOString());
    setValue("amount", formData?.["amount"]);
  }, [formData]);

  const accountListForDrop = accounts?.map((item) => ({
    value: item?._id,
    label: `${item?.name} [${item?.referenceNumber}]`,
  }));

  const [transferCreateMutation, { loading: transferCreateLoading }] =
    useMutation(ACCOUNT_CREATE_TRANSFER_MUTATION);
  const [transferUpdateMutation, { loading: transferUpdateLoading }] =
    useMutation(ACCOUNT_UPDATE_TRANSFER_MUTATION);

  const onSubmit = (data: any) => {
    if (operationType === "create") {
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
    }

    if (operationType === "update") {
      transferUpdateMutation({
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
        <span className="capitalize">{operationType}</span> a Balance Transfer
      </Title>
      <Space h={"lg"} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select
          searchable
          withAsterisk
          onChange={(fromAccountId) =>
            setValue("fromAccountId", fromAccountId || "")
          }
          label="From Account"
          placeholder="From Account"
          data={accountListForDrop || []}
          value={watch("fromAccountId")}
        />

        {watch("fromAccountId") && (
          <Badge p={"md"}>
            Available Balance:{" "}
            {getAccountBalance(accounts || [], watch("fromAccountId"))}
          </Badge>
        )}

        <Select
          searchable
          withAsterisk
          onChange={(toAccountId) => setValue("toAccountId", toAccountId || "")}
          label="To Account"
          placeholder="To Account"
          data={
            accountListForDrop?.filter(
              (a) => a.value !== watch("fromAccountId")
            ) || []
          }
          value={watch("toAccountId")}
          disabled={!watch("fromAccountId")}
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

        <Button
          loading={transferUpdateLoading || transferCreateLoading}
          type="submit"
          disabled={
            getAccountBalance(accounts || [], watch("fromAccountId")) <
            watch("amount")
          }
        >
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
