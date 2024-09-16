import ModuleMenu from "@/commons/components/Modulemenu.tsx";
import { useParams } from "react-router-dom";

const InventoryManagementRoot = () => {
  const params = useParams<{ tenant: string }>();
  return (
    <div className="mt-10">
      <ModuleMenu
        moduleName={"Inventory Management"}
        items={[
          {
            name: "POS",
            iconPath: "/menu-icons/pos-terminal.png",
            linkPath: `/${params.tenant}/inventory-management/pos`,
          },
          {
            name: "Invoices",
            iconPath: "/menu-icons/invoice.png",
            linkPath: `/${params.tenant}/inventory-management/invoices`,
          },
          {
            name: "Products",
            iconPath: "/menu-icons/warehouse.png",
            linkPath: `/${params.tenant}/inventory-management/products/products-list`,
          },
          {
            name: "Barcodes",
            iconPath: "/menu-icons/barcode.png",
            linkPath: `/${params.tenant}/inventory-management/products/barcode`,
          },
          {
            name: "Purchase Payments",
            iconPath: "/menu-icons/payment-method.png",
            linkPath: `/${params.tenant}/inventory-management/payments/purchase-payments`,
          },
          {
            name: "Invoice Payments",
            iconPath: "/menu-icons/bill.png",
            linkPath: `/${params.tenant}/inventory-management/payments/invoice-payments`,
          },
          {
            name: "Setting",
            iconPath: "/menu-icons/gear.png",
            linkPath: `/${params.tenant}/inventory-management/settings/vat-profiles`,
          },
        ]}
      />
    </div>
  );
};

export default InventoryManagementRoot;
