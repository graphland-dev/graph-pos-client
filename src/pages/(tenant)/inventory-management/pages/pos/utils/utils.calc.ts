import {
  Product,
  ProductDiscountMode,
  ProductTaxType,
} from '@/commons/graphql-models/graphql';
import { ProductItemReferenceWithStockQuantity } from './pos.types';

// get discount
export const getDiscount = (
  discountType: string,
  discountAmount: number,
  totalPrice: number,
) => {
  if (discountType === ProductDiscountMode.Amount) {
    return Number(discountAmount) ?? 0;
  } else {
    const calculateDiscountAmount = (totalPrice / 100) * discountAmount;
    return Number(calculateDiscountAmount) ?? 0;
  }
};

// sales vat
export const getSalesVat = (subTotal: number, vatPercentage: number) => {
  return (subTotal / 100) * vatPercentage;
};

export const getStock = (product: Product) => {
  const _in = product.stockInQuantity || 0;
  const _out = product.stockOutQuantity || 0;

  return _in - _out || 0;
};

export const getProductReferenceByQuantity = (
  product: Product,
  quantity: number,
): ProductItemReferenceWithStockQuantity => {
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
    stock: getStock(product) || 0,
  };
};
