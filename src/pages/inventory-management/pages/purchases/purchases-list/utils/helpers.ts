import { PurchaseProductItemInput } from "@/_app/graphql-models/graphql";

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
