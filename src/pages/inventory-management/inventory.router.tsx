import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { Navigate, RouteObject } from "react-router-dom";
import { inventoryNavlinks } from "./inventory.navlinks";
import SupplierPayment from "./pages/payments/supplier-payments/supplier-payment.page";
import Barcode from "./pages/products/barcode/Barcode.page";
import ProductEditPage from "./pages/products/product-edit/ProductEdit.page";
import ProductCategoryPage from "./pages/products/products-category/productsCategory.page";
import ProductListPage from "./pages/products/products-list/productsList.page";
import PurchasesList from "./pages/purchases/purchases-list/purchasesList.page";
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
      {
        path: "",
        element: (
          <Navigate to={"/inventory-management/products/products-list"} />
        ),
      },
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
        path: "payments",
        children: [
          {
            path: "supplier-payments",
            element: <SupplierPayment />,
          },
        ],
      },
    ],
  },
];
//
