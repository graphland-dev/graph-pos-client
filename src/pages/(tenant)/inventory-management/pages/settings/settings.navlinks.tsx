import { AppNavLink } from "@/_app/models/AppNavLink.type";
import {
  IconBrandAbstract,
  IconReceipt2,
  IconRulerMeasure,
} from "@tabler/icons-react";

export const settingsNavlinks: AppNavLink[] = [
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
];
