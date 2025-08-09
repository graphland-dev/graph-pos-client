function currencyNumberFormat(inputNumber: number) {
  const numberFormatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${numberFormatter.format(inputNumber)} BDT`;
}

export default currencyNumberFormat;
