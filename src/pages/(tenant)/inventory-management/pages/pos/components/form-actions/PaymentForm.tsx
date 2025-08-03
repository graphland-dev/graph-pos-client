import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback.ts";
import {
  AccountsWithPagination,
  CreateProductInvoiceInput,
  InventoryInvoicePaymentItemInput,
  ProductDiscountMode,
  ProductItemReference,
  Purchase_Invoice_Status,
} from "@/commons/graphql-models/graphql";
import { ACCOUNTING_ACCOUNTS_LIST } from "@/pages/(tenant)/accounting/pages/cashbook/accounts/utils/query";
import { useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Group,
  Input,
  NumberInput,
  Paper,
  Select,
  Space,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IPosFormType } from "../../pos.page";
import {
  Create_Invoice_Payment,
  Create_Product_Invoice,
} from "../../utils/query.payment";
import { Update_Invoice_Status } from "../../utils/query.pos";
import { Payment_Form_Validation } from "../../utils/validations/paymentForm.validation";

interface ExtendedFormData extends IPosFormType {
  invoiceNetTotalBill: number;
  invoiceDiscountPercentage: number;
}

interface IPaymentFormProps {
  formData: ExtendedFormData;
  onSuccess: () => void;
  onRefetchHoldList: () => void;
  preMadeInvoiceId?: string;
}

const PaymentForm: React.FC<IPaymentFormProps> = ({
  formData,
  onSuccess,
  preMadeInvoiceId,
  onRefetchHoldList,
}) => {
  const getNetExtraDiscount = () => {
    if (formData.invoiceDiscountMode === ProductDiscountMode.Amount) {
      return formData.discountValue || 0;
    }

    if (formData.invoiceDiscountMode === ProductDiscountMode.Percentage) {
      const netSellPrice =
        formData.products
          ?.map((p: ProductItemReference) => {
            const unitSellPrice = p?.unitSellPrice || 0;
            const quantity = p?.quantity || 0;
            return unitSellPrice * quantity;
          })
          .reduce((a, b) => a + b, 0) || 0;
      return (formData.discountValue || 0) * (netSellPrice / 100);
    }

    return 0;
  };

  // accounts API
  const { data } = useQuery<{
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
  const accountListForDrop = data?.accounting__accounts?.nodes?.map((item) => ({
    value: item?._id,
    label: `${item?.name} [${item?.referenceNumber}]`,
  }));

  // payment form
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    register,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      receiptNo: "",
      paymentTerm: "",
      reference: "",
      poReference: "",
      date: new Date(),
      payments: [
        // Required
        {
          accountId: "",
          amount: formData?.invoiceNetTotalBill || 0,
          type: "Cash",
        },
      ],
    },
    resolver: yupResolver(Payment_Form_Validation),
    mode: "onChange",
  });

  // form fields array
  const { append, fields, remove } = useFieldArray({
    control,
    name: "payments",
  });

  // payment mutation
  const [paymentToInvoice, { loading: __payment__inprogress }] = useMutation(
    Create_Invoice_Payment,
    commonNotifierCallback({
      successTitle: "Payment successful",
      onSuccess() {
        onSuccess();
        reset({
          date: new Date(),
          paymentTerm: "",
          poReference: "",
          receiptNo: "",
          reference: "",
          payments: [],
        });
      },
    })
  );

  // payment mutation
  const [updateInvoice, { loading: __updating__invoice }] = useMutation(
    Update_Invoice_Status,
    {
      onCompleted: () => {
        onSuccess();
        onRefetchHoldList();
      },
    }
  );

  // create invoice mutation
  const [createInvoice, { loading: __creatingInvoice }] = useMutation(
    Create_Product_Invoice
  );

  // payment form submit
  const onSubmit = (values: any) => {
    if (preMadeInvoiceId) {
      paymentToInvoice({
        variables: {
          body: {
            clientId: formData?.clientId,
            invoiceId: preMadeInvoiceId,
            payments: values?.payments,
            poReference: values?.poReference,
            receptNo: values?.receptNo,
            reference: values?.reference,
            paymentTerm: values?.paymentTerm,
            date: values?.date,
          },
        },
      }).finally(() => {
        updateInvoice({
          variables: {
            invoiceId: preMadeInvoiceId,
            status:
              getTotalPaymentAmount(watch("payments")) ===
              formData?.invoiceNetTotalBill
                ? Purchase_Invoice_Status.Paid
                : Purchase_Invoice_Status.PartiallyPaid,
          },
        });
      });
    } else {
      createInvoice({
        variables: {
          input: {
            date: values?.date,
            products: formData.products.map((p) => ({
              referenceId: p.referenceId,
              code: p.code,
              name: p.name,
              quantity: p.quantity,
              unitPrice: p.unitPrice,
              unitSellPrice: p.unitSellPrice,
              taxRate: p.taxRate,
            })),
            clientId: formData?.clientId,
            invoiceDiscountMode:
              (formData.invoiceDiscountMode as ProductDiscountMode) ||
              ProductDiscountMode.Amount,
            invoiceDiscountAmount: getNetExtraDiscount(),
            invoiceDiscountPercentage: formData.invoiceDiscountPercentage,
          } satisfies CreateProductInvoiceInput,
        },
      }).then((invoice) => {
        paymentToInvoice({
          variables: {
            body: {
              clientId: formData?.clientId,
              invoiceId: invoice.data?.inventory__createProductInvoice?._id,
              payments: values?.payments,
              poReference: values?.poReference,
              receptNo: values?.receptNo,
              reference: values?.reference,
              paymentTerm: values?.paymentTerm,
              date: values?.date,
            },
          },
        });
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper
          label="Reference"
          error={<ErrorMessage name={`reference`} errors={errors} />}
        >
          <Input placeholder="Reference" {...register(`reference`)} />
        </Input.Wrapper>
        <Space h={5} />
        <Input.Wrapper
          label="PO Reference"
          error={<ErrorMessage name={`poReference`} errors={errors} />}
        >
          <Input placeholder="PO Reference" {...register(`poReference`)} />
        </Input.Wrapper>
        <Space h={5} />
        <Input.Wrapper
          label="Receipt No"
          error={<ErrorMessage name={`receiptNo`} errors={errors} />}
        >
          <Input placeholder="Receipt no" {...register(`receiptNo`)} />
        </Input.Wrapper>
        <Space h={5} />
        <Input.Wrapper
          label="Payment Term"
          error={<ErrorMessage name={`paymentTerm`} errors={errors} />}
        >
          <Input placeholder="Payment Term" {...register(`paymentTerm`)} />
        </Input.Wrapper>
        <Space h={5} />
        <Input.Wrapper
          label="Date"
          error={<ErrorMessage name={`date`} errors={errors} />}
        >
          <DateInput
            placeholder="Pick a Date"
            onChange={(e) => setValue(`date`, e!)}
            defaultValue={watch(`date`)}
          />
        </Input.Wrapper>

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
                  errors={errors}
                />
              }
            >
              <Select
                data={accountListForDrop ?? []}
                withAsterisk
                defaultValue={watch(`payments.${idx}.accountId`)}
                placeholder="Select account"
                onChange={(e) => setValue(`payments.${idx}.accountId`, e!)}
              />
              {/* <Space h={5} /> */}
            </Input.Wrapper>
            <Space h={5} />
            <Input.Wrapper
              size="md"
              label="Payment Type"
              withAsterisk
              error={
                <ErrorMessage name={`payments.${idx}.type`} errors={errors} />
              }
            >
              <Select
                placeholder="Pick a payment type"
                withAsterisk
                data={["Cash", "Bank Transfer", "Card", "MFS"]}
                onChange={(e) => setValue(`payments.${idx}.type`, e!)}
                defaultValue={watch(`payments.${idx}.type`)}
              />
            </Input.Wrapper>
            <Space h={5} />
            <Input.Wrapper
              label="Amount"
              size="md"
              error={
                <ErrorMessage name={`payments.${idx}.amount`} errors={errors} />
              }
              withAsterisk
            >
              <NumberInput
                placeholder="Amount"
                onChange={(e) =>
                  setValue(`payments.${idx}.amount`, parseInt(e as string))
                }
                value={watch(`payments.${idx}.amount`)}
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

        <Space h={5} />

        <Group position="left">
          <Button
            variant="subtle"
            onClick={() =>
              append({
                accountId: "",
                type: "",
                amount: 0,
              })
            }
          >
            Add new
          </Button>

          <Button
            type="submit"
            loading={
              __creatingInvoice || __payment__inprogress || __updating__invoice
            }
            disabled={
              getTotalPaymentAmount(watch("payments")) >
              formData?.invoiceNetTotalBill
            }
          >
            Make Payment
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default PaymentForm;

const getTotalPaymentAmount = (
  payments: InventoryInvoicePaymentItemInput[]
): number => {
  let totalPaymentAmount = 0;
  payments?.map(
    (payment: any) =>
      (totalPaymentAmount = totalPaymentAmount + payment?.amount)
  );
  return totalPaymentAmount;
};
