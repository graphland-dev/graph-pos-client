import * as Yup from 'yup';

export const Payment_Form_Validation = Yup.object().shape({
	clientId: Yup.string().optional().nullable().label('Client'),
	invoiceId: Yup.string().optional().nullable().label('Invoice Id'),
	payments: Yup.array()
		.of(
			Yup.object().shape({
				accountId: Yup.string().required().label('Account'),
				type: Yup.string().required().label('Payment type'),
				amount: Yup.number().required().label('Amount'),
			})
		)
		.required()
		.label('Payments'),
	poReference: Yup.string().optional().nullable().label('PO reference'),
	receiptNo: Yup.string().optional().nullable().label('Receipt no'),
	reference: Yup.string().optional().nullable().label('Reference'),
	paymentTerm: Yup.string().optional().nullable().label('Payment term'),
	date: Yup.date().optional().nullable().label('Date'),
});

export type IPaymentFormType = Yup.InferType<typeof Payment_Form_Validation>;
