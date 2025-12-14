import { RouteObject } from "react-router-dom";
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
import CreateOrUpdateInvoicePage from "./pages/invoices/create-invoice/create-or-update-invoice.page";
import InvoiceDetailsPage from "./pages/invoices/invoice-details/invoice-details.page";
import QuotationsPage from "./pages/quotations/quotations.page";
import CreateOrUpdateQuotationPage from "./pages/quotations/create-quotation/create-or-update-quotation.page";
import InvoicePaymentsPage from "./pages/payments/invoice-payments/invoice-payments.page";
import ReturnsPage from "./pages/returns/returns.page";
import CreateReturnPage from "./pages/returns/create/create-return.page";
import ReturnDetailsPage from "./pages/returns/return-details/return-details.page";
import InventoryManagementRoot from "./module-root.page";

export const inventoryModuleRouter: RouteObject[] = [
  {
    path: "",
    element: <InventoryManagementRoot />,
  },
  {
    path: "pos",
    element: <PosPage />,
  },
  {
    path: "invoices",
    children: [
      {
        path: "",
        element: <InvoicesPage />,
      },
      {
        path: "create",
        element: <CreateOrUpdateInvoicePage />,
      },
      {
        path: ":invoiceId",
        element: <InvoiceDetailsPage />,
      },
      {
        path: ":invoiceId/edit",
        element: <CreateOrUpdateInvoicePage />,
      },
    ],
  },
  {
    path: "quotations",
    children: [
      {
        path: "",
        element: <QuotationsPage />,
      },
      {
        path: "create",
        element: <CreateOrUpdateQuotationPage />,
      },
      {
        path: ":quotationId",
        element: <CreateOrUpdateQuotationPage />,
      },
    ],
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
    path: "returns",
    children: [
      {
        path: "",
        element: <ReturnsPage />,
      },
      {
        path: "create/:invoiceId",
        element: <CreateReturnPage />,
      },
      {
        path: ":returnId",
        element: <ReturnDetailsPage />,
      },
      {
        path: ":returnId/edit",
        element: <CreateReturnPage />,
      },
    ],
  },
  {
    path: "settings",
    children: [
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
];
//
