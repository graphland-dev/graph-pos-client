import { ProductPurchase } from "@/_app/graphql-models/graphql";

export const getRemainingDuesAmount = (payload: ProductPurchase[]) => {
  const remainingDues =
    getTotalPayableAmount(payload) - getTotalPaidAmount(payload);
  return remainingDues || 0;
};

export const getTotalPaidAmount = (payload: ProductPurchase[]) => {
  let totalPaid = 0;

  payload?.map(
    (purchase: ProductPurchase) =>
      (totalPaid = totalPaid + (purchase?.paidAmount || 0))
  );

  return totalPaid || 0;
};

export const getTotalPayableAmount = (payload: ProductPurchase[]) => {
  let totalPayable = 0;

  payload?.map(
    (purchase: ProductPurchase) =>
      (totalPayable = totalPayable + purchase?.netTotal)
  );

  return totalPayable || 0;
};

// export const getTotalDuesAmount = (payload: ProductPurchase[]) => {
//   let totalDues = 0;

//   payload?.map(
//     (purchase: ProductPurchase) => (totalDues = totalDues + purchase.)
//   );

//   return totalDues || 0;
// };
