import { showNotification } from "@mantine/notifications";
import {
  CommonMutationResponse,
  CreateProductQuotationInput,
  ProductDiscountMode,
  ProductItemReference,
} from "@/commons/graphql-models/graphql";
import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  Group,
  Paper,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import React from "react";
import { useForm } from "react-hook-form";
import { IPosFormType } from "../../pos.page";
import { CREATE_PRODUCT_QUOTATION_MUTATION } from "../../../quotations/utils/query.quotations";
import * as yup from "yup";

interface ExtendedFormData extends IPosFormType {
  quotationNetTotalBill: number;
  quotationDiscountPercentage: number;
}

interface IQuotationFormProps {
  formData: ExtendedFormData;
  onSuccess: ({ quotationId }: { quotationId: string }) => void;
  onRefetchHoldList: () => void;
}

const quotationValidationSchema = yup.object({
  validUntil: yup.date().required("Valid until date is required"),
  note: yup.string().optional(),
});

const QuotationForm: React.FC<IQuotationFormProps> = ({
  formData,
  onSuccess,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(quotationValidationSchema),
    defaultValues: {
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      note: "",
    },
  });

  const [createQuotation, { loading }] = useMutation<{
    inventory__createProductQuotation: CommonMutationResponse & {
      quotationUID: string;
    };
  }>(CREATE_PRODUCT_QUOTATION_MUTATION, {
    onCompleted: (data) => {
      showNotification({
        title: "Success",
        message: `Quotation created successfully with UID: ${data.inventory__createProductQuotation.quotationUID}`,
        color: "green",
      });
      onSuccess({
        quotationId: data.inventory__createProductQuotation._id,
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const onSubmit = async (data: any) => {
    const quotationData: CreateProductQuotationInput = {
      clientId: formData.clientId || "",
      date: new Date(),
      validUntil: data.validUntil,
      note: data.note,
      products: formData.products.map((product: ProductItemReference) => ({
        referenceId: product.referenceId,
        name: product.name,
        unitPrice: product.unitPrice || 0,
        quantity: product.quantity,
        unitSellPrice: product.unitSellPrice || 0,
        discountAmount: product.discountAmount || 0,
        taxRate: product.taxRate || 0,
        taxAmount: product.taxAmount || 0,
      })),
      quotationDiscountMode: ProductDiscountMode.Amount,
      quotationDiscountAmount: 0,
      quotationDiscountPercentage: 0,
    };

    createQuotation({
      variables: {
        input: quotationData,
      },
    });
  };

  const validUntil = watch("validUntil");
  const note = watch("note");

  return (
    <Paper p="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Alert color="blue" title="Create Quotation">
          Convert your current cart into a quotation that can be sent to the client for approval.
        </Alert>

        <DateInput
          label="Valid Until"
          placeholder="Select valid until date"
          value={validUntil}
          onChange={(date) => setValue("validUntil", date || new Date())}
          error={<ErrorMessage errors={errors} name="validUntil" />}
          required
        />

        <Textarea
          label="Notes"
          placeholder="Additional notes for the quotation..."
          value={note}
          onChange={(event) => setValue("note", event.currentTarget.value)}
          rows={3}
        />

        <Paper withBorder p="sm" className="bg-gray-50">
          <Group position="apart">
            <div>
              <div className="text-sm text-gray-600">Total Items:</div>
              <div className="font-semibold">{formData.products.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Quotation Total:</div>
              <div className="font-semibold text-lg">
                {formData.quotationNetTotalBill?.toLocaleString()} BDT
              </div>
            </div>
          </Group>
        </Paper>

        <Group position="right">
          <Button
            type="submit"
            loading={loading}
            color="blue"
            size="md"
          >
            Create Quotation
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default QuotationForm;