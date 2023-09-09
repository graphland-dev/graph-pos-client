import { SpotlightAction } from "@mantine/spotlight";
import { IconDashboard, IconHome } from "@tabler/icons-react";

export const spotlightItems: SpotlightAction[] = [
  {
    title: "Home",
    description: "Get to home page",
    onTrigger: () => {
      window.location.href = "/";
    },
    icon: <IconHome size="1.2rem" />,
  },
  {
    title: "Accounting",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting";
    },
    icon: <IconDashboard size="1.2rem" />,
  },
  {
    title: "Accounting > Cashbook > Accounts",
    description: "Get full information about current system status",
    onTrigger: () => {
      window.location.href = "/accounting/cashbook/accounts";
    },
    icon: <IconDashboard size="1.2rem" />,
  },
];
