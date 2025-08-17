# MegaMenu Component

A comprehensive navigation mega menu for the Graph POS system that displays all major modules and features in an organized, searchable interface.

## Features

- **Organized by Module**: Groups navigation items by business modules (Inventory, Accounting, People, Reports, Administration)
- **Quick Actions**: Prominent buttons for common tasks (New Sale, Create Invoice, Add Product, View Reports)
- **Search Functionality**: Filter menu items by typing
- **Responsive Design**: Adapts to different screen sizes
- **Icon Integration**: Uses existing Tabler icons from your design system

## Components

### MegaMenuTrigger
The main component to add to your navbar. Handles opening/closing the mega menu.

```tsx
import { MegaMenuTrigger } from "@/commons/components/MegaMenu";

// In your header component
<MegaMenuTrigger label="Navigation" />
```

### MegaMenu
The main mega menu component (used internally by MegaMenuTrigger).

### MenuSection
Individual module sections within the mega menu.

### QuickActions
Prominent action buttons at the top of the mega menu.

## Integration Example

Replace your existing header component with the enhanced version:

```tsx
import { MegaMenuTrigger } from '@/commons/components/MegaMenu';

const YourHeader = () => {
  return (
    <Header>
      <div className="flex items-center gap-2">
        {/* Your existing logo and hamburger */}
        <Link to="/">Graph POS</Link>
        
        {/* Add the mega menu */}
        <MegaMenuTrigger label="Menu" />
      </div>
      
      {/* Your existing right-side items */}
      <div className="flex items-center gap-4">
        {/* Search, theme switcher, user menu, etc. */}
      </div>
    </Header>
  );
};
```

## Customization

### Adding New Modules
To add a new module section, update the `MegaMenu.tsx` component and add your module's navlinks:

```tsx
<MenuSection
  title="Your New Module"
  description="Description of the module"
  navlinks={yourModuleNavlinks}
  modulePrefix="your-module"
  onNavigate={handleNavigation}
  searchQuery={searchQuery}
/>
```

### Modifying Quick Actions
Edit the `quickActions` array in `QuickActions.tsx`:

```tsx
const quickActions = [
  {
    label: "Your Action",
    description: "Action description",
    icon: YourIcon,
    href: "your-route",
    modulePrefix: "your-module",
    color: "blue",
  },
  // ... other actions
];
```

## Structure

```
MegaMenu/
├── MegaMenu.tsx           # Main container component
├── MegaMenuTrigger.tsx    # Button to open/close menu
├── MenuSection.tsx        # Individual module sections
├── QuickActions.tsx       # Quick action buttons
├── HeaderWithMegaMenu.example.tsx  # Integration example
├── index.ts              # Exports
└── README.md             # This file
```

## Dependencies

- Mantine UI components
- Tabler Icons
- React Router for navigation
- Existing navigation data from module navlinks files