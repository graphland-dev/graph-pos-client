function currencyNumberFormat(inputNumber: number) {
	const currencyFormatter = new Intl.NumberFormat('en-IN');
	return currencyFormatter.format(inputNumber);
}

export default currencyNumberFormat;
