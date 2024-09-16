import dateFormat from '@/commons/utils/dateFormat';
import { ProductStock } from '@/commons/graphql-models/graphql';
import { Table } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface IStockProps {
  data: ProductStock[];
  refetch: (v: any) => void;
  totalCount: number;
  removeStock: (v: any) => void;
}

const StockOut: React.FC<IStockProps> = ({ data, removeStock }) => {
  const rows = data.map((item) => (
    <tr key={item._id}>
      <td>{item?.invoiceUID}</td>
      <td>{dateFormat(item.createdAt)}</td>
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
            <th>Invoice UID</th>
            <th>Date</th>
            <th>Quality</th>
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

export default StockOut;
