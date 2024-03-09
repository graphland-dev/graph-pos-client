import {
  Product,
  ProductItemReference,
  ProductTaxType,
} from "@/_app/graphql-models/graphql";

// get discount
export const getDiscount = (
  discountType: string,
  discountAmount: number,
  totalPrice: number
) => {
  if (discountType === "Fixed") {
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

export const getProductReferenceByQuantity = (
  product: Product,
  quantity: number
): ProductItemReference => {
  const taxPercentage = product?.vat?.percentage || 0;
  const taxRate = taxPercentage / 100 || 0;
  const unitPrice = product?.price || 0;
  const taxAmount = unitPrice * taxRate * quantity;
  const netAmount = unitPrice * quantity + taxAmount;

  return {
    name: product.name,
    referenceId: product._id,
    netAmount,
    quantity,
    taxAmount,
    taxRate,
    taxType: product.taxType || ProductTaxType.Exclusive,
    unitPrice,
    code: product.code,
  };
};
