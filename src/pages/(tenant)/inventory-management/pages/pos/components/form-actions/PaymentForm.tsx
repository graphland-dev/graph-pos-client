import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback.ts";
import {
  AccountsWithPagination,
  CommonMutationResponse,
  CreateProductInvoiceInput,
  InventoryInvoicePaymentItemInput,
  ProductDiscountMode,
  ProductItemReference,
} from "@/commons/graphql-models/graphql";
import { ACCOUNTING_ACCOUNTS_LIST } from "@/pages/(tenant)/accounting/pages/cashbook/accounts/utils/query";
import { useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Anchor,
  Button,
  Group,
  Input,
  List,
  NumberInput,
  Paper,
  Select,
  Space,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IPosFormType } from "../../pos.page";
import {
  Create_Invoice_Payment,
  Create_Product_Invoice,
} from "../../utils/query.payment";
import { Payment_Form_Validation } from "../../utils/validations/paymentForm.validation";

interface ExtendedFormData extends IPosFormType {
  invoiceNetTotalBill: number;
  invoiceDiscountPercentage: number;
}

interface IPaymentFormProps {
  formData: ExtendedFormData;
  onSuccess: ({ invoiceId }: { invoiceId: string }) => void;
  onRefetchHoldList: () => void;
  preMadeInvoiceId?: string;
}

const PaymentForm: React.FC<IPaymentFormProps> = ({
  formData,
  onSuccess,
  preMadeInvoiceId,
  // onRefetchHoldList,
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
      note: "",
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
  const [paymentToInvoice, { loading: __payment__inprogress }] = useMutation<{
    accounting__createInventoryInvoicePayment: CommonMutationResponse;
  }>(
    Create_Invoice_Payment,
    commonNotifierCallback({
      successTitle: "Payment successful",
      onSuccess(res) {
        onSuccess(res?.data?.accounting__createInventoryInvoicePayment?._id);
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
  // const [updateInvoice, { loading: __updating__invoice }] = useMutation(
  //   Update_Invoice_Status,
  //   {
  //     onCompleted: () => {
  //       onSuccess({ invoiceId: "" });
  //       onRefetchHoldList();
  //     },
  //   }
  // );

  // create invoice mutation
  const [createInvoiceMutation, { loading: __creatingInvoice }] = useMutation(
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
        // NOTE: finally
      });
    } else {
      createInvoiceMutation({
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
        console.log({ s: values?.payments, invoice });
        if (values?.payments?.length) {
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
          }).finally(() => {
            // debugger;
            onSuccess({
              invoiceId: invoice.data?.inventory__createProductInvoice?._id,
            });
          });
        } else {
          onSuccess({
            invoiceId: invoice.data?.inventory__createProductInvoice?._id,
          });
        }
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <Input.Wrapper
            label="Reference"
            error={<ErrorMessage name={`reference`} errors={errors} />}
          >
            <Input placeholder="Reference" {...register(`reference`)} />
          </Input.Wrapper>

          <Input.Wrapper
            label="PO Reference"
            error={<ErrorMessage name={`poReference`} errors={errors} />}
          >
            <Input placeholder="PO Reference" {...register(`poReference`)} />
          </Input.Wrapper>

          <Input.Wrapper
            label="Receipt No"
            error={<ErrorMessage name={`receiptNo`} errors={errors} />}
          >
            <Input placeholder="Receipt no" {...register(`receiptNo`)} />
          </Input.Wrapper>

          <Input.Wrapper
            label="Payment Term"
            error={<ErrorMessage name={`paymentTerm`} errors={errors} />}
          >
            <Textarea placeholder="Payment Term" {...register(`paymentTerm`)} />
          </Input.Wrapper>

          <Input.Wrapper
            label="Note"
            error={<ErrorMessage name={`note`} errors={errors} />}
          >
            <Textarea placeholder="Note" {...register("note")} />
          </Input.Wrapper>

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
        </div>

        <Space h={10} />

        <Alert>
          <List className="text-sm list-disc list-inside">
            <List.Item>
              If you want to add more payments, please click on the [Add new]
              button below.
            </List.Item>
            <List.Item>
              If you want to proceed this order without payment, remove all
              payment entry and click on the [Create Order] button.
            </List.Item>
          </List>
        </Alert>

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
            __creatingInvoice || __payment__inprogress
            // __creatingInvoice || __payment__inprogress || __updating__invoice
          }
          disabled={
            getTotalPaymentAmount(watch("payments")) >
            formData?.invoiceNetTotalBill
          }
        >
          Create Order
        </Button>
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
