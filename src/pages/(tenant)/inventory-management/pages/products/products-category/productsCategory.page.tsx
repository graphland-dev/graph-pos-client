import { confirmModal } from '@/commons/components/confirm.tsx';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Group, Stack } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import CreateAndUpdateCategoryForm from './components/CreateAndUpdateCategoryForm';
import CategoryTree from './components/CategoryTree';
import {
	GET_ROOT_CATEGORIES_WITH_CHILDREN_QUERY,
	INVENTORY_PRODUCT_CATEGORY_REMOVE,
	INVENTORY_PRODUCT_CATEGORY_UPDATE,
} from './utils/category.query';
import { CategoryTreeNode } from './utils/category.validations';
import PageTitle from '@/commons/components/PageTitle';

interface IState {
	modalOpened: boolean;
	operationType: 'create' | 'update';
	operationId?: string | null;
	operationPayload?: any;
	refetching: boolean;
	parentCategoryId?: string | null;
}

const ProductCategoryPage = () => {
	const [state, setState] = useSetState<IState>({
		modalOpened: false,
		operationType: 'create',
		operationId: null,
		operationPayload: {},
		refetching: false,
		parentCategoryId: null,
	});

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<CategoryTreeNode | null>(null);
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

	const { data, refetch } = useQuery(GET_ROOT_CATEGORIES_WITH_CHILDREN_QUERY, {
		fetchPolicy: 'cache-and-network',
	});

	const categories: CategoryTreeNode[] = data?.inventory__rootCategoriesWithChildren || [];

	const [deleteCategoryMutation] = useMutation(
		INVENTORY_PRODUCT_CATEGORY_REMOVE,
		{ onCompleted: () => handleRefetch({}) }
	);

	const [updateCategoryMutation] = useMutation(
		INVENTORY_PRODUCT_CATEGORY_UPDATE,
		{ onCompleted: () => handleRefetch({}) }
	);

	const handleRefetch = (variables: any) => {
		setState({ refetching: true });
		refetch(variables).finally(() => {
			setState({ refetching: false });
		});
	};

	const handleDeleteCategory = (categoryId: string) => {
		const category = findCategoryById(categories, categoryId);
		confirmModal({
			title: 'Delete Category',
			description: `Are you sure you want to delete "${category?.name}"? This action cannot be undone and will also delete all subcategories.`,
			isDangerous: true,
			onConfirm() {
				deleteCategoryMutation({
					variables: {
						categoryId: categoryId,
					},
				});
			},
		});
	};

	const handleCategoryCreate = (parentCategoryId?: string) => {
		setState({
			modalOpened: true,
			operationType: 'create',
			operationId: null,
			operationPayload: {},
			parentCategoryId: parentCategoryId || null,
		});
	};

	const handleCategoryEdit = (category: CategoryTreeNode) => {
		setState({
			modalOpened: true,
			operationType: 'update',
			operationId: category._id,
			operationPayload: category,
			parentCategoryId: null,
		});
	};

	const handleNodeExpand = (categoryId: string, expanded: boolean) => {
		const newExpandedNodes = new Set(expandedNodes);
		if (expanded) {
			newExpandedNodes.add(categoryId);
		} else {
			newExpandedNodes.delete(categoryId);
		}
		setExpandedNodes(newExpandedNodes);
	};

	const findCategoryById = (cats: CategoryTreeNode[], id: string): CategoryTreeNode | null => {
		for (const cat of cats) {
			if (cat._id === id) return cat;
			if (cat.children) {
				const found = findCategoryById(cat.children, id);
				if (found) return found;
			}
		}
		return null;
	};

	const filterCategories = (cats: CategoryTreeNode[], query: string): CategoryTreeNode[] => {
		if (!query) return cats;
		
		return cats.filter(cat => {
			const matchesQuery = cat.name.toLowerCase().includes(query.toLowerCase()) ||
				(cat.code && cat.code.toLowerCase().includes(query.toLowerCase()));
			
			const hasMatchingChildren = cat.children && 
				filterCategories(cat.children, query).length > 0;
			
			return matchesQuery || hasMatchingChildren;
		}).map(cat => ({
			...cat,
			children: cat.children ? filterCategories(cat.children, query) : undefined
		}));
	};

	const filteredCategories = filterCategories(categories, searchQuery);

	const handleCategoryMove = async (draggedId: string, targetParentId: string | null) => {
		try {
			console.log('handleCategoryMove called:', { draggedId, targetParentId });
			
			// Find the dragged category to get its current data
			const draggedCategory = findCategoryById(categories, draggedId);
			if (!draggedCategory) {
				console.error('Dragged category not found:', draggedId);
				return;
			}

			console.log('Found dragged category:', {
				id: draggedCategory._id,
				name: draggedCategory.name,
				level: draggedCategory.level,
				currentParent: draggedCategory.parentCategory
			});

			// Prevent moving a category to itself or its descendants
			if (targetParentId) {
				const targetCategory = findCategoryById(categories, targetParentId);
				if (targetCategory) {
					console.log('Found target category:', {
						id: targetCategory._id,
						name: targetCategory.name,
						level: targetCategory.level
					});
					
					// Check if target is a descendant of dragged category
					const isDescendant = checkIsDescendant(draggedCategory, targetParentId);
					if (isDescendant) {
						console.warn('Cannot move category to its own descendant');
						return;
					}

					// Check depth limit (max 5 levels)
					if (targetCategory.level >= 4) {
						console.warn('Maximum category depth (5 levels) would be exceeded');
						return;
					}
				} else {
					console.error('Target category not found:', targetParentId);
					return;
				}
			}

			console.log('Executing update mutation...');
			// Update the category with new parent
			await updateCategoryMutation({
				variables: {
					categoryId: draggedId,
					body: {
						parentCategoryId: targetParentId,
					},
				},
			});
			console.log('Update mutation completed successfully');
		} catch (error) {
			console.error('Error moving category:', error);
		}
	};

	const checkIsDescendant = (parentCategory: CategoryTreeNode, targetId: string): boolean => {
		if (parentCategory._id === targetId) return true;
		if (parentCategory.children) {
			return parentCategory.children.some(child => checkIsDescendant(child, targetId));
		}
		return false;
	};


	return (
		<Stack spacing="md">
			<PageTitle title="Product Categories" />
			
			{/* Header Controls */}
			<Group position="apart">
				<Button
					leftIcon={<IconPlus size={16} />}
					onClick={() => handleCategoryCreate()}
					size="sm"
				>
					Add Category
				</Button>
			</Group>

			{/* Category Tree Display */}
			<CategoryTree
				categories={filteredCategories}
				selectedCategory={selectedCategory}
				expandedNodes={expandedNodes}
				onNodeClick={setSelectedCategory}
				onNodeExpand={handleNodeExpand}
				onNodeEdit={handleCategoryEdit}
				onNodeDelete={(category) => handleDeleteCategory(category._id)}
				onAddSubcategory={(parent) => handleCategoryCreate(parent._id)}
				onCategoryMove={handleCategoryMove}
				allowEdit={true}
				allowDelete={true}
				allowDragDrop={true}
				showActions={true}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>

			{/* Category Form Drawer */}
			<Drawer
				opened={state.modalOpened}
				onClose={() => setState({ modalOpened: false })}
				position="right"
				size="md"
				title={`${state.operationType === 'create' ? 'Create' : 'Edit'} Category`}
			>
				<CreateAndUpdateCategoryForm
					onSubmissionDone={() => {
						handleRefetch({});
						setState({ modalOpened: false });
					}}
					operationType={state.operationType}
					operationId={state.operationId}
					formData={state.operationPayload}
					parentCategoryId={state.parentCategoryId}
				/>
			</Drawer>
		</Stack>
	);
};

export default ProductCategoryPage;
