import {
	BrandsWithPagination,
	ProductCategorysWithPagination,
} from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { Flex, Input, Select } from '@mantine/core';
import { getSelectInputData } from '../../products/product-edit/components/AssignmentForm';
import { Pos_Brands_Query, Pos_Categories_Query } from '../utils/query.pos';

const CategoryAndBrandSelectArea: React.FC<{
	formInstance: any;
}> = ({ formInstance }) => {
	// categories query
	const { data: categories, loading: loadingCategories } = useQuery<{
		inventory__productCategories: ProductCategorysWithPagination;
	}>(Pos_Categories_Query);

	// brands query
	const { data: brands, loading: loadingBrands } = useQuery<{
		setup__brands: BrandsWithPagination;
	}>(Pos_Brands_Query);

	return (
		<Flex gap={8}>
			{/* {JSON.stringify(formInstance.watch('category'))}
			{JSON.stringify(formInstance.watch('brand'))} */}

			<Input.Wrapper
				size='md'
				error={
					<ErrorMessage
						name='category'
						errors={formInstance.formState.errors}
					/>
				}
			>
				<Select
					data={getSelectInputData(
						categories?.inventory__productCategories?.nodes
					)}
					size='md'
					disabled={loadingCategories}
					radius={0}
					placeholder='Select a category'
					onChange={(e) => formInstance.setValue('category', e)}
				/>
			</Input.Wrapper>

			<Input.Wrapper
				size='md'
				error={
					<ErrorMessage name='brand' errors={formInstance.formState.errors} />
				}
			>
				<Select
					data={getSelectInputData(brands?.setup__brands?.nodes)}
					size='md'
					disabled={loadingBrands}
					radius={0}
					placeholder='Select a brand'
					onChange={(e) => formInstance.setValue('brand', e)}
				/>
			</Input.Wrapper>
		</Flex>
	);
};

export default CategoryAndBrandSelectArea;
