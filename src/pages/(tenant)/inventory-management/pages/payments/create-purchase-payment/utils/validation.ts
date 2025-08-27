import * as Yup from "yup";

export const Purchase_Payment_Schema_Validation = Yup.object().shape({
  note: Yup.string().optional().label("Note"),
  checkNo: Yup.string().optional().label("Check no"),
  receptNo: Yup.string().optional().label("Recept no"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        _id: Yup.string().required().label("Purchase ID"),
        purchaseUID: Yup.string().required().label("Purchase UID"),
        netTotal: Yup.number().optional().label("Net Total"),
        paidAmount: Yup.number().optional().label("Paid Amount"),
        amount: Yup.number()
          .required("Payment amount is required")
          .min(0.01, "Payment amount must be greater than 0")
          .test(
            "max-due-amount",
            "Payment amount cannot exceed due amount",
            function (value) {
              const { netTotal, paidAmount } = this.parent;
              const dueAmount = (netTotal || 0) - (paidAmount || 0);
              return !value || value <= dueAmount;
            }
          )
          .label("Payment Amount"),
      })
    )
    .required()
    .min(1, "You must have to select at least one purchase item")
    .label("Purchase items"),
  supplierId: Yup.string().required().label("Supplier"),
  accountId: Yup.string().required().label("Account"),
  date: Yup.date().required().label("Purchase Date"),
});

export interface IPurchasePaymentFormState
  extends Yup.Asserts<typeof Purchase_Payment_Schema_Validation> {}
