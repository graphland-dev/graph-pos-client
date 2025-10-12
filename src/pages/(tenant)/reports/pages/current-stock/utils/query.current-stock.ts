import { gql } from "@apollo/client";

export const CURRENT_STOCK_REPORT_QUERY = gql`
  query CurrentStockReport($input: CurrentStockFilterInput) {
    inventory__currentStockReport(input: $input) {
      meta {
        currentPage
        hasNextPage
        totalCount
        totalPages
      }
      nodes {
        productId
        productName
        sku
        category
        brand
        currentQuantity
        stockStatus
        reorderLevel
        lastUpdated
        unitPurchasePrice
        unitSellPrice
        netPurchasePrice
        netSellPrice
        netProfitableAmount
      }
      summary {
        totalProductsCount
        inStockCount
        lowStockCount
        outOfStockCount
        netStockPurchasePrice
        netStockSellPrice
        netProfitableAmount
      }
    }
  }
`;

export const BRANDS_QUERY = gql`
  query CurrentStockReport__brands($where: CommonPaginationDto) {
    setup__brands(where: $where) {
      nodes {
        _id
        name
      }
    }
  }
`;
