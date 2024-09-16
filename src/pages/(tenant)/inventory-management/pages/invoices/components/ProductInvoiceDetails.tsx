import currencyNumberFormat from '@/commons/utils/commaNumber';
import dateFormat from '@/commons/utils/dateFormat';
import { ProductInvoice } from '@/commons/graphql-models/graphql';
import {
  Anchor,
  Divider,
  Paper,
  Skeleton,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductInvoiceDetailsTable from './ProductInvoiceDetailsTable';

const ProductInvoiceDetails: React.FC<{
  details: ProductInvoice;
  loading: boolean;
}> = ({ details, loading }) => {
  const totalAmount = useMemo(
    () =>
      details?.products.reduce(
        (total, current) => total + (current?.netAmount ?? 0),
        0,
      ),
    [details?.products],
  );

  const ths = (
    <tr>
      <th>Product Name</th>
      <th>Code</th>
      <th>Unit Price</th>
      <th>Tax Rate</th>
      <th>Tax Type</th>
      <th>Tax Amount</th>
      <th>Quantity</th>
      <th>Net Amount</th>
    </tr>
  );

  const tfs = (
    <tr>
      <th className="!text-right" colSpan={7}>
        Total Amount
      </th>
      <th>{currencyNumberFormat(totalAmount!)}</th>
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

  const rows = details.products?.map((element) => (
    <tr key={element.referenceId}>
      <td>
        <Anchor
          component={Link}
          to={`/${details?.client?.tenant}/inventory-management/products/${element.referenceId}`}
        >
          {element.name}
        </Anchor>
        {}
      </td>
      <td>{element.code} </td>
      <td>{element.unitPrice} </td>
      <td>{element.taxRate} </td>
      <td>{element.taxType} </td>
      <td>{element.taxAmount} </td>
      <td>{element.quantity} </td>
      <td>{element.netAmount} </td>
    </tr>
  ));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between w-full gap-4">
        <Paper
          key={details._id}
          p={10}
          radius={5}
          shadow="sm"
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Title order={4}>Basic Info</Title>
          <Divider />
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Invoice UID:</span>{' '}
            {details.invoiceUID}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Date:</span>{' '}
            {dateFormat(details.date)}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Tax Rate:</span>
            {currencyNumberFormat(details?.taxRate)}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-gray-800">Tax Amount:</span>
            {currencyNumberFormat(details?.taxAmount)}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Discount Amount:
            </span>
            {details?.discountAmount}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              {' '}
              Discount Percentage:
            </span>
            {details?.discountPercentage}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Discount Mode:
            </span>
            {details?.discountMode}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Sub Total:
            </span>
            {details?.subTotal}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Cost Amount:
            </span>
            {details?.costAmount}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Net Total:
            </span>
            {details?.netTotal}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Sub Total:
            </span>
            {details?.subTotal}
          </Text>
        </Paper>

        <Paper
          p={10}
          radius={5}
          shadow="sm"
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Title order={4}>Client</Title>
          <Divider />
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary"> Name:</span>

            <Anchor
              component={Link}
              to={`/${details?.client?.tenant}/people/client?clientId=${details?.client?._id}`}
            >
              {details?.client?.name}
            </Anchor>
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary"> Email: </span>

            {details?.client?.email}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Contact Number:{' '}
            </span>
            {details?.client?.contactNumber}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">Address:</span>
            {details?.client?.address}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              create Date:
            </span>
            {dateFormat(details.client?.createdAt)}
          </Text>
        </Paper>
      </div>

      <Paper p={'sm'}>
        <Title order={4}>Items</Title>
        <Table mt={'sm'} withColumnBorders withBorder captionSide="bottom">
          <thead className="bg-card-header">{ths}</thead>
          <tbody>{loading ? trSkeleton : rows}</tbody>
          <tfoot>{tfs}</tfoot>
        </Table>
      </Paper>

      <ProductInvoiceDetailsTable id={details.invoiceUID || ''} />

      {/* <Attachments
        attachments={details.attachments ?? []}
        onUploadDone={() => {}}
        enableUploader={false}
        folder={FOLDER__NAME.PURCHASE_PAYMENTS_ATTACHMENTS}
      /> */}
    </div>
  );
};

export default ProductInvoiceDetails;
