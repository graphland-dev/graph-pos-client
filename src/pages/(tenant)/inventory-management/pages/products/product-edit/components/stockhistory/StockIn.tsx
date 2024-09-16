import dateFormat from '@/commons/utils/dateFormat';
import { ProductStock } from '@/commons/graphql-models/graphql';
import { Table } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import React from 'react';

interface IStockProps {
  data: ProductStock[];
  refetch: (v: any) => void;
  totalCount: number;
  removeStock: (v: any) => void;
}

const StockIn: React.FC<IStockProps> = ({ data, removeStock }) => {
  console.log({ removeStock });

  const rows = data.map((item) => (
    <tr key={item._id}>
      <td>{item?.purchaseUID}</td>
      <td>{dateFormat(item?.createdAt)}</td>
      <td>{item?.quantity}</td>
      <td>{item?.note}</td>
      <td>{item?.source}</td>
      <td>
        <IconTrash onClick={() => removeStock(item._id)} />
      </td>
    </tr>
  ));
  return (
    <>
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Purchase ID</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Note</th>
            <th>Source</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};

export default StockIn;
