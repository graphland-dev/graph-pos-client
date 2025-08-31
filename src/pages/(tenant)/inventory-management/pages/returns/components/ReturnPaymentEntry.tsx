import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback";
import {
  AccountsWithPagination,
  CommonMutationResponse,
} from "@/commons/graphql-models/graphql";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Anchor,
  Button,
  Group,
  Input,
  NumberInput,
  Paper,
  Select,
  Space,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";

interface IProps {
  onDone: () => void;
  productReturnId: string;
  remainingAmount: number;
}

const ReturnPaymentEntry: React.FC<IProps> = ({
  onDone,
  productReturnId,
  remainingAmount,
}) => {
  // accounts API
  const accountListQuery = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTING_ACCOUNTS_LIST, {
    variables: {
      where: {
        limit: -1,
        page: 1,
      },
    },
  });

  const [createReturnPayment, { loading: paymentInProgress }] = useMutation<{
    accounting__createReturnPayment: CommonMutationResponse;
  }>(
    CREATE_RETURN_PAYMENT,
    commonNotifierCallback({
      successTitle: "Return payment successful",
      onSuccess() {
        onDone();
      },
    })
  );

  // accounts data dropdown
  const accountListForDrop =
    accountListQuery.data?.accounting__accounts?.nodes?.map((item) => ({
      value: item?._id,
      label: `${item?.name} [${item?.referenceNumber}]`,
    }));

  const form = useForm({
    defaultValues: {
      date: new Date(),
      paymentItems: [
        {
          accountId: "",
          amount: remainingAmount || 0,
          type: "CASH",
        },
      ],
      reference: "",
      notes: "",
    },
    resolver: yupResolver(ReturnPayment_Form_Validation),
    mode: "onChange",
  });

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "paymentItems",
  });

  const handleSubmit: SubmitHandler<
    Yup.InferType<typeof ReturnPayment_Form_Validation>
  > = (values) => {
    const formPaidAmount =
      form.watch("paymentItems")?.reduce((a, b) => a + b.amount, 0) || 0;
    if (remainingAmount <= 0 || formPaidAmount > remainingAmount) {
      showNotification({
        message: "Invalid payment amount",
        color: "red",
      });
      return;
    }

    createReturnPayment({
      variables: {
        input: {
          productReturnId,
          paymentItems: values?.paymentItems,
        },
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-4">
        <Input.Wrapper
          label="Reference"
          error={
            <ErrorMessage name={`reference`} errors={form.formState.errors} />
          }
        >
          <Input placeholder="Reference" {...form.register(`reference`)} />
        </Input.Wrapper>

        <Input.Wrapper
          label="Notes"
          error={<ErrorMessage name={`notes`} errors={form.formState.errors} />}
        >
          <Input placeholder="Payment notes" {...form.register(`notes`)} />
        </Input.Wrapper>

        <Input.Wrapper
          label="Date"
          error={<ErrorMessage name={`date`} errors={form.formState.errors} />}
        >
          <DateInput
            placeholder="Pick a Date"
            onChange={(e) => form.setValue(`date`, e!)}
            defaultValue={form.watch(`date`)}
          />
        </Input.Wrapper>
      </div>

      <Space h={10} />
      {fields.map((_, idx) => (
        <Paper key={idx} className="relative" p={10} my={10} withBorder>
          <Input.Wrapper
            withAsterisk
            label="Account"
            size="md"
            error={
              <ErrorMessage
                name={`paymentItems.${idx}.accountId`}
                errors={form.formState.errors}
              />
            }
          >
            <Select
              data={accountListForDrop ?? []}
              withAsterisk
              defaultValue={form.watch(`paymentItems.${idx}.accountId`)}
              placeholder="Select account"
              onChange={(e) =>
                form.setValue(`paymentItems.${idx}.accountId`, e!)
              }
            />
          </Input.Wrapper>
          <Space h={5} />
          <Input.Wrapper
            size="md"
            label="Payment Type"
            withAsterisk
            error={
              <ErrorMessage
                name={`paymentItems.${idx}.type`}
                errors={form.formState.errors}
              />
            }
          >
            <Select
              placeholder="Pick a payment type"
              withAsterisk
              data={["CASH", "BANK_TRANSFER", "CARD", "MFS"]}
              onChange={(e) => form.setValue(`paymentItems.${idx}.type`, e!)}
              defaultValue={form.watch(`paymentItems.${idx}.type`)}
            />
          </Input.Wrapper>
          <Space h={5} />
          <Input.Wrapper
            label="Amount"
            size="md"
            error={
              <ErrorMessage
                name={`paymentItems.${idx}.amount`}
                errors={form.formState.errors}
              />
            }
            withAsterisk
          >
            <NumberInput
              placeholder="Amount"
              onChange={(e) =>
                form.setValue(
                  `paymentItems.${idx}.amount`,
                  parseInt(e as string)
                )
              }
              value={form.watch(`paymentItems.${idx}.amount`)}
              min={0}
              max={remainingAmount}
            />
          </Input.Wrapper>
          <Space h={5} />

          <Group position="right">
            <Button color="red" onClick={() => remove(idx)} size="xs">
              Remove
            </Button>
          </Group>
        </Paper>
      ))}
      <Anchor
        className="inline-block mb-8 text-sm"
        onClick={() =>
          append({
            accountId: "",
            type: "CASH",
            amount: 0,
          })
        }
      >
        [Add new payment method]
      </Anchor>
      <Space h={5} />

      <Button
        disabled={
          remainingAmount <= 0 || form.watch("paymentItems").length === 0
        }
        type="submit"
        loading={paymentInProgress}
        fullWidth
      >
        Process Payment
      </Button>
    </form>
  );
};

export default ReturnPaymentEntry;

export const ReturnPayment_Form_Validation = Yup.object().shape({
  productReturnId: Yup.string().optional().nullable().label("Return ID"),
  paymentItems: Yup.array()
    .of(
      Yup.object().shape({
        accountId: Yup.string().required().label("Account"),
        type: Yup.string().required().label("Payment type"),
        amount: Yup.number().required().min(1).label("Amount"),
      })
    )
    .required()
    .min(1)
    .label("Payment Items"),
  reference: Yup.string().optional().nullable().label("Reference"),
  notes: Yup.string().optional().nullable().label("Notes"),
  date: Yup.date().required().label("Date"),
});

const ACCOUNTING_ACCOUNTS_LIST = gql`
  query Accounts($where: CommonPaginationDto) {
    accounting__accounts(where: $where) {
      meta {
        totalCount
      }
      nodes {
        _id
        name
        referenceNumber
        brunchName
        openedAt
        note
        isActive
        creditAmount
        debitAmount
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_RETURN_PAYMENT = gql`
  mutation Accounting__createReturnPayment($input: CreateReturnPaymentInput!) {
    accounting__createReturnPayment(input: $input) {
      _id
    }
  }
`;
