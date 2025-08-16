 🎯 Task Overview

  You need to implement a comprehensive frontend interface for managing hierarchical product categories in a Point of Sale (POS) system. The backend
  GraphQL API is already implemented with full sub-category support.

  📋 Backend API Reference

  Available GraphQL Operations

  Queries

  # Get root categories only (no children populated)
  query GetRootCategories {
    inventory__rootCategories {
      _id
      name
      code
      level
      path
      parentCategory
    }
  }

  # Get root categories with all children pre-loaded (RECOMMENDED for tree views)
  query GetRootCategoriesWithChildren {
    inventory__rootCategoriesWithChildren {
      _id
      name
      code
      level
      path
      children {
        _id
        name
        code
        level
        path
        children {
          _id
          name
          code
          level
          path
        }
      }
    }
  }

  # Get specific category's direct children
  query GetCategoryChildren($categoryId: ID!) {
    inventory__categoryChildren(categoryId: $categoryId) {
      _id
      name
      code
      level
      path
    }
  }

  # Get all descendants of a category (entire subtree)
  query GetCategoryDescendants($categoryId: ID!) {
    inventory__categoryDescendants(categoryId: $categoryId) {
      _id
      name
      code
      level
      path
    }
  }

  # Get category tree from specific root
  query GetCategoryTree($rootCategoryId: ID) {
    inventory__categoryTree(rootCategoryId: $rootCategoryId) {
      _id
      name
      code
      level
      path
      children {
        _id
        name
        code
        children {
          _id
          name
          code
        }
      }
    }
  }

  Mutations

  # Create new category (code is optional - auto-generated from name)
  mutation CreateCategory($input: CreateProductCategoryInput!) {
    inventory__createProductCategory(body: $input) {
      success
      message
    }
  }

  # Update category
  mutation UpdateCategory($categoryId: ID!, $input: UpdateProductCategoryInput!) {
    inventory__updateProductCategory(categoryId: $categoryId, body: $input)
  }

  # Delete category
  mutation DeleteCategory($categoryId: ID!) {
    inventory__removeProductCategory(where: { _id: $categoryId })
  }

  Input Types

  interface CreateProductCategoryInput {
    name: string;                    // Required
    code?: string;                   // Optional - auto-generated from name
    note?: string;                   // Optional
    parentCategoryId?: string;       // Optional - null for root category
  }

  interface UpdateProductCategoryInput {
    name?: string;
    code?: string;
    note?: string;
    parentCategoryId?: string;       // Can move category to different parent
  }

  🎨 Required UI Components

  1. Category Tree View

  - Purpose: Display hierarchical category structure
  - Features:
    - Expandable/collapsible tree nodes
    - Drag & drop to move categories between parents
    - Visual indicators for category levels (indentation/icons)
    - Context menu (edit, delete, add subcategory)
    - Search/filter functionality

  Recommended Query: Use inventory__rootCategoriesWithChildren for optimal performance

  2. Category Management Form

  - Create Mode: Add new category with optional parent selection
  - Edit Mode: Modify existing category, including moving to different parent
  - Features:
    - Parent category dropdown (hierarchical)
    - Auto-code generation preview
    - Validation (prevent circular references, max depth)
    - Real-time path preview

  3. Category Picker/Selector

  - Purpose: For use in product forms and other places needing category selection
  - Features:
    - Hierarchical dropdown or tree picker
    - Search with path-based results
    - Breadcrumb display of selected category path

  4. Category Statistics Dashboard

  - Purpose: Overview of category usage and structure
  - Features:
    - Category count by level
    - Most used categories
    - Categories without products
    - Tree depth visualization

  💡 Implementation Guidelines

  Performance Optimization

  1. Use inventory__rootCategoriesWithChildren for tree views to avoid N+1 queries
  2. Cache category data and update incrementally on mutations
  3. Implement virtual scrolling for large category lists
  4. Lazy load deep tree levels if needed

  User Experience

  1. Visual Hierarchy: Use consistent indentation, icons, and colors
  2. Drag & Drop: Allow intuitive category reorganization
  3. Breadcrumbs: Show category path clearly (e.g., "Electronics > Computers > Laptops")
  4. Auto-suggestions: Help users with category path completion

  Data Handling

  1. Optimistic Updates: Update UI immediately, rollback on error
  2. Real-time Sync: Consider WebSocket/polling for multi-user scenarios
  3. Offline Support: Cache category structure for offline browsing

  Validation & Error Handling

  1. Client-side Validation:
    - Prevent circular parent references
    - Enforce max depth (5 levels)
    - Validate required fields
  2. Error Messages: Clear, actionable error messages
  3. Conflict Resolution: Handle concurrent edits gracefully

  🔧 Technical Specifications

  State Management

  interface CategoryState {
    categories: Category[];
    selectedCategory: Category | null;
    loading: boolean;
    error: string | null;
  }

  interface Category {
    _id: string;
    name: string;
    code: string;
    level: number;
    path: string;
    parentCategory?: string;
    children?: Category[];
  }

  Key Functions to Implement

  1. createCategory(input: CreateCategoryInput)
  2. updateCategory(id: string, input: UpdateCategoryInput)
  3. deleteCategory(id: string)
  4. moveCategory(categoryId: string, newParentId: string | null)
  5. searchCategories(query: string)
  6. getCategoryPath(categoryId: string): string[]

  🎯 Priority Implementation Order

  1. Basic Category List - Simple flat list with CRUD operations
  2. Tree View Component - Hierarchical display with expand/collapse
  3. Category Form - Create/edit with parent selection
  4. Drag & Drop - Intuitive category reorganization
  5. Search & Filter - Find categories quickly
  6. Advanced Features - Statistics, bulk operations, import/export

  ⚠️ Important Notes

  - Code Generation: Category codes are auto-generated from names (lowercase with underscores)
  - Path System: Categories have unique paths like "electronics/computers/laptops"
  - Tenant Isolation: All operations are automatically scoped to the current tenant
  - Max Depth: System enforces 5-level maximum depth
  - Performance: Use the optimized queries to prevent N+1 query issues

  🚀 Success Criteria

  ✅ Users can create, edit, and delete categories✅ Categories can be organized in unlimited hierarchical levels (up to 5)✅ Drag & drop functionality
  for easy reorganization✅ Fast, responsive tree navigation✅ Clear visual hierarchy and breadcrumb navigation✅ Search functionality works across the
  entire category tree✅ Proper error handling and validation✅ Mobile-responsive design

  This implementation will provide users with a powerful, intuitive category management system that scales efficiently with large category trees.