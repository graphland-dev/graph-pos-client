import * as Yup from "yup";

export const Purchase_Payment_Schema_Validation = Yup.object().shape({
  note: Yup.string().optional().label("Note"),
  checkNo: Yup.string().optional().label("Check no"),
  receptNo: Yup.string().optional().label("Recept no"),
  items: Yup.array()
    .required()
    .min(1, "You must have to select at least one purchase item")
    .label("Purchase items"),
  supplierId: Yup.string().required().label("Supplier"),
  accountId: Yup.string().required().label("Account"),
  date: Yup.date().required().label("Purchase Date"),
});

export interface IPurchasePaymentFormState
  extends Yup.Asserts<typeof Purchase_Payment_Schema_Validation> {}
