import { ProductCategory } from '@/commons/graphql-models/graphql';

// Extended category interface with tree functionality
export interface CategoryTreeNode extends Omit<ProductCategory, 'children'> {
  children?: CategoryTreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  hasChildren?: boolean;
  parent?: CategoryTreeNode;
}

// Category picker options
export interface CategoryPickerOption {
  value: string;
  label: string;
  level: number;
  path: string;
  disabled?: boolean;
}

// Category breadcrumb generation
export const generateCategoryBreadcrumbs = (
  categoryPath: string
): Array<{ label: string; path: string }> => {
  if (!categoryPath) return [];
  
  const segments = categoryPath.split('/');
  return segments.map((segment, index) => ({
    label: segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    path: segments.slice(0, index + 1).join('/')
  }));
};