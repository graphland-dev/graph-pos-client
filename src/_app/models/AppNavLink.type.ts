export interface AppNavLink {
  label: string;
  href?: string;
  icon?: React.ElementType<{
    className: string;
    size: string;
  }>;
  children?: AppNavLink[];
}
