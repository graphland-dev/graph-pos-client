import * as Yup from "yup";

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

// Category search/filter validation
export const CategorySearchSchema = Yup.object().shape({
  query: Yup.string()
    .optional()
    .max(100, "Search query cannot exceed 100 characters")
    .label("Search Query"),
  
  parentId: Yup.string()
    .optional()
    .nullable()
    .label("Filter by Parent"),
  
  level: Yup.number()
    .optional()
    .min(0, "Level must be 0 or greater")
    .max(5, "Maximum level is 5")
    .label("Level"),
});

// Category move validation
export const CategoryMoveSchema = Yup.object().shape({
  categoryId: Yup.string()
    .required("Category ID is required")
    .label("Category"),
  
  newParentId: Yup.string()
    .optional()
    .nullable()
    .label("New Parent Category"),
});

// TypeScript interfaces
export interface ICategoryFormData extends Yup.Asserts<typeof CategoryValidationSchema> {}

export interface ICategorySearchData extends Yup.Asserts<typeof CategorySearchSchema> {}

export interface ICategoryMoveData extends Yup.Asserts<typeof CategoryMoveSchema> {}

// Category state interface for components
export interface ICategoryState {
  categories: CategoryTreeNode[];
  selectedCategory: CategoryTreeNode | null;
  expandedNodes: Set<string>;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterParent: string | null;
}

// Extended category interface with tree functionality
export interface CategoryTreeNode {
  _id: string;
  name: string;
  code: string;
  level: number;
  path: string;
  parentCategory?: string;
  children?: CategoryTreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  hasChildren?: boolean;
}

// Category picker options
export interface CategoryPickerOption {
  value: string;
  label: string;
  level: number;
  path: string;
  disabled?: boolean;
}

// Category statistics interface
export interface CategoryStats {
  totalCategories: number;
  categoriesByLevel: Record<number, number>;
  rootCategories: number;
  deepestLevel: number;
  categoriesWithoutProducts: number;
  mostUsedCategories: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
  }>;
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