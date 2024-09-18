import { getStock } from '@/pages/(tenant)/inventory-management/pages/pos/utils/utils.calc.ts';
import { showNotification } from '@mantine/notifications';
import { Badge, Paper, Space, Text } from '@mantine/core';
import { getFileUrl } from '@/commons/utils/getFileUrl.ts';
import {
  Product,
  ServerFileReference,
} from '@/commons/graphql-models/graphql.ts';
import React from 'react';

interface IProp {
  product: Product;
  onClick?: (product: Product) => void;
}

const PosItemCard: React.FC<IProp> = ({ product, onClick }) => {
  return (
    <Paper
      key={product._id}
      pos={'relative'}
      onClick={() => {
        if (getStock(product)) {
          onClick?.(product);
        } else {
          showNotification({
            message: 'Out of stock',
            color: 'red',
          });
        }
      }}
      className="overflow-hidden border cursor-pointer border-neutral-muted hover:border-blue-500"
    >
      {!getStock(product) && (
        <div className="absolute inset-0 bg-slate-500/10 backdrop-blur-sm"></div>
      )}

      <Badge
        pos={'absolute'}
        top={0}
        left={0}
        radius={0}
        size="lg"
        variant="filled"
      >
        {product.price} BDT
      </Badge>
      <img
        src={getFileUrl(product?.thumbnail as ServerFileReference) ?? ''}
        alt="product image"
        className="object-cover p-2 rounded-md"
      />

      <Space h={5} />

      <div className="p-2">
        <Text size="xs" fw={500}>
          CODE: {product?.code}
        </Text>
        <Text fz={'md'} fw={500}>
          {product?.name}
        </Text>
        <Text fz={'md'} fw={500}>
          Stock: {getStock(product)}
        </Text>
      </div>
    </Paper>
  );
};

export default PosItemCard;
