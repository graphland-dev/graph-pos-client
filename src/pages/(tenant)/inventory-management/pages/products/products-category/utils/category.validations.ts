import * as Yup from "yup";
import { ProductCategory } from '@/commons/graphql-models/graphql';

// Category form validation schema
export const CategoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .label("Name"),
  
  code: Yup.string()
    .optional()
    .nullable()
    .max(50, "Code cannot exceed 50 characters")
    .matches(/^[a-z0-9_]*$/, "Code can only contain lowercase letters, numbers, and underscores")
    .label("Code"),
  
  note: Yup.string()
    .optional()
    .nullable()
    .max(500, "Note cannot exceed 500 characters")
    .label("Note"),
  
  parentCategoryId: Yup.string()
    .optional()
    .nullable()
    .label("Parent Category"),
});

// TypeScript interfaces
export interface ICategoryFormData extends Yup.Asserts<typeof CategoryValidationSchema> {}

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

// Form state for category operations
export interface CategoryFormState {
  mode: 'create' | 'edit';
  isOpen: boolean;
  categoryId?: string;
  parentCategoryId?: string;
  initialData?: Partial<ICategoryFormData>;
}

// Validation helpers
export const validateCategoryHierarchy = (
  categoryId: string,
  newParentId: string | null,
  allCategories: CategoryTreeNode[]
): { isValid: boolean; error?: string } => {
  if (!newParentId) {
    return { isValid: true }; // Moving to root is always valid
  }

  if (categoryId === newParentId) {
    return { isValid: false, error: "Category cannot be its own parent" };
  }

  // Check if newParent is a descendant of category (would create circular reference)
  const isDescendant = (parentId: string, targetId: string, categories: CategoryTreeNode[]): boolean => {
    const category = categories.find(c => c._id === parentId);
    if (!category) return false;
    
    if (category.children) {
      for (const child of category.children) {
        if (child._id === targetId || isDescendant(child._id, targetId, categories)) {
          return true;
        }
      }
    }
    return false;
  };

  if (isDescendant(categoryId, newParentId, allCategories)) {
    return { isValid: false, error: "Cannot move category under its own descendant" };
  }

  // Check depth limit (max 5 levels)
  const getParentLevel = (parentId: string, categories: CategoryTreeNode[]): number => {
    const parent = categories.find(c => c._id === parentId);
    return parent ? parent.level : 0;
  };

  const newLevel = getParentLevel(newParentId, allCategories) + 1;
  if (newLevel > 5) {
    return { isValid: false, error: "Maximum category depth (5 levels) would be exceeded" };
  }

  return { isValid: true };
};

// Path generation helper
export const generateCategoryPath = (
  categoryName: string,
  parentPath?: string
): string => {
  const slug = categoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return parentPath ? `${parentPath}/${slug}` : slug;
};

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