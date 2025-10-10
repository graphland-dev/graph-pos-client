import React, { useState } from "react";

export interface ColumnDef<T = any> {
  accessor: string | ((row: T) => any);
  title: string;
  sortable?: boolean;
  sortKey?: string; // Use this key for sorting when accessor is a function
  Filter?: (setValue: (key: string, value: any) => void) => React.ReactNode;
  width?: string | number;
}

export interface PaginationConfig {
  pageSize: number;
  totalItems: number;
  currentPage?: number;
}

export interface AppDatatableProps<T = any> {
  columns: ColumnDef<T>[];
  data: T[];
  paginationConfig?: PaginationConfig;
  ActionColumn?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  onSortChange?: (column: string, direction: "asc" | "desc" | null) => void;
  onFilterChange?: (column: string, value: string) => void;
  onPaginationChange?: (page: number, pageSize: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

interface SortState {
  column: string | null;
  direction: "asc" | "desc" | null;
}

interface FilterState {
  [key: string]: string;
}

const AppDatatable = <T extends Record<string, any>>({
  columns,
  data,
  paginationConfig,
  ActionColumn,
  onRowClick,
  onSortChange,
  onFilterChange,
  onPaginationChange,
  loading = false,
  emptyMessage = "No data available",
}: AppDatatableProps<T>) => {
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });
  const [filterState, setFilterState] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    paginationConfig?.currentPage || 1
  );

  // Handle sorting
  const handleSort = (column: string, sortKey: string | undefined, sortable?: boolean) => {
    if (!sortable) return;

    // Use sortKey if provided, otherwise use column
    const sortColumn = sortKey || column;
    
    let newDirection: "asc" | "desc" | null = "asc";

    if (sortState.column === sortColumn) {
      if (sortState.direction === "asc") {
        newDirection = "desc";
      } else if (sortState.direction === "desc") {
        newDirection = null;
      }
    }

    const newSortState = {
      column: newDirection ? sortColumn : null,
      direction: newDirection,
    };
    setSortState(newSortState);
    onSortChange?.(sortColumn, newDirection);
  };

  // Handle filtering
  const handleFilter = (column: string, value: string) => {
    const newFilterState = { ...filterState, [column]: value };
    if (!value) {
      delete newFilterState[column];
    }
    setFilterState(newFilterState);
    onFilterChange?.(column, value);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPaginationChange?.(page, paginationConfig?.pageSize || 10);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setCurrentPage(1); // Reset to first page when changing page size
    onPaginationChange?.(1, newPageSize);
  };

  // Get cell value
  const getCellValue = (row: T, column: ColumnDef<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }

    const keys = column.accessor.split(".");
    let value: any = row;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  // Calculate pagination
  const totalPages = paginationConfig
    ? Math.ceil(paginationConfig.totalItems / paginationConfig.pageSize)
    : 1;

  // Filter toggle
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterState({});
    columns.forEach((column) => {
      const accessor =
        typeof column.accessor === "string" ? column.accessor : "";
      onFilterChange?.(accessor, "");
    });
  };

  const hasActiveFilters = Object.keys(filterState).length > 0;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full">
      {/* Filter Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFilters}
            className={`px-3 py-1 text-sm border rounded-md transition-colors ${
              showFilters
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            title="Toggle Filters"
          >
            Filter
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-gray-700 transition-colors bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              title="Clear Filters"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      {showFilters && (
        <div className="p-4 mb-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {columns.map((column, index) => {
              const accessor =
                typeof column.accessor === "string"
                  ? column.accessor
                  : `column_${index}`;
              return column.Filter ? (
                <div key={accessor}>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {column.title}
                  </label>
                  {column.Filter((key, value) => handleFilter(key, value))}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => {
                const accessor =
                  typeof column.accessor === "string"
                    ? column.accessor
                    : `column_${index}`;
                
                // Use sortKey if provided, otherwise use accessor for sorting comparison
                const sortColumn = column.sortKey || accessor;
                const isSorted = sortState.column === sortColumn;
                const isAsc = isSorted && sortState.direction === "asc";
                const isDesc = isSorted && sortState.direction === "desc";

                return (
                  <th
                    key={accessor}
                    style={{ width: column.width }}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable
                        ? "cursor-pointer hover:bg-gray-100 select-none"
                        : ""
                    }`}
                    onClick={() => handleSort(accessor, column.sortKey, column.sortable)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.title}</span>
                      {column.sortable && (
                        <div className="flex flex-col ml-1">
                          <svg
                            className={`w-3 h-3 ${
                              isAsc ? "text-blue-500" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <svg
                            className={`w-3 h-3 ${
                              isDesc ? "text-blue-500" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
              {ActionColumn && (
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (ActionColumn ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    <span className="ml-2 text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (ActionColumn ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, colIndex) => {
                    const accessor =
                      typeof column.accessor === "string"
                        ? column.accessor
                        : `column_${colIndex}`;
                    const value = getCellValue(row, column);

                    return (
                      <td
                        key={accessor}
                        className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
                      >
                        {value != null ? (
                          typeof value === 'object' && React.isValidElement(value) ? (
                            value
                          ) : (
                            String(value)
                          )
                        ) : ""}
                      </td>
                    );
                  })}
                  {ActionColumn && (
                    <td
                      className="px-6 py-4 text-sm whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {ActionColumn(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationConfig && (
        <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * paginationConfig.pageSize + 1} to{" "}
              {Math.min(
                currentPage * paginationConfig.pageSize,
                paginationConfig.totalItems
              )}{" "}
              of {paginationConfig.totalItems} entries
            </div>
            
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={paginationConfig.pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span key={index} className="px-3 py-1 text-sm text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNum as number)}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    currentPage === pageNum
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppDatatable;
