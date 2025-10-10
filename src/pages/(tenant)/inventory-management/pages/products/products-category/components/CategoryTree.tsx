import {
  Box,
  Group,
  Text,
  ActionIcon,
  Menu,
  Collapse,
  Paper,
  Stack,
  Badge,
  TextInput,
} from '@mantine/core';
import { useState } from 'react';
import {
  IconChevronRight,
  IconChevronDown,
  IconFolder,
  IconFolderOpen,
  IconDots,
  IconPencil,
  IconTrash,
  IconPlus,
  IconSearch,
  IconX,
  IconGripVertical,
} from '@tabler/icons-react';
import { CategoryTreeNode } from '../utils/category.validations';

interface CategoryTreeProps {
  categories: CategoryTreeNode[];
  selectedCategory?: CategoryTreeNode | null;
  expandedNodes?: Set<string>;
  onNodeClick?: (category: CategoryTreeNode) => void;
  onNodeExpand?: (categoryId: string, expanded: boolean) => void;
  onNodeEdit?: (category: CategoryTreeNode) => void;
  onNodeDelete?: (category: CategoryTreeNode) => void;
  onAddSubcategory?: (parentCategory: CategoryTreeNode) => void;
  onCategoryMove?: (draggedId: string, targetParentId: string | null) => void;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowDragDrop?: boolean;
  showActions?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
}

interface CategoryTreeNodeProps {
  category: CategoryTreeNode;
  level: number;
  isSelected?: boolean;
  isExpanded?: boolean;
  selectedCategory?: CategoryTreeNode | null;
  expandedNodes?: Set<string>;
  onNodeClick?: (category: CategoryTreeNode) => void;
  onNodeExpand?: (categoryId: string, expanded: boolean) => void;
  onNodeEdit?: (category: CategoryTreeNode) => void;
  onNodeDelete?: (category: CategoryTreeNode) => void;
  onAddSubcategory?: (parentCategory: CategoryTreeNode) => void;
  onCategoryMove?: (draggedId: string, targetParentId: string | null) => void;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowDragDrop?: boolean;
  showActions?: boolean;
}

const CategoryTreeNodeComponent = ({
  category,
  level,
  isSelected = false,
  isExpanded = false,
  selectedCategory,
  expandedNodes,
  onNodeClick,
  onNodeExpand,
  onNodeEdit,
  onNodeDelete,
  onAddSubcategory,
  onCategoryMove,
  allowEdit = true,
  allowDelete = true,
  allowDragDrop = true,
  showActions = true,
}: CategoryTreeNodeProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const indentSize = level * 20;
  
  // Determine actual state based on props passed down
  const actualIsSelected = (selectedCategory && selectedCategory._id === category._id) || isSelected;
  const actualIsExpanded = (expandedNodes && expandedNodes.has(category._id)) || isExpanded;

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    console.log('Drag start:', {
      categoryId: category._id,
      categoryName: category.name,
      categoryLevel: category.level
    });
    e.dataTransfer.setData('text/plain', category._id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    // Note: getData() during dragenter is unreliable, so we'll check in handleDrop
    // For now, just show the drop indicator - validation will happen in handleDrop
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only remove drag over state if we're actually leaving the element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const draggedId = e.dataTransfer.getData('text/plain');
    console.log('Drop event:', {
      draggedId,
      targetId: category._id,
      targetName: category.name,
      targetLevel: category.level,
      onCategoryMove: !!onCategoryMove
    });
    
    if (draggedId && draggedId !== category._id && onCategoryMove) {
      // Check if the target is not a descendant of the dragged item
      const isDescendant = checkIsDescendant(category, draggedId);
      console.log('Descendant check:', { isDescendant, draggedId, targetId: category._id });
      
      if (!isDescendant) {
        console.log('Calling onCategoryMove:', draggedId, 'to parent:', category._id);
        onCategoryMove(draggedId, category._id);
      } else {
        console.warn('Cannot drop category on its descendant');
      }
    } else {
      console.warn('Drop cancelled:', {
        noDraggedId: !draggedId,
        sameCategory: draggedId === category._id,
        noCallback: !onCategoryMove
      });
    }
  };


  const checkIsDescendant = (node: CategoryTreeNode, targetId: string): boolean => {
    if (node._id === targetId) return true;
    if (node.children) {
      return node.children.some(child => checkIsDescendant(child, targetId));
    }
    return false;
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onNodeExpand?.(category._id, !actualIsExpanded);
    }
  };

  const handleNodeClick = () => {
    onNodeClick?.(category);
  };

  const getLevelColor = (level: number) => {
    const colors = ['blue', 'green', 'orange', 'purple', 'red'];
    return colors[level % colors.length];
  };

  return (
    <Box>
      <Paper
        p="xs"
        withBorder={actualIsSelected || isDragOver}
        draggable={allowDragDrop}
        onDragStart={allowDragDrop ? handleDragStart : undefined}
        onDragEnd={allowDragDrop ? handleDragEnd : undefined}
        onDragOver={allowDragDrop ? handleDragOver : undefined}
        onDragEnter={allowDragDrop ? handleDragEnter : undefined}
        onDragLeave={allowDragDrop ? handleDragLeave : undefined}
        onDrop={allowDragDrop ? handleDrop : undefined}
        style={{
          marginLeft: indentSize,
          cursor: allowDragDrop ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
          backgroundColor: isDragOver 
            ? '#e3f2fd' 
            : actualIsSelected 
              ? '#f8f9fa' 
              : isDragging 
                ? '#f5f5f5'
                : 'transparent',
          borderColor: isDragOver 
            ? '#2196f3' 
            : actualIsSelected 
              ? '#228be6' 
              : 'transparent',
          opacity: isDragging ? 0.6 : 1,
          transition: 'all 0.2s ease',
          transform: isDragOver ? 'translateY(-1px)' : 'none',
          boxShadow: isDragOver ? '0 2px 8px rgba(33, 150, 243, 0.2)' : 'none',
        }}
        onClick={handleNodeClick}
      >
        <Group justify="space-between" gap="xs">
          <Group gap="xs" style={{ flex: 1 }}>
            {/* Drag Handle */}
            {allowDragDrop && (
              <ActionIcon
                variant="subtle"
                size="sm"
                style={{ cursor: 'grab' }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <IconGripVertical size={14} color="#999" />
              </ActionIcon>
            )}

            {/* Expand/Collapse Button */}
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={handleToggleExpand}
              style={{
                visibility: hasChildren ? 'visible' : 'hidden',
              }}
            >
              {actualIsExpanded ? (
                <IconChevronDown size={16} />
              ) : (
                <IconChevronRight size={16} />
              )}
            </ActionIcon>

            {/* Folder Icon */}
            <Box>
              {hasChildren ? (
                actualIsExpanded ? (
                  <IconFolderOpen size={18} color="#ffd43b" />
                ) : (
                  <IconFolder size={18} color="#fab005" />
                )
              ) : (
                <IconFolder size={18} color="#868e96" />
              )}
            </Box>

            {/* Category Info */}
            <Box style={{ flex: 1 }}>
              <Group gap="xs" align="center">
                <Text size="sm" fw={500}>
                  {category.name}
                </Text>
                
                {category.code && (
                  <Badge size="xs" variant="light" color="gray">
                    {category.code}
                  </Badge>
                )}
                
                <Badge size="xs" variant="light" color={getLevelColor(category.level)}>
                  Level {category.level}
                </Badge>
              </Group>

              {category.note && (
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {category.note}
                </Text>
              )}
            </Box>
          </Group>

          {/* Actions Menu */}
          {showActions && (
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconPlus size={16} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubcategory?.(category);
                  }}
                >
                  Add Subcategory
                </Menu.Item>

                {allowEdit && (
                  <Menu.Item
                    leftSection={<IconPencil size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeEdit?.(category);
                    }}
                  >
                    Edit Category
                  </Menu.Item>
                )}

                {allowDelete && (
                  <Menu.Item
                    leftSection={<IconTrash size={16} />}
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeDelete?.(category);
                    }}
                  >
                    Delete Category
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Paper>

      {/* Children */}
      {hasChildren && (
        <Collapse in={actualIsExpanded}>
          <Box mt="xs">
            {category.children?.map((child) => (
              <CategoryTreeNodeComponent
                key={child._id}
                category={child}
                level={level + 1}
                isSelected={false}
                isExpanded={false}
                selectedCategory={selectedCategory}
                expandedNodes={expandedNodes}
                onNodeClick={onNodeClick}
                onNodeExpand={onNodeExpand}
                onNodeEdit={onNodeEdit}
                onNodeDelete={onNodeDelete}
                onAddSubcategory={onAddSubcategory}
                onCategoryMove={onCategoryMove}
                allowEdit={allowEdit}
                allowDelete={allowDelete}
                allowDragDrop={allowDragDrop}
                showActions={showActions}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

const CategoryTree = ({
  categories,
  selectedCategory,
  expandedNodes = new Set(),
  onNodeClick,
  onNodeExpand,
  onNodeEdit,
  onNodeDelete,
  onAddSubcategory,
  onCategoryMove,
  allowEdit = true,
  allowDelete = true,
  allowDragDrop = true,
  showActions = true,
  searchQuery = '',
  onSearchChange,
  className,
}: CategoryTreeProps) => {
  // Root drop zone handler
  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && onCategoryMove) {
      onCategoryMove(draggedId, null); // Move to root level
    }
  };
  if (!categories || categories.length === 0) {
    return (
      <Paper p="xl" withBorder>
        <Text ta="center" c="dimmed">
          No categories found. Create your first category to get started.
        </Text>
      </Paper>
    );
  }

  return (
    <Stack gap="md" className={className}>
      {/* Search Box */}
      {onSearchChange && (
        <TextInput
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftSection={<IconSearch size={16} />}
          rightSection={
            searchQuery ? (
              <ActionIcon
                variant="subtle"
                onClick={() => onSearchChange('')}
                size="sm"
              >
                <IconX size={14} />
              </ActionIcon>
            ) : null
          }
          mb="md"
        />
      )}
      
      {/* Category Tree */}
      <Box
        onDragOver={allowDragDrop ? handleRootDragOver : undefined}
        onDrop={allowDragDrop ? handleRootDrop : undefined}
        style={{
          minHeight: '200px',
          border: allowDragDrop ? '2px dashed transparent' : 'none',
          borderRadius: '4px',
          transition: 'border-color 0.2s',
        }}
        onDragEnter={(e) => {
          if (allowDragDrop) {
            e.currentTarget.style.borderColor = '#228be6';
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }
        }}
        onDragLeave={(e) => {
          if (allowDragDrop) {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <Stack gap="xs">
          {categories.map((category) => (
            <CategoryTreeNodeComponent
              key={category._id}
              category={category}
              level={0}
              isSelected={selectedCategory?._id === category._id}
              isExpanded={expandedNodes.has(category._id)}
              selectedCategory={selectedCategory}
              expandedNodes={expandedNodes}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              onNodeEdit={onNodeEdit}
              onNodeDelete={onNodeDelete}
              onAddSubcategory={onAddSubcategory}
              onCategoryMove={onCategoryMove}
              allowEdit={allowEdit}
              allowDelete={allowDelete}
              allowDragDrop={allowDragDrop}
              showActions={showActions}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default CategoryTree;
