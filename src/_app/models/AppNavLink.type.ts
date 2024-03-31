export interface AppNavLink {
  label: string;
  href?: string;
  icon?: React.ElementType;
  // icon?: React.ComponentType;
  children?: AppNavLink[];
}
