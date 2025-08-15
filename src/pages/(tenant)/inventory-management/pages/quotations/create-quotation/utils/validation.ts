import * as yup from "yup";

const productItemReferenceSchema = yup.object({
  referenceId: yup.string().required("Product reference ID is required"),
  name: yup.string().required("Product name is required"),
  unitPrice: yup.number().min(0, "Unit price must be positive").required("Unit price is required"),
  quantity: yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
  unitSellPrice: yup.number().min(0, "Unit sell price must be positive").required("Unit sell price is required"),
  discountAmount: yup.number().min(0, "Discount amount must be positive").optional(),
  taxRate: yup.number().min(0, "Tax rate must be positive").optional(),
  taxAmount: yup.number().min(0, "Tax amount must be positive").optional(),
});

export const quotationValidationSchema = yup.object({
  clientId: yup.string().required("Client is required"),
  date: yup.date().required("Date is required"),
  validUntil: yup
    .date()
    .required("Valid until date is required")
    .min(yup.ref("date"), "Valid until must be after quotation date"),
  note: yup.string().optional(),
  terms: yup.string().optional(),
  products: yup
    .array()
    .of(productItemReferenceSchema)
    .min(1, "At least one product is required")
    .required("Products are required"),
  discountMode: yup.string().required("Discount mode is required"),
  discountValue: yup.number().min(0, "Discount value must be positive").optional(),
});