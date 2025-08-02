import {
  CostItemReference,
  ProductItemReference,
  Vat,
} from "@/commons/graphql-models/graphql";

export const calculateInvoiceItemTaxAmount = (
  product: ProductItemReference
) => {
  const percentage = product?.taxRate || 0;
  const unitSellPrice = product?.unitSellPrice || 0;
  const quantity = product?.quantity || 0;
  const total = unitSellPrice * quantity || 0;
  return (total * percentage) / 100;
};

export const getTotalTaxAmount = (products: ProductItemReference[]) => {
  return products.reduce(
    (total, current) => total + calculateInvoiceItemTaxAmount(current),
    0
  );
};

export const getNetSellPrice = (products: ProductItemReference[]) => {
  let total = 0;
  products?.map((product) => {
    const unitSellPrice = product?.unitSellPrice || 0;
    const quantity = product?.quantity || 0;
    total += unitSellPrice * quantity;
  });
  return total;
};

export const getTotalCostAmount = (costs: CostItemReference[]) => {
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
