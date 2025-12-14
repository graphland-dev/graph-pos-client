"use client";

import { Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { accountingNavlinks } from "@/pages/(tenant)/accounting/accounting.navlinks";
import { inventoryNavlinks } from "@/pages/(tenant)/inventory-management/inventory.navlinks";
import { peopleNavlinks } from "@/pages/(tenant)/people/people.navlinks";
import { reportNavlinks } from "@/pages/(tenant)/reports/report.navlinks";
import { modulesNavlinks } from "@/pages/(tenant)/modules.navlinks";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/commons/shadcn/components/ui/command";
import { Button } from "@/commons/shadcn/components/ui/button";

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams<{ tenant: string }>();

  // Flatten all navlinks for search
  const flattenNavlinks = (items: any[], prefix = ""): Array<{ label: string; href: string; module?: string }> => {
    const result: Array<{ label: string; href: string; module?: string }> = [];
    
    items.forEach((item) => {
      if (item.href) {
        result.push({
          label: item.label,
          href: prefix ? `${prefix}/${item.href}` : item.href,
          module: prefix || item.label,
        });
      }
      if (item.children) {
        result.push(...flattenNavlinks(item.children, prefix ? `${prefix}/${item.href}` : item.href));
      }
    });
    
    return result;
  };

  const allNavlinks = [
    ...flattenNavlinks(modulesNavlinks),
    ...flattenNavlinks(accountingNavlinks, "accounting"),
    ...flattenNavlinks(inventoryNavlinks, "inventory-management"),
    ...flattenNavlinks(peopleNavlinks, "people"),
    ...flattenNavlinks(reportNavlinks, "reports"),
  ];

  const handleSelect = (href: string) => {
    const fullPath = params.tenant ? `/${params.tenant}/${href}` : `/${href}`;
    navigate(fullPath);
    setOpen(false);
  };

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search menu items..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {allNavlinks.map((item) => (
              <CommandItem
                key={`${item.module}-${item.href}`}
                onSelect={() => handleSelect(item.href)}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

