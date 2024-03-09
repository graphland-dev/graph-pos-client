// get discount
export const getDiscount = (
	discountType: string,
	discountAmount: number,
	totalPrice: number
) => {
	if (discountType === 'Fixed') {
		console.log({ fixed: discountAmount });
		return Number(discountAmount) ?? 0;
	} else {
		console.log({ per: discountAmount });
		const calculateDiscountAmount = (totalPrice / 100) * discountAmount;
		return Number(calculateDiscountAmount) ?? 0;
	}
};

// sales vat
export const getSalesVat = (subTotal: number, vatPercentage: number) => {
	return (subTotal / 100) * vatPercentage;
};
