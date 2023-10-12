import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { RouteObject } from "react-router-dom";
import { inventoryNavlinks } from "./inventory.navlinks";
import Adjustment from "./pages/inventory/adjustment/adjustment.page";
import InventoryList from "./pages/inventory/inventory-list/inventoryList.page";
import Barcode from "./pages/products/barcode/Barcode.page";
import ProductEditPage from "./pages/products/product-edit/ProductEdit.page";
import ProductCategoryPage from "./pages/products/products-category/productsCategory.page";
import ProductListPage from "./pages/products/products-list/productsList.page";
import PurchasesList from "./pages/purchases/purchases-list/purchasesList.page";
import Return from "./pages/purchases/return/return.page";
import BalanceShit from "./pages/report/balance-shit/balanceShit.page";
import ExpenseReport from "./pages/report/expense-report/expenseReport.page";
import LossProfitReport from "./pages/report/loss-profit-report/lossProfitReport.page";
import SummeryReport from "./pages/report/summary-report/summaryReport.page";

export const inventoryModuleRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout
        navlinks={inventoryNavlinks}
        title="Inventory Management"
        path="inventory-management"
      />
    ),
    children: [
      {
        path: "products",
        children: [
          {
            path: "products-list",
            element: <ProductListPage />,
          },
          {
            path: ":productId",
            element: <ProductEditPage />,
          },
          {
            path: "products-category",
            element: <ProductCategoryPage />,
          },
          {
            path: "barcode",
            element: <Barcode />,
          },
        ],
      },
      {
        path: "purchases",
        children: [
          {
            path: "purchases-list",
            element: <PurchasesList />,
          },
          {
            path: "return",
            element: <Return />,
          },
        ],
      },
      {
        path: "inventory",
        children: [
          {
            path: "inventory-list",
            element: <InventoryList />,
          },
          {
            path: "adjustment",
            element: <Adjustment />,
          },
        ],
      },
      {
        path: "report",
        children: [
          {
            path: "balance-shit",
            element: <BalanceShit />,
          },
          {
            path: "summary-report",
            element: <SummeryReport />,
          },
          {
            path: "expense-report",
            element: <ExpenseReport />,
          },
          {
            path: "loss-profit-report",
            element: <LossProfitReport />,
          },
        ],
      },
    ],
  },
];
