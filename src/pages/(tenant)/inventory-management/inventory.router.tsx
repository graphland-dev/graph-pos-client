import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { RouteObject } from "react-router-dom";
import { inventoryNavlinks } from "./inventory.navlinks";
import CreatePurchasePayment from "./pages/payments/create-purchase-payment/create-purchase-payment.page";
import PurchasePaymentPage from "./pages/payments/purchase-payments/purchase-payments.page";
import PosPage from "./pages/pos/pos.page";
import Barcode from "./pages/products/barcode/Barcode.page";
import ProductEditPage from "./pages/products/product-edit/ProductEdit.page";
import ProductCategoryPage from "./pages/products/products-category/productsCategory.page";
import ProductListPage from "./pages/products/products-list/productsList.page";
import CreatePurchasePage from "./pages/purchases/create-purchase/create-purchase.page";
import PurchaseListPage from "./pages/purchases/purchase-list/purchase-list.page";
import Return from "./pages/purchases/return/return.page";
import VatPage from "./pages/settings/pages/vat/vat.page";
import UnitPage from "./pages/settings/pages/unit/unit.page";
import BrandPage from "./pages/settings/pages/brand/brand.page";
import InvoicesPage from "./pages/invoices/invoices.page";
import InvoicePaymentsPage from "./pages/payments/invoice-payments/invoice-payments.page";
import InventoryManagementRoot from "./module-root.page";

export const inventoryModuleRouter: RouteObject[] = [
  {
    path: "pos",
    element: <PosPage />,
  },
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
        element: <InventoryManagementRoot />,
      },
      {
        path: "invoices",
        element: <InvoicesPage />,
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
            path: "purchase-payments",
            element: <PurchasePaymentPage />,
          },
          {
            path: "invoice-payments",
            element: <InvoicePaymentsPage />,
          },
          {
            // query strings
            // - supplierId
            // - purchaseId
            path: "create-purchase-payment",
            element: <CreatePurchasePayment />,
          },
        ],
      },
      {
        path: "settings",
        children: [
          // {
          //   path: "",
          //   element: <Navigate to={"/settings/vat-profiles"} />,
          // },
          {
            path: "vat-profiles",
            element: <VatPage />,
          },
          {
            path: "units",
            element: <UnitPage />,
          },
          {
            path: "brands",
            element: <BrandPage />,
          },
        ],
      },
    ],
  },
];
//
