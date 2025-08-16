import { Product } from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { Badge, Button, Card, Group, Text, TextInput } from "@mantine/core";
import {
  IconBarcode,
  IconTag,
  IconPackage,
  IconSearch,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";

interface ProductsCardListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onSearch: (query: string) => void;
  loading?: boolean;
  totalCount?: number;
}

const ProductsCardList = ({
  products,
  onProductSelect,
  onSearch,
  loading = false,
  totalCount = 0,
}: ProductsCardListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const getStock = (product: Product) => {
    return (product.stockInQuantity || 0) - (product.stockOutQuantity || 0);
  };

  const getStockColor = (stock: number) => {
    if (stock <= 0) return "red";
    if (stock <= 10) return "orange";
    return "green";
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <TextInput
        placeholder="Search products by name or code..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        icon={<IconSearch size={16} />}
        size="md"
      />

      {/* Results Count */}
      {searchQuery && (
        <Text size="sm" color="dimmed">
          {totalCount} product{totalCount !== 1 ? "s" : ""} found
        </Text>
      )}

      {/* Products List */}
      {loading ? (
        <Text color="dimmed" align="center" py="xl">
          Searching products...
        </Text>
      ) : products.length === 0 ? (
        <Text color="dimmed" align="center" py="xl">
          {searchQuery
            ? "No products match your search."
            : "No products found."}
        </Text>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const stock = getStock(product);

            return (
              <Card
                key={product._id}
                withBorder
                p="md"
                className="transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Group position="apart" mb="xs">
                      <Text weight={600} size="md">
                        {product.name}
                      </Text>
                      <Badge color={getStockColor(stock)} size="sm">
                        Stock: {stock}
                      </Badge>
                    </Group>

                    <div className="mb-3 space-y-1">
                      {product.code && (
                        <Group spacing="xs">
                          <IconBarcode size={14} color="gray" />
                          <Text size="sm" color="dimmed">
                            {product.code}
                          </Text>
                        </Group>
                      )}

                      {product.category?.name && (
                        <Group spacing="xs">
                          <IconTag size={14} color="gray" />
                          <Text size="sm" color="dimmed">
                            {product.category.name}
                          </Text>
                        </Group>
                      )}

                      {product.brand?.name && (
                        <Group spacing="xs">
                          <IconPackage size={14} color="gray" />
                          <Text size="sm" color="dimmed">
                            {product.brand.name}
                          </Text>
                        </Group>
                      )}
                    </div>

                    <Group spacing="lg">
                      <div>
                        <Text size="xs" color="dimmed">
                          Purchase Price
                        </Text>
                        <Text weight={500} size="sm">
                          {currencyNumberWithSymbolFormat(
                            product.purchasePrice || 0
                          )}{" "}
                          BDT
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" color="dimmed">
                          Sell Price
                        </Text>
                        <Text weight={600} size="sm" color="blue">
                          {currencyNumberWithSymbolFormat(product.price || 0)}{" "}
                          BDT
                        </Text>
                      </div>
                    </Group>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onProductSelect(product)}
                    disabled={stock <= 0 && !product.isSellableWithoutStock}
                  >
                    {stock <= 0 && !product.isSellableWithoutStock
                      ? "Out of Stock"
                      : "Add"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsCardList;