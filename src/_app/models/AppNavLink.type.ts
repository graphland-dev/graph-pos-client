export interface AppNavLink {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: AppNavLink[];
}
