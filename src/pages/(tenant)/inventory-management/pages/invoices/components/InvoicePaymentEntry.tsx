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
  invoiceId: string;
  clientId: string;
  payableAmount: number;
}

const InvoicePaymentEntry: React.FC<IProps> = ({
  onDone,
  invoiceId,
  clientId,
  payableAmount,
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

  const [paymentToInvoice, { loading: __payment__inprogress }] = useMutation<{
    accounting__createInventoryInvoicePayment: CommonMutationResponse;
  }>(
    Create_Invoice_Payment,
    commonNotifierCallback({
      successTitle: "Payment successful",
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
      payments: [
        // Required
        {
          accountId: "",
          amount: payableAmount || 0,
          type: "Cash",
        },
      ],
    },
    resolver: yupResolver(InvoicePayment_Form_Validation),
    mode: "onChange",
  });
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "payments",
  });

  const handleSubmit: SubmitHandler<
    Yup.InferType<typeof InvoicePayment_Form_Validation>
  > = (values) => {
    const formPaidAmount =
      form.watch("payments")?.reduce((a, b) => a + b.amount, 0) || 0;
    if (payableAmount <= 0 || formPaidAmount > payableAmount) {
      showNotification({
        message: "Invalid payment amount",
        color: "red",
      });
      return;
    }

    paymentToInvoice({
      variables: {
        body: {
          clientId,
          invoiceId,
          payments: values?.payments,
          poReference: values?.poReference,
          receptNo: values?.receptNo,
          reference: values?.reference,
          paymentTerm: values?.paymentTerm,
          date: values?.date,
        },
      },
    });
  };
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-1">
        <Input.Wrapper
          label="Reference"
          error={
            <ErrorMessage name={`reference`} errors={form.formState.errors} />
          }
        >
          <Input placeholder="Reference" {...form.register(`reference`)} />
        </Input.Wrapper>

        <Input.Wrapper
          label="PO Reference"
          error={
            <ErrorMessage name={`poReference`} errors={form.formState.errors} />
          }
        >
          <Input placeholder="PO Reference" {...form.register(`poReference`)} />
        </Input.Wrapper>

        <Input.Wrapper
          label="Receipt No"
          error={
            <ErrorMessage name={`receiptNo`} errors={form.formState.errors} />
          }
        >
          <Input placeholder="Receipt no" {...form.register(`receptNo`)} />
        </Input.Wrapper>

        {/* <Input.Wrapper
          label="Payment Term"
          error={
            <ErrorMessage name={`paymentTerm`} errors={form.formState.errors} />
          }
        >
          <Textarea
            placeholder="Payment Term"
            {...form.register(`paymentTerm`)}
          />
        </Input.Wrapper>

        <Input.Wrapper
          label="Note"
          error={<ErrorMessage name={`note`} errors={form.formState.errors} />}
        >
          <Textarea placeholder="Note" {...form.register("note")} />
        </Input.Wrapper> */}

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
                name={`payments.${idx}.accountId`}
                errors={form.formState.errors}
              />
            }
          >
            <Select
              data={accountListForDrop ?? []}
              withAsterisk
              defaultValue={form.watch(`payments.${idx}.accountId`)}
              placeholder="Select account"
              onChange={(e) => form.setValue(`payments.${idx}.accountId`, e!)}
            />
            {/* <Space h={5} /> */}
          </Input.Wrapper>
          <Space h={5} />
          <Input.Wrapper
            size="md"
            label="Payment Type"
            withAsterisk
            error={
              <ErrorMessage
                name={`payments.${idx}.type`}
                errors={form.formState.errors}
              />
            }
          >
            <Select
              placeholder="Pick a payment type"
              withAsterisk
              data={["Cash", "Bank Transfer", "Card", "MFS"]}
              onChange={(e) => form.setValue(`payments.${idx}.type`, e!)}
              defaultValue={form.watch(`payments.${idx}.type`)}
            />
          </Input.Wrapper>
          <Space h={5} />
          <Input.Wrapper
            label="Amount"
            size="md"
            error={
              <ErrorMessage
                name={`payments.${idx}.amount`}
                errors={form.formState.errors}
              />
            }
            withAsterisk
          >
            <NumberInput
              placeholder="Amount"
              onChange={(e) =>
                form.setValue(`payments.${idx}.amount`, parseInt(e as string))
              }
              value={form.watch(`payments.${idx}.amount`)}
              min={0}
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
            type: "",
            amount: 0,
          })
        }
      >
        [Add new]
      </Anchor>
      <Space h={5} />

      <Button
        disabled={payableAmount <= 0 || form.watch("payments").length === 0}
        type="submit"
        loading={__payment__inprogress}
      >
        Entry Payment
      </Button>
    </form>
  );
};

export default InvoicePaymentEntry;

export const InvoicePayment_Form_Validation = Yup.object().shape({
  clientId: Yup.string().optional().nullable().label("Client"),
  invoiceId: Yup.string().optional().nullable().label("Invoice Id"),
  payments: Yup.array()
    .of(
      Yup.object().shape({
        accountId: Yup.string().required().label("Account"),
        type: Yup.string().required().label("Payment type"),
        amount: Yup.number().required().label("Amount"),
      })
    )
    .required()
    .label("Payments"),
  poReference: Yup.string().optional().nullable().label("PO reference"),
  receptNo: Yup.string().optional().nullable().label("Receipt no"),
  reference: Yup.string().optional().nullable().label("Reference"),
  paymentTerm: Yup.string().optional().nullable().label("Payment term"),
  note: Yup.string().optional().nullable().label("Note"),
  date: Yup.date().optional().nullable().label("Date"),
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

export const Create_Invoice_Payment = gql`
  mutation Accounting__createInventoryInvoicePayment(
    $body: CreateInventoryInvoicePaymentInput!
  ) {
    accounting__createInventoryInvoicePayment(body: $body) {
      _id
    }
  }
`;
