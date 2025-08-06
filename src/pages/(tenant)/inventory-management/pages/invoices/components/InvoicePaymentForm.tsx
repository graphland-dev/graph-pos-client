import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
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
import { ErrorMessage } from "@hookform/error-message";
import { gql, useQuery } from "@apollo/client";
import { AccountsWithPagination } from "@/commons/graphql-models/graphql";

const InvoicePaymentForm = () => {
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
          amount: 0,
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

  return (
    <>
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
        type="submit"
        loading={
          false
          // __creatingInvoice || __payment__inprogress
          // __creatingInvoice || __payment__inprogress || __updating__invoice
        }
        // disabled={
        //   // getTotalPaymentAmount(watch("payments")) >
        //   // formData?.invoiceNetTotalBill
        // }
      >
        Create Order
      </Button>
    </>
  );
};

export default InvoicePaymentForm;

export const InvoicePayment_Form_Validation = Yup.object().shape({
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
