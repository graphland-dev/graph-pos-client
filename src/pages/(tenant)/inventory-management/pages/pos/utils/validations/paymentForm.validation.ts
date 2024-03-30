import * as Yup from 'yup';

export const Payment_Form_Validation = Yup.object().shape({
	clientId: Yup.string().required().label('Client'),
	invoiceId: Yup.string().required().label('Invoice Id'),
	payments: Yup.string().required().label('Payments'),
	poReference: Yup.string().required().label('PO reference'),
	receptNo: Yup.string().required().label('Receipt no'),
	reference: Yup.string().required().label('Reference'),
	paymentTerm: Yup.string().required().label('Payment term'),
	date: Yup.date().required().label('Date'),
});

export type IPaymentFormType = Yup.InferType<typeof Payment_Form_Validation>;
