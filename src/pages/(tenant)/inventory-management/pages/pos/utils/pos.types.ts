import { ProductItemReference } from "@/commons/graphql-models/graphql";

export interface ProductItemReferenceWithStockQuantity
  extends ProductItemReference {
  stock?: number;
}
