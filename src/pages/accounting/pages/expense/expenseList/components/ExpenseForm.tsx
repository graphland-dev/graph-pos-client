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
import React from "react";
import * as yup from "yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { ACCOUNTING_EXPENSE_CREATE_MUTATION } from "../utils/query";
import { useMutation, useQuery } from "@apollo/client";
import { getAccountBalance } from "@/_app/common/utils/getBalance";
import { Account, ExpenseCategorysWithPagination } from "@/_app/graphql-models/graphql";
import { ACCOUNTING_EXPENSE_CATEGORY_QUERY_LIST } from "../../expenseCategory/utils/query";

interface IExpenseFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update";
  operationId?: string | null;
  formData?: any;
  accounts?: Account[];
}

const ExpenseForm: React.FC<IExpenseFormProps> = ({
  onSubmissionDone,
  operationType,
  formData,
  accounts,
}) => {
  const [createMutation, { loading: creating }] = useMutation(
    ACCOUNTING_EXPENSE_CREATE_MUTATION
  );

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(expenseListValidationSchema),
    defaultValues: {
      purpose: "",
      note: "",
      amount: 0.0,
      date: new Date().toISOString(),
      accountId: "",
      expenseCategory: "",
    },
  });

  const accountListForDrop = accounts?.map((item) => ({
    value: item?._id,
    label: `${item?.name} [${item?.referenceNumber}]`,
  }));

    const { data } = useQuery<{
      accounting__expenseCategorys: ExpenseCategorysWithPagination;
    }>(ACCOUNTING_EXPENSE_CATEGORY_QUERY_LIST, {
      variables: {
        where: {
          limit: 10,
          page: 1,
        },
      },
    });
  
  const expenseCategoryList = data?.accounting__expenseCategorys?.nodes?.map((item) => ({
    value: item._id,
    label: item.name,
  }))

  useEffect(() => {
    console.log(formData);
    setValue("purpose", formData?.["purpose"]);
    setValue("accountId", formData?.accountId?._id);
    setValue("accountId", formData?.expenseCategory?._id);
    setValue("amount", formData?.["amount"]);
    setValue("note", formData?.["note"]);
    setValue("voucherNo", formData?.["voucherNo"]);
    setValue("checkNo", formData?.["checkNo"]);
    setValue("date", formData?.["date"] || new Date().toISOString());
  }, [formData]);

  const onSubmit = (data: any) => {
    console.log(data);
    createMutation({
      variables: {
        body: {...data, expenseCategory: data?.expenseCategory},
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
      <Title order={4}>
        <span className="capitalize">{operationType}</span> Account
      </Title>
      <Space h={"lg"} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input.Wrapper
          withAsterisk
          error={<ErrorMessage name={"purpose"} errors={errors} />}
          label="Purpose"
        >
          <Input placeholder="purpose" {...register("purpose")} />
        </Input.Wrapper>
        <Input.Wrapper>
          <Select
            searchable
            withAsterisk
            onChange={(fromAccountId) =>
              setValue("accountId", fromAccountId || "")
            }
            label="Select account"
            placeholder="Select Account"
            data={accountListForDrop || []}
            value={watch("accountId")}
          />
        </Input.Wrapper>

        {watch("accountId") && (
          <Badge p={"md"}>
            Available Balance:{" "}
            {getAccountBalance(accounts || [], watch("accountId"))}
          </Badge>
        )}
        <Input.Wrapper label="Select Expense Category">
          <Select
            searchable
            withAsterisk
            onChange={(fromExpenseCategoryId) =>
              setValue("expenseCategory", fromExpenseCategoryId || "")
            }
            placeholder="Select Expense Category"
            data={expenseCategoryList || []}
            value={watch("expenseCategory")}
          />
        </Input.Wrapper>

        <Input.Wrapper
          withAsterisk
          error={<ErrorMessage name={"amount"} errors={errors} />}
          label="Amount"
        >
          <Input placeholder="amount" {...register("amount")} />
        </Input.Wrapper>
        <Textarea
          label="Note"
          {...register("note")}
          placeholder="Write your note"
        />
        <Input.Wrapper
          label="Voucher Number"
          error={<ErrorMessage name={"voucherNo"} errors={errors} />}
        >
          <Input placeholder="Voucher Number" {...register("voucherNo")} />
        </Input.Wrapper>
        <Input.Wrapper
          label="Check Number"
          error={<ErrorMessage name={"checkNo"} errors={errors} />}
        >
          <Input placeholder="Check Number" {...register("checkNo")} />
        </Input.Wrapper>
        <DateTimePicker
          withAsterisk
          {...register("date")}
          value={new Date(watch("date"))}
          className="w-full"
          valueFormat="DD MMM YYYY hh:mm A"
          onChange={(e) => {
            const dateTimeValue =
              e?.toISOString() || new Date()?.toISOString() || "";
            setValue("date", dateTimeValue);
          }}
          label="Date & Time"
          placeholder="Select your date and time"
          mx="auto"
        />

        <Button
          disabled={
            getAccountBalance(accounts || [], watch("accountId")) <
            watch("amount")
          }
          loading={creating}
          type="submit"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default ExpenseForm;

const expenseListValidationSchema = yup.object({
  purpose: yup.string().required().label("Purpose"),
  note: yup.string().optional().label("Note"),
  amount: yup.number().required().label("Amount of Balance"),
  voucherNo: yup.string().optional().label("Voucher Number"),
  checkNo: yup.string().optional().label("Check Number"),
  date: yup.string().required().label("Data"),
  accountId: yup.string().required().label("Bank Name"),
  expenseCategory: yup.string().required().label("Expense Category"),
});
