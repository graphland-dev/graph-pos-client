import { useMemo } from "react";
import { Select, SelectProps } from "@mantine/core";
import { useQuery, gql } from "@apollo/client";
import {
  CategoryTreeNode,
  CategoryPickerOption,
} from "../types/category.types";

interface CategoryPickerProps
  extends Omit<SelectProps, "data" | "value" | "onChange"> {
  value?: string | null;
  onChange: (categoryId: string | null) => void;
  excludeCategory?: string;
  maxLevel?: number;
  allowClear?: boolean;
  showPath?: boolean;
  showLevel?: boolean;
  categories?: CategoryTreeNode[];
}

// Local query for categories - isolated from product-specific usage
const SHARED_CATEGORIES_QUERY = gql`
  query SharedCategoryPicker__categories {
    inventory__rootCategoriesWithChildren {
      _id
      name
      level
      path
      children {
        _id
        name
        level
        path
        children {
          _id
          name
          level
          path
          children {
            _id
            name
            level
            path
            children {
              _id
              name
              level
              path
            }
          }
        }
      }
    }
  }
`;

const CategoryPicker = ({
  value,
  onChange,
  excludeCategory,
  maxLevel = 5,
  allowClear = true,
  showPath = true,
  showLevel = false,
  placeholder = "Select category...",
  categories: externalCategories,
  ...props
}: CategoryPickerProps) => {
  const { data } = useQuery(SHARED_CATEGORIES_QUERY, {
    skip: !!externalCategories, // Skip query if external categories are provided
  });

  const categoryOptions = useMemo(() => {
    const categories =
      externalCategories || data?.inventory__rootCategoriesWithChildren || [];
    const options: CategoryPickerOption[] = [];

    const flattenCategories = (
      cats: CategoryTreeNode[],
      level = 0,
      parentPath = ""
    ) => {
      cats.forEach((category) => {
        // Skip excluded category and its descendants
        if (excludeCategory && category._id === excludeCategory) {
          return;
        }

        // Skip categories beyond max level
        if (level >= maxLevel) {
          return;
        }

        const currentPath = parentPath
          ? `${parentPath} › ${category.name}`
          : category.name;

        // Create clean hierarchical display with visual indicators
        let label = category.name;
        
        // Add visual hierarchy for child categories using em dashes and non-breaking spaces
        if (level > 0) {
          // Use em dashes (—) with non-breaking spaces for clear hierarchy
          const prefix = "—".repeat(level) + " ";
          label = `${prefix}${label}`;
        }

        // Optionally show level information
        if (showLevel) {
          label = `${label} (Level ${category.level})`;
        }

        // Optionally show path information
        if (showPath && category.path) {
          label = `${label} - ${category.path}`;
        }

        options.push({
          value: category._id,
          label,
          level,
          path: category.path || "",
          disabled: false,
        });

        // Recursively add children
        if (category.children && category.children.length > 0) {
          flattenCategories(category.children, level + 1, currentPath);
        }
      });
    };

    flattenCategories(categories);
    return options;
  }, [
    externalCategories,
    data?.inventory__rootCategoriesWithChildren,
    excludeCategory,
    maxLevel,
    showPath,
    showLevel,
  ]);

  const selectData = categoryOptions.map((option) => ({
    value: option.value,
    label: option.label,
    disabled: option.disabled,
  }));

  return (
    <Select
      {...props}
      data={selectData}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      clearable={allowClear}
      searchable
      maxDropdownHeight={300}
    />
  );
};

export default CategoryPicker;