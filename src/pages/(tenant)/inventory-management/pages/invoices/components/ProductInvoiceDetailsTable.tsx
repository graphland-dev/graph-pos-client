import dateFormat from '@/_app/utils/dateFormat';
import { ACCOUNT_INVENTORY_INVOICE_PAYMENTS_QUERY } from '../utils/query.invoices';
import { InventoryInvoicePaymentsWithPagination } from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { Anchor, Paper, Skeleton, Table, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

interface IProps {
  id: string;
}

const ProductInvoiceDetailsTable: React.FC<IProps> = ({ id }) => {
  const { data, loading } = useQuery<{
    accounting__inventoryInvoicePayments: InventoryInvoicePaymentsWithPagination;
  }>(ACCOUNT_INVENTORY_INVOICE_PAYMENTS_QUERY, {
    variables: {
      where: {
        filters: [
          {
            key: 'inventoryInvoicePaymentUID',
            operator: 'eq',
            value: id,
          },
        ],
      },
    },
  });

  const paymentsThs = (
    <tr>
      <th>Payments UID</th>
      <th>Date</th>
      <th>Pay By</th>
      <th>Amount</th>
    </tr>
  );

  const trSkeleton = Array.from({ length: 10 })
    .fill(null)
    .map(() => (
      <tr>
        <td>
          <Skeleton h={35} />
        </td>
        <td>
          <Skeleton h={35} />
        </td>
        <td>
          <Skeleton h={35} />
        </td>
        <td>
          <Skeleton h={35} />
        </td>
      </tr>
    ));

  const rows = data?.accounting__inventoryInvoicePayments?.nodes?.map(
    (element) => (
      <tr key={element.inventoryInvoicePaymentUID}>
        <td>
          <Anchor
            component={Link}
            to={`/${element.tenant}/inventory-management/products/${element.inventoryInvoicePaymentUID}`}
          >
            {element.inventoryInvoicePaymentUID}
          </Anchor>
          {}
        </td>
        <td>{element?.date ? dateFormat(element.date) : ''}</td>
        <td>{element.paymentTerm} </td>
        <td>{element.netAmount} </td>
      </tr>
    ),
  );

  return (
    <div>
      <Paper mb={'lg'} p={'sm'}>
        <Title order={4}>Payments</Title>
        <Table mt={'sm'} withColumnBorders withBorder captionSide="bottom">
          <thead className="bg-card-header">{paymentsThs}</thead>
          <tbody>{loading ? trSkeleton : rows}</tbody>
        </Table>
      </Paper>
    </div>
  );
};

export default ProductInvoiceDetailsTable;
