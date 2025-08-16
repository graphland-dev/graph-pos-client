import { useMemo } from 'react';
import { Select, SelectProps } from '@mantine/core';
import { useQuery } from '@apollo/client';
import { GET_ROOT_CATEGORIES_WITH_CHILDREN_QUERY } from '../utils/category.query';
import { CategoryTreeNode, CategoryPickerOption } from '../utils/category.validations';

interface CategoryPickerProps extends Omit<SelectProps, 'data' | 'value' | 'onChange'> {
  value?: string | null;
  onChange: (categoryId: string | null) => void;
  excludeCategory?: string;
  maxLevel?: number;
  allowClear?: boolean;
  showPath?: boolean;
  showLevel?: boolean;
}

const CategoryPicker = ({
  value,
  onChange,
  excludeCategory,
  maxLevel = 5,
  allowClear = true,
  showPath = true,
  showLevel = false,
  placeholder = "Select category...",
  ...props
}: CategoryPickerProps) => {
  const { data } = useQuery(GET_ROOT_CATEGORIES_WITH_CHILDREN_QUERY);

  const categories = data?.inventory__rootCategoriesWithChildren || [];

  const categoryOptions = useMemo(() => {
    const options: CategoryPickerOption[] = [];

    const flattenCategories = (
      cats: CategoryTreeNode[],
      level = 0,
      parentPath = ''
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

        let label = category.name;
        
        if (showLevel) {
          label = `${'  '.repeat(level)}${label} (Level ${level})`;
        } else if (level > 0) {
          label = `${'  '.repeat(level)}${label}`;
        }
        
        if (showPath && category.path) {
          label = `${label} - ${category.path}`;
        }

        options.push({
          value: category._id,
          label,
          level,
          path: category.path || '',
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
  }, [categories, excludeCategory, maxLevel, showPath, showLevel]);

  const selectData = categoryOptions.map(option => ({
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