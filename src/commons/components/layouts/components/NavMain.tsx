'use client';

import { AppNavLink } from '@/commons/models/AppNavLink.type';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/commons/shadcn/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/commons/shadcn/components/ui/sidebar';
import { cn } from '@/commons/shadcn/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

interface NavMainProps {
  items: AppNavLink[];
  path: string;
}

interface CollapsibleNavItemProps {
  item: AppNavLink;
  path: string;
  linkWithTenant: (href: string) => string;
  isActive: (href?: string) => boolean;
  isParentActive: (item: AppNavLink) => boolean;
  level?: number;
}

function CollapsibleNavItem({
  item,
  path,
  linkWithTenant,
  isActive,
  isParentActive,
  level = 0,
}: CollapsibleNavItemProps) {
  const navigate = useNavigate();
  const parentActive = isParentActive(item);
  const [isOpen, setIsOpen] = useState(parentActive);

  // Update open state when route becomes active
  useEffect(() => {
    if (parentActive) {
      setIsOpen(true);
    }
  }, [parentActive]);

  const handleClick = () => {
    if (item.href) {
      // Navigate to the parent route
      navigate(linkWithTenant(item.href));
    }
    // Toggle collapsible
    setIsOpen(!isOpen);
  };

  // For nested items (level > 0), render as sub-item with collapsible
  if (level > 0) {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible"
      >
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton isActive={parentActive} onClick={handleClick}>
              <span>{item.label}</span>
              <ChevronRight
                className={cn(
                  'ml-auto transition-transform duration-200',
                  isOpen && 'rotate-90',
                )}
              />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children?.map((subItem) => {
                const subActive = isActive(subItem.href);
                const hasSubChildren =
                  subItem.children && subItem.children.length > 0;

                if (hasSubChildren) {
                  return (
                    <CollapsibleNavItem
                      key={subItem.label}
                      item={subItem}
                      path={path}
                      linkWithTenant={linkWithTenant}
                      isActive={isActive}
                      isParentActive={isParentActive}
                      level={level + 1}
                    />
                  );
                }

                return (
                  <SidebarMenuSubItem key={subItem.label}>
                    <SidebarMenuSubButton asChild isActive={subActive}>
                      <Link to={linkWithTenant(subItem.href || '')}>
                        <span>{subItem.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    );
  }

  // For top-level items (level 0)
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.label}
          isActive={parentActive}
          onClick={handleClick}
        >
          {item.icon && <item.icon className="size-4" />}
          <span className="group-data-[collapsible=icon]:hidden">
            {item.label}
          </span>
          <ChevronRight
            className={cn(
              'ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden',
              isOpen && 'rotate-90',
            )}
          />
        </SidebarMenuButton>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((subItem) => {
              const subActive = isActive(subItem.href);
              const hasSubChildren =
                subItem.children && subItem.children.length > 0;

              if (hasSubChildren) {
                return (
                  <CollapsibleNavItem
                    key={subItem.label}
                    item={subItem}
                    path={path}
                    linkWithTenant={linkWithTenant}
                    isActive={isActive}
                    isParentActive={isParentActive}
                    level={1}
                  />
                );
              }

              return (
                <SidebarMenuSubItem key={subItem.label}>
                  <SidebarMenuSubButton asChild isActive={subActive}>
                    <Link to={linkWithTenant(subItem.href || '')}>
                      <span>{subItem.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items, path }: NavMainProps) {
  const params = useParams<{ tenant: string }>();
  const location = useLocation();

  const linkWithTenant = (href: string) => {
    if (!href) return '#';
    const basePath = path ? `/${path}` : '';
    if (params.tenant) {
      return basePath
        ? `/${params.tenant}${basePath}/${href}`
        : `/${params.tenant}/${href}`;
    }
    return basePath ? `${basePath}/${href}` : `/${href}`;
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    const fullPath = linkWithTenant(href);
    return (
      location.pathname === fullPath ||
      location.pathname.startsWith(fullPath + '/')
    );
  };

  const isParentActive = (item: AppNavLink) => {
    if (isActive(item.href)) return true;
    return item.children?.some((child) => isActive(child.href)) || false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const itemActive = isActive(item.href);

          if (hasChildren) {
            return (
              <CollapsibleNavItem
                key={item.label}
                item={item}
                path={path}
                linkWithTenant={linkWithTenant}
                isActive={isActive}
                isParentActive={isParentActive}
              />
            );
          }

          return (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                isActive={itemActive}
              >
                <Link to={linkWithTenant(item.href || '')}>
                  {item.icon && <item.icon className="size-4" />}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
