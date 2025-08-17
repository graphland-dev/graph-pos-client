import {
  SimpleGrid,
  UnstyledButton,
  Group,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconFile3d,
  IconBrandProducthunt,
  IconReport,
} from "@tabler/icons-react";

interface QuickActionsProps {
  onNavigate: (href: string, modulePrefix?: string) => void;
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const quickActions = [
    {
      label: "POS",
      description: "Start POS transaction",
      icon: IconShoppingCart,
      href: "pos",
      modulePrefix: "inventory-management",
      color: "blue",
    },
    {
      label: "Create Invoice",
      description: "Generate new invoice",
      icon: IconFile3d,
      href: "invoices",
      modulePrefix: "inventory-management",
      color: "green",
    },
    {
      label: "Add Product",
      description: "Create new product",
      icon: IconBrandProducthunt,
      href: "products/products-list",
      modulePrefix: "inventory-management",
      color: "orange",
    },
    {
      label: "View Reports",
      description: "Business analytics",
      icon: IconReport,
      href: "reports",
      modulePrefix: "reports",
      color: "purple",
    },
  ];

  return (
    <div>
      <Text size="sm" fw={600} mb="sm" c="gray.7">
        Quick Actions
      </Text>
      <SimpleGrid cols={4} spacing="md">
        {quickActions.map((action) => (
          <UnstyledButton
            key={action.label}
            onClick={() => onNavigate(action.href, action.modulePrefix)}
            p="md"
            style={{
              border: "1px solid var(--mantine-color-gray-3)",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            styles={{
              root: {
                "&:hover": {
                  backgroundColor: "var(--mantine-color-gray-0)",
                  borderColor: "var(--mantine-color-blue-4)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          >
            <Group align="center" style={{ flexDirection: "column" }}>
              <ThemeIcon
                size="lg"
                variant="light"
                color={action.color}
                radius="md"
              >
                <action.icon size={20} />
              </ThemeIcon>
              <div style={{ textAlign: "center" }}>
                <Text size="sm" fw={600}>
                  {action.label}
                </Text>
                <Text size="xs" c="gray.6">
                  {action.description}
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        ))}
      </SimpleGrid>
    </div>
  );
}
