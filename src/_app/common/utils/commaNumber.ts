function currencyNumberFormat(inputNumber: number) {
  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    maximumSignificantDigits: 3,
  });
  return currencyFormatter.format(inputNumber);
}

export default currencyNumberFormat;
