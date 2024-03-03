import { AppNavLink } from "@/_app/models/AppNavLink.type";
import {
  IconBrandProducthunt,
  IconCoin,
  IconShoppingCart,
} from "@tabler/icons-react";

export const inventoryNavlinks: AppNavLink[] = [
  {
    label: "POS",
    icon: <IconShoppingCart />,
    href: "pos",
  },
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
    icon: <IconCoin />,
    href: "payments",
    children: [
      {
        label: "Purchase Payments",
        href: "purchase-payments",
      },
    ],
  },
];
