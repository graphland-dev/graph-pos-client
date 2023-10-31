import { ProductPurchase } from '@/_app/graphql-models/graphql';

export const getRemainingDuesAmount = (payload: ProductPurchase[]) => {
	const remainingDues =
		getTotalPayableAmount(payload) - getTotalPaidAmount(payload);
	return remainingDues || 0;
};

export const getTotalPaidAmount = (payload: ProductPurchase[]) => {
	let totalPaid = 0;

	payload?.map(
		(purchase: ProductPurchase) =>
			(totalPaid =
				// @ts-ignore
				totalPaid + purchase?.paidAmount)
	);

	return totalPaid || 0;
};

export const getTotalPayableAmount = (payload: ProductPurchase[]) => {
	let totalPayable = 0;

	payload?.map(
		(purchase: ProductPurchase) =>
			(totalPayable =
				// @ts-ignore
				totalPayable + purchase?.netTotal)
	);

	return totalPayable || 0;
};

export const getTotalDuesAmount = (payload: ProductPurchase[]) => {
	let totalDues = 0;

	payload?.map(
		(purchase: ProductPurchase) =>
			(totalDues =
				// @ts-ignore
				totalDues + purchase?.dueAmount)
	);

	return totalDues || 0;
};
