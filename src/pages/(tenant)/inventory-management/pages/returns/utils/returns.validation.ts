import * as Yup from "yup";

export const createReturnValidationSchema = Yup.object().shape({
  invoiceId: Yup.string().required("Invoice is required"),

  returnItems: Yup.array()
    .of(
      Yup.object().shape({
        referenceId: Yup.string().required("Product reference is required"),
        returnQuantity: Yup.number()
          .positive("Return quantity must be positive")
          .integer("Return quantity must be a whole number")
          .required("Return quantity is required"),
        condition: Yup.string().required("Product condition is required"),
        canRestock: Yup.boolean().default(true),
        itemNotes: Yup.string().max(
          500,
          "Item notes cannot exceed 500 characters"
        ),
      })
    )
    .min(1, "At least one item must be selected for return")
    .required("Return items are required"),

  reason: Yup.string().required("Return reason is required"),

  returnType: Yup.string().required("Return type is required"),

  reasonDescription: Yup.string().max(
    1000,
    "Reason description cannot exceed 1000 characters"
  ),

  restockingFee: Yup.number()
    .min(0, "Restocking fee cannot be negative")
    .nullable(),

  customerNotes: Yup.string().max(
    1000,
    "Customer notes cannot exceed 1000 characters"
  ),

  internalNotes: Yup.string().max(
    1000,
    "Internal notes cannot exceed 1000 characters"
  ),

  reference: Yup.string().max(100, "Reference cannot exceed 100 characters"),

  returnDate: Yup.date()
    .max(new Date(), "Return date cannot be in the future")
    .nullable(),
});

export type CreateReturnFormData = Yup.InferType<
  typeof createReturnValidationSchema
>;

// Validation for individual return item quantity against original
export const validateReturnQuantity = (
  returnQuantity: number,
  originalQuantity: number,
  alreadyReturnedQuantity: number = 0
) => {
  const availableQuantity = originalQuantity - alreadyReturnedQuantity;

  if (returnQuantity > availableQuantity) {
    return `Cannot return ${returnQuantity} items. Only ${availableQuantity} available for return.`;
  }

  if (returnQuantity <= 0) {
    return "Return quantity must be greater than 0";
  }

  return null;
};
