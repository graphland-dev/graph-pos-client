import { AppNavLink } from "@/_app/models/AppNavLink.type";
import { IconBrandProducthunt, IconForklift, IconShoppingCart } from "@tabler/icons-react";


export const inventoryNavlinks: AppNavLink[] = [
  {
    label: "Products",
    icon: <IconBrandProducthunt />,
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
    icon: <IconShoppingCart />,
    href: "purchases",
    children: [
      {
        label: "Purchases List",
        href: "purchases-list",
      },
      {
        label: "Return",
        href: "return",
      },
    ],
  },

  {
    label: "Inventory",
    icon: <IconForklift />,
    href: "inventory",
    children: [
      {
        label: "Inventory List",
        href: "inventory-list",
      },
      {
        label: "Adjustment",
        href: "adjustment",
      },
    ],
  },
];