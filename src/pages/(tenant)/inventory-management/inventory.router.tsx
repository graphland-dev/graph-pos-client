import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { RouteObject } from "react-router-dom";
import { inventoryNavlinks } from "./inventory.navlinks";
import SupplierPayment from "./pages/payments/supplier-payments/supplier-payment.page";
import Barcode from "./pages/products/barcode/Barcode.page";
import ProductEditPage from "./pages/products/product-edit/ProductEdit.page";
import ProductCategoryPage from "./pages/products/products-category/productsCategory.page";
import ProductListPage from "./pages/products/products-list/productsList.page";
import CreatePurchasePage from "./pages/purchases/create-purchase/create-purchase.page";
import PurchaseListPage from "./pages/purchases/purchase-list/purchase-list.page";
import Return from "./pages/purchases/return/return.page";

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
      //   {
      //     path: "",
      //     element: (
      //       <Navigate to={"/inventory-management/products/products-list"} />
      //     ),
      //   },
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
            path: "",
            element: <PurchaseListPage />,
          },
          {
            path: "create",
            element: <CreatePurchasePage />,
          },
          {
            path: "return",
            element: <Return />,
          },
        ],
      },
      {
        path: "payments",
        children: [
          {
            path: "supplier-payments/:supplierId/:purchaseId",
            element: <SupplierPayment />,
          },
        ],
      },
    ],
  },
];
//
