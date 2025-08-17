import { accountingNavlinks } from "@/pages/(tenant)/accounting/accounting.navlinks";
import { inventoryNavlinks } from "@/pages/(tenant)/inventory-management/inventory.navlinks";
import { peopleNavlinks } from "@/pages/(tenant)/people/people.navlinks";
import { reportNavlinks } from "@/pages/(tenant)/reports/report.navlinks";
import { SimpleGrid, Stack, TextInput } from "@mantine/core";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuSection } from "./MenuSection";
import { QuickActions } from "./QuickActions";

// interface MegaMenuProps {}

export function MegaMenu() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { tenant } = useParams();

  const handleNavigation = (href: string, modulePrefix?: string) => {
    const fullPath = modulePrefix
      ? `/${tenant}/${modulePrefix}/${href}`
      : `/${tenant}/${href}`;
    navigate(fullPath);
    // onClose();
  };

  return (
    <Stack>
      {/* Search */}
      <TextInput
        placeholder="Search menu items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
      />

      {/* Quick Actions */}
      <QuickActions onNavigate={handleNavigation} />

      {/* Main Menu Sections */}
      <SimpleGrid cols={3} spacing="xl">
        <MenuSection
          title="Inventory Management"
          description="Sales, products, and stock management"
          navlinks={inventoryNavlinks}
          modulePrefix="inventory-management"
          onNavigate={handleNavigation}
          searchQuery={searchQuery}
        />

        <MenuSection
          title="Accounting"
          description="Financial management and reporting"
          navlinks={accountingNavlinks}
          modulePrefix="accounting"
          onNavigate={handleNavigation}
          searchQuery={searchQuery}
        />

        <MenuSection
          title="People Management"
          description="Clients, suppliers, and employees"
          navlinks={peopleNavlinks}
          modulePrefix="people"
          onNavigate={handleNavigation}
          searchQuery={searchQuery}
        />

        <MenuSection
          title="Reports & Analytics"
          description="Business insights and reports"
          navlinks={reportNavlinks}
          modulePrefix="reports"
          onNavigate={handleNavigation}
          searchQuery={searchQuery}
        />

        <MenuSection
          title="Administration"
          description="System settings and user management"
          navlinks={[
            {
              label: "Organization",
              href: "organization-overview",
            },
            {
              label: "Users",
              href: "users",
            },
            {
              label: "Roles",
              href: "roles",
            },
          ]}
          modulePrefix="tenant-settings"
          onNavigate={handleNavigation}
          searchQuery={searchQuery}
        />
      </SimpleGrid>
    </Stack>
  );
}
