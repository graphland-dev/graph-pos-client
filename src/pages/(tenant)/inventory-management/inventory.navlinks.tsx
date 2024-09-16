import { AppNavLink } from "@/commons/models/AppNavLink.type";
import {
  IconAdjustments,
  IconBrandAbstract,
  IconBrandProducthunt,
  IconCoin,
  IconFile3d,
  IconReceipt2,
  IconRulerMeasure,
  IconShoppingCart,
} from "@tabler/icons-react";

export const inventoryNavlinks: AppNavLink[] = [
  {
    label: "POS",
    icon: IconShoppingCart,
    href: "pos",
  },
  {
    label: "Invoices",
    icon: IconFile3d,
    href: "invoices",
  },
  {
    label: "Products",
    icon: IconBrandProducthunt,
    href: "products",
    children: [
      {
        label: "Products List",
        href: "products-list",
      },
      {
        label: "Products Category",
        href: "products-category",
      },
      {
        label: "Barcode",
        href: "barcode",
      },
    ],
  },
  {
    label: "Purchases",
    icon: IconShoppingCart,
    href: "purchases",
    children: [
      {
        label: "Purchases List",
        href: "",
      },
      // {
      //   label: "Purchases List",
      //   href: "purchases-list",
      // },
      {
        label: "Return",
        href: "return",
      },
    ],
  },
  {
    label: "Payments",
    icon: IconCoin,
    href: "payments",
    children: [
      {
        label: "Purchase Payments",
        href: "purchase-payments",
      },
      {
        label: "Invoice Payments",
        href: "invoice-payments",
      },
    ],
  },
  {
    label: "Settings",
    icon: IconAdjustments,
    href: "settings",
    children: [
      {
        label: "Vat Profiles",
        icon: IconReceipt2,
        href: "vat-profiles",
      },
      {
        label: "Units",
        icon: IconRulerMeasure,
        href: "units",
      },
      {
        label: "Brands",
        icon: IconBrandAbstract,
        href: "brands",
      },
    ],
  },
];
