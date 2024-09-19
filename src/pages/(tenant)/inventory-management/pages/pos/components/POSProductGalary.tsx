import EmptyState from '@/commons/components/EmptyState.tsx';
import {
  BrandsWithPagination,
  MatchOperator,
  Product,
  ProductCategorysWithPagination,
  ProductItemReference,
  ProductsWithPagination,
} from '@/commons/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { Button, Select } from '@mantine/core';
import React, { useMemo, useState } from 'react';
import { getSelectInputData } from '../../products/product-edit/components/AssignmentForm';
import {
  Pos_Brands_Query,
  Pos_Categories_Query,
  Pos_Products_Query,
} from '../utils/query.pos';
import { getProductReferenceByQuantity } from '../utils/utils.calc';
import PosItemCard from './PosItemCard';

interface IProp {
  onSelectProduct: (product: ProductItemReference) => void;
}

const POSProductGallery: React.FC<IProp> = ({ onSelectProduct }) => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [itemsGridColumnCount, setItemsGridColumnCount] = useState(4);
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
  const { data: productsData, loading: isProductsFetching } = useQuery<{
    inventory__products: ProductsWithPagination;
  }>(Pos_Products_Query, {
    nextFetchPolicy: 'network-only',
    variables: {
      where: {
        limit: itemsPerPage,
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
    <div className="flex flex-col h-[calc(100vh-46px)]">
      {/* Filters */}
      <div className="grid flex-none h-[40px] place-content-center grid-cols-2 gap-2">
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
      </div>

      {/* Items */}

      <div className="flex-1 overflow-y-auto">
        <div className={`grid grid-columns--${itemsGridColumnCount} gap-2`}>
          {productsData?.inventory__products.nodes?.map((product) => (
            <PosItemCard
              product={product}
              onClick={(_product) => handleEmitProduct(_product)}
            />
          ))}
        </div>
      </div>

      <EmptyState
        visible={
          !productsData?.inventory__products.nodes?.length &&
          !isProductsFetching
        }
        label={'No products found with your filter!'}
      />

      {/* Bottom Ribon */}
      <div className="flex-none h-[40px] flex justify-between items-center px-2">
        <div className="flex">
          <Select
            size="md"
            radius={0}
            placeholder="Items per page"
            data={[
              { value: '50', label: '50 items per page' },
              { value: '100', label: '100 items per page' },
              { value: '200', label: '200 items per page' },
              { value: '500', label: '500 items per page' },
              { value: '1000', label: '1000 items per page' },
            ]}
            value={itemsPerPage.toString()}
            onChange={(value) => {
              setItemsPerPage(Number(value));
              setPage(1);
            }}
          />

          <Select
            size="md"
            radius={0}
            placeholder="Columns"
            data={[
              { value: '2', label: '2 columns' },
              { value: '3', label: '3 columns' },
              { value: '4', label: '4 columns' },
              { value: '5', label: '5 columns' },
              { value: '6', label: '6 columns' },
            ]}
            value={itemsGridColumnCount.toString()}
            onChange={(value) => {
              setItemsGridColumnCount(Number(value));
            }}
          />
        </div>

        <div className="flex justify-center gap-2">
          <Button
            onClick={() => {
              if (page === 1) return;
              setPage(page - 1);
            }}
          >
            Prev
          </Button>
          <Button
            onClick={() => {
              if (page === productsData?.inventory__products.meta?.totalPages)
                return;
              setPage(page + 1);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default POSProductGallery;
