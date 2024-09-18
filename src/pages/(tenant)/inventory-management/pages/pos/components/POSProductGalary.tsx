import EmptyState from '@/commons/components/EmptyState.tsx';
import { getFileUrl } from '@/commons/utils/getFileUrl';
import {
  BrandsWithPagination,
  MatchOperator,
  Product,
  ProductCategorysWithPagination,
  ProductItemReference,
  ProductsWithPagination,
  ServerFileReference,
} from '@/commons/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import {
  Badge,
  Input,
  Paper,
  Select,
  Skeleton,
  Space,
  Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import React, { useCallback, useMemo, useState } from 'react';
import { VisibilityObserver } from 'reactjs-visibility';
import { getSelectInputData } from '../../products/product-edit/components/AssignmentForm';
import {
  Pos_Brands_Query,
  Pos_Categories_Query,
  Pos_Products_Query,
} from '../utils/query.pos';
import { getProductReferenceByQuantity, getStock } from '../utils/utils.calc';

interface IProp {
  onSelectProduct: (product: ProductItemReference) => void;
}

const POSProductGallery: React.FC<IProp> = ({ onSelectProduct }) => {
  const [page, setPage] = useState(1);
  const [filteredCategoryID, setFilteredCategoryID] = useState('');
  const [filteredBrandID, setFilteredBrandID] = useState('');

  const buildFilter = useMemo(() => {
    const filters = [];
    if (filteredCategoryID) {
      filters.push({
        key: 'category',
        operator: MatchOperator.Eq,
        value: filteredCategoryID,
      });
    }
    if (filteredBrandID) {
      filters.push({
        key: 'brand',
        operator: MatchOperator.Eq,
        value: filteredBrandID,
      });
    }

    return filters;
  }, [filteredCategoryID, filteredBrandID]);

  // products fetching
  const { data: productsData } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(Pos_Products_Query, {
    nextFetchPolicy: 'network-only',
    variables: {
      where: {
        limit: 100,
        page,
        filters: [...buildFilter],
      },
    },
  });

  // categories query
  const { data: categories, loading: loadingCategories } = useQuery<{
    inventory__productCategories: ProductCategorysWithPagination;
  }>(Pos_Categories_Query, {
    variables: {
      where: { limit: -1 },
    },
    nextFetchPolicy: 'network-only',
  });

  // // brands query
  const { data: brands, loading: loadingBrands } = useQuery<{
    setup__brands: BrandsWithPagination;
  }>(Pos_Brands_Query, {
    variables: {
      where: { limit: -1 },
    },
    nextFetchPolicy: 'network-only',
  });

  // handle emit product
  const handleEmitProduct = (product: Product) => {
    const audio = new Audio('/beep.mp3');
    audio.play();
    onSelectProduct(getProductReferenceByQuantity(product, 1));
  };

  return (
    <Paper p={15} className=" h-[calc(100vh-44px)] overflow-y-auto">
      <div className="grid grid-cols-2 gap-2">
        <Input.Wrapper size="md" label="Category">
          <Select
            size="md"
            radius={0}
            searchable
            clearable
            placeholder="Select a category"
            data={getSelectInputData(
              categories?.inventory__productCategories?.nodes,
            )}
            onChange={(catId) => setFilteredCategoryID(catId!)}
            disabled={loadingCategories}
          />
        </Input.Wrapper>

        <Input.Wrapper size="md" label="Brand">
          <Select
            size="md"
            radius={0}
            searchable
            clearable
            placeholder="Select a brand"
            data={getSelectInputData(brands?.setup__brands?.nodes)}
            onChange={(brandId) => setFilteredBrandID(brandId!)}
            disabled={loadingBrands}
          />
        </Input.Wrapper>
      </div>

      <Space h={20} />
      <div className="grid grid-cols-4 gap-2">
        {productsData?.inventory__products.nodes?.map((product) => (

        ))}
      </div>
      {/*{!productsList?.length && !isProductsFetching && (*/}
      {/*  <EmptyState label={'No products found with your filter!'} />*/}
      {/*)}*/}
    </Paper>
  );
};

export default POSProductGallery;
