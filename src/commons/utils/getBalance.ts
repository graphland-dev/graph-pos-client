import { Account, Product } from "@/commons/graphql-models/graphql";

export const getAccountBalance = (
  accounts: Account[],
  accountId: string
): number => {
  const account = getAccountDetails(accounts, accountId);
  return (account?.creditAmount || 0) - (account?.debitAmount || 0);
};

export const getAccountDetails = (accounts: Account[], accountId: string) => {
  return accounts.find((a) => a._id === accountId);
};

//barcode price
export const getBarcodePrice = ( products: Product[], code: string) => {
   return products.find((a) => a.code === code)
}
