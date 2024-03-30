import { ProductItemReference } from "@/_app/graphql-models/graphql";

export interface ProductItemReferenceWithStockQuantity
  extends ProductItemReference {
  stock?: number;
}
