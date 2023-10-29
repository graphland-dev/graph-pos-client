import * as Yup from 'yup';

export const Purchase_Payment_Schema_Validation = Yup.object().shape({
	note: Yup.string().optional().label('Note'),
	checkNo: Yup.string().optional().label('Check no'),
	receptNo: Yup.string().optional().label('Recept no'),
	products: Yup.array()
		.required()
		.min(1, 'You must have to select at least one product')
		.label('Purchase products'),
	items: Yup.array()
		.min(1, 'You must have to select at least one purchase item')
		.of(
			Yup.object().shape({
				amount: Yup.number().required().label('Amount'),
				purchaseId: Yup.string().required().label('Purchase Id'),
			})
		),
	supplierId: Yup.string().required().label('Supplier'),
	accountId: Yup.string().required().label('Account'),
});

export interface IPurchasePaymentFormState
	extends Yup.Asserts<typeof Purchase_Payment_Schema_Validation> {}
