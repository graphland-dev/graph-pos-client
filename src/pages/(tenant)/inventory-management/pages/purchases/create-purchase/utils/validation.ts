import * as Yup from "yup";

export const Schema_Validation = Yup.object().shape({
  purchaseDate: Yup.date().required().label("Purchase date"),
  purchaseOrderDate: Yup.date().required().label("Purchase order date"),
  note: Yup.string().optional().label("Note"),
  products: Yup.array()
    .required()
    .min(1, "You must have to select at least one product")
    .label("Purchase products"),
  costs: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required().label("Name"),
      amount: Yup.number().required().label("Amount"),
      note: Yup.string().optional().nullable().label("Cost note"),
    })
  ),
  supplierId: Yup.string().required().label("Supplier"),
  taxRate: Yup.number().required().label("Tax percentage"),
});

export interface ICreatePurchaseFormState
  extends Yup.Asserts<typeof Schema_Validation> {}

// Yup.object().shape({
//   name: Yup.string().required().label("Name"),
//   amount: Yup.number().required().label("Amount"),
//   note: Yup.string().optional().nullable().label("Cost note"),
// });
