import { Product, ProductDiscountMode } from "@/commons/graphql-models/graphql";
import { ProductItemReferenceWithStockQuantity } from "./pos.types";

// get discount
export const getDiscount = (
  discountType: string,
  discountAmount: number,
  totalPrice: number
) => {
  if (discountType === ProductDiscountMode.Amount) {
    return Number(discountAmount) ?? 0;
  } else {
    const calculateDiscountAmount = (totalPrice / 100) * discountAmount;
    return Number(calculateDiscountAmount) ?? 0;
  }
};

// sales vat
export const getPercentageAmount = (
  subTotal: number,
  vatPercentage: number
) => {
  return (subTotal / 100) * vatPercentage;
};

export const getStock = (product: Product) => {
  return product.currentStockQuantity || 0;
};

export const getProductReferenceByQuantity = (
  product: Product,
  quantity: number
): ProductItemReferenceWithStockQuantity => {
  const taxPercentage = product?.vat?.percentage || 0;
  const taxRate = taxPercentage / 100 || 0;
  const unitSellPrice = product?.price || 0;
  const unitPrice = product?.price || 0;
  const taxAmount = unitSellPrice * taxRate * quantity;
  const purchasePrice = product?.purchasePrice || 0;
  const netSellPrice = unitSellPrice * quantity || 0;
  const unitPurchasePrice = product?.purchasePrice || 0;
  const netDiscountAmount = (unitPrice - unitSellPrice) * quantity || 0;
  const netSubtotal = unitPrice * quantity || 0;
  const netAmount = netSellPrice + taxAmount || 0;

  return {
    referenceId: product._id,
    name: product.name,
    taxAmount,
    taxRate,
    unitSellPrice,
    netSellPrice,
    unitPurchasePrice,
    code: product.code,
    isSellableWithoutStock: product.isSellableWithoutStock || false,
    quantity,
    unitPrice,

    netAmount,
    discountAmount: netDiscountAmount,
    netPurchaseAmount: purchasePrice * quantity || 0,
    netProfit: 0,
    netSubtotal,
    stock: getStock(product) || 0,
  };
};
