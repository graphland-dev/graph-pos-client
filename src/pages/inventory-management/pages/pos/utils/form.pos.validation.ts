import * as Yup from 'yup';

export const POS_Create_Sale_Form_Validation = Yup.object().shape({
	client: Yup.string().required().label('Client'),
	products: Yup.array()
		.of(
			Yup.object().shape({
				name: Yup.string().required().label('Name'),
				price: Yup.number().required().label('Price'),
				quantity: Yup.number().required().label('Quantity'),
			})
		)
		.required()
		.label('Products'),
	discountType: Yup.string().required().label('Discount type'),
	discountAmount: Yup.number().required().label('Discount amount'),
	transportCost: Yup.number().required().label('Transport cost'),
	invoiceTax: Yup.string().required().label('Invoice tax'),
	category1: Yup.string().required().label('Category'),
	category2: Yup.string().required().label('Category'),
});

export interface IPOSCreateSaleFormState {
	client: string;
	products: Product[];
	discountType: string;
	discountAmount: number;
	transportCost: number;
	invoiceTax: string;
	category1: string;
	category2: string;
}

export interface Product {
	name: string;
	price: number;
	quantity: number;
}
