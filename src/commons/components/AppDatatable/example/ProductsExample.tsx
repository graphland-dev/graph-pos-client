import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import AppDatatable, { ColumnDef } from "../AppDatatable";
import {
  PRODUCTS_EXAMPLE_QUERY,
  Product,
  ProductsResponse,
} from "./products.query";
import {
  CommonPaginationDto,
  MatchOperator,
  SortType,
} from "@/commons/graphql-models/graphql";

const ProductsExample: React.FC = () => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const [sorting, setSorting] = useState<{
    column: string;
    direction: "asc" | "desc" | null;
  }>({ column: "", direction: null });

  const [filters, setFilters] = useState<Record<string, string>>({});

  // Build GraphQL variables
  const buildWhereClause = (): CommonPaginationDto => {
    const graphqlFilters = [];

    // Add search filters
    if (filters.name || filters.code) {
      const orConditions = [];

      if (filters.name) {
        orConditions.push({
          key: "name",
          operator: MatchOperator.Contains,
          value: filters.name,
        });
      }

      if (filters.code) {
        orConditions.push({
          key: "code",
          operator: MatchOperator.Eq,
          value: filters.code,
        });
      }

      if (orConditions.length > 0) {
        graphqlFilters.push({ or: orConditions });
      }
    }

    // Add price filter
    if (filters.price) {
      graphqlFilters.push({
        key: "price",
        operator: MatchOperator.Gte,
        value: parseFloat(filters.price) || 0,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? SortType.Asc : SortType.Desc,
      // filters: graphqlFilters,
    };
  };

  const { data, loading, refetch } = useQuery<ProductsResponse>(
    PRODUCTS_EXAMPLE_QUERY,
    {
      variables: { where: buildWhereClause() },
      fetchPolicy: "cache-and-network",
    }
  );

  // Handle sorting
  const handleSortChange = (
    column: string,
    direction: "asc" | "desc" | null
  ) => {
    setSorting({ column, direction });
  };

  // Handle filtering
  const handleFilterChange = (column: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on filter
  };

  // Handle pagination
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ page, pageSize });
  };

  // Handle row click
  const handleRowClick = (product: Product) => {
    console.log("Product clicked:", product);
    alert(`Clicked on product: ${product.name}`);
  };

  // Calculate stock quantity
  const getStockQuantity = (product: Product) => {
    if (product.isSellableWithoutStock) {
      return "N/A";
    }
    return (product.currentStockQuantity || 0).toString();
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Column definitions
  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        accessor: "name",
        title: "Product Name",
        sortable: true,
        Filter: (setValue) => (
          <input
            type="text"
            placeholder="Search by name..."
            onChange={(e) => setValue("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ),
      },
      {
        accessor: "code",
        title: "Product Code",
        sortable: true,
        Filter: (setValue) => (
          <input
            type="text"
            placeholder="Exact code..."
            onChange={(e) => setValue("code", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ),
      },
      {
        accessor: (row) => formatPrice(row.price),
        title: "Price",
        sortKey: "price", // Use the actual field name for sorting
        sortable: true,
        Filter: (setValue) => (
          <input
            type="number"
            placeholder="Min price..."
            min="0"
            step="0.01"
            onChange={(e) => setValue("price", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ),
      },
      {
        accessor: (row) => getStockQuantity(row),
        title: "Stock Quantity",
        sortable: false,
      },
      {
        accessor: (row) =>
          row.vat ? `${row.vat.code} (${row.vat.percentage}%)` : "No VAT",
        title: "VAT",
      },
      {
        accessor: (row) => (row.isSellableWithoutStock ? "Yes" : "No"),
        title: "Sellable Without Stock",
      },
    ],
    []
  );

  // Action column component
  const ActionColumn = (product: Product) => (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          alert(`Edit product: ${product.name} (${product.code})`);
        }}
        className="px-3 py-1 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          alert(`Delete product: ${product.name} (${product.code})`);
        }}
        className="px-3 py-1 text-sm text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Products Example
        </h1>
        <p className="text-gray-600">
          Demonstration of AppDatatable component with sorting, filtering, and
          pagination
        </p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
        >
          Refresh Data
        </button>
        <button
          onClick={() => {
            setFilters({});
            setSorting({ column: "", direction: null });
            setPagination({ page: 1, pageSize: 10 });
          }}
          className="px-4 py-2 text-white transition-colors bg-gray-500 rounded-md hover:bg-gray-600"
        >
          Reset All
        </button>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.inventory__products?.nodes || []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.inventory__products?.meta?.totalCount || 0,
          currentPage: pagination.page,
        }}
        ActionColumn={ActionColumn}
        onRowClick={handleRowClick}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onPaginationChange={handlePaginationChange}
        loading={loading}
        emptyMessage="No products found. Try adjusting your filters."
      />

      {/* Debug Info */}
      <div className="p-4 mt-8 bg-gray-100 rounded-lg">
        <h3 className="mb-2 text-lg font-semibold">Debug Info</h3>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div>
            <strong>Current Filters:</strong>
            <pre className="mt-1 text-xs">
              {JSON.stringify(filters, null, 2)}
            </pre>
          </div>
          <div>
            <strong>Current Sorting:</strong>
            <pre className="mt-1 text-xs">
              {JSON.stringify(sorting, null, 2)}
            </pre>
          </div>
          <div>
            <strong>Current Pagination:</strong>
            <pre className="mt-1 text-xs">
              {JSON.stringify(pagination, null, 2)}
            </pre>
          </div>
        </div>
        <div className="mt-4">
          <strong>GraphQL Variables:</strong>
          <pre className="p-2 mt-1 overflow-x-auto text-xs bg-white border rounded">
            {JSON.stringify({ where: buildWhereClause() }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ProductsExample;
