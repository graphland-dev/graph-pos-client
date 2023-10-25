import {
	ProductPurchaseCostInput,
	PurchaseProductItemInput,
	Vat,
} from '@/_app/graphql-models/graphql';

export const calculateTaxAmount = (product: PurchaseProductItemInput) => {
	const percentage = product?.taxRate || 0;
	const unitPrice = product?.unitPrice || 0;
	const quantity = product?.quantity || 0;
	const total = unitPrice * quantity || 0;
	return (total * percentage) / 100;
};

export const getTotalTaxAmount = (products: PurchaseProductItemInput[]) => {
	return products.reduce(
		(total, current) => total + calculateTaxAmount(current),
		0
	);
};

export const getTotalProductsPrice = (products: PurchaseProductItemInput[]) => {
	let total = 0;
	products?.map(
		(product) =>
			(total =
				total +
				calculateTaxAmount(product) +
				product?.quantity * product?.unitPrice)
	);
	return total;
};

export const getTotalCostAmount = (costs: ProductPurchaseCostInput[]) => {
	let totalCostAmount = 0;
	costs?.map((cost) => (totalCostAmount = totalCostAmount + cost?.amount));
	return totalCostAmount;
};

export const getVatProfileSelectInputData = (vatProfiles: Vat[]) => {
	const data: {
		label: string;
		value: string;
	}[] = [];

	vatProfiles?.map((vat) =>
		data.push({
			label: vat.name,
			value: vat.percentage.toString(),
		})
	);
	return data;
};
