import dateFormat from '@/commons/utils/dateFormat';
import { ProductPurchase } from '@/commons/graphql-models/graphql';
import { Flex, Paper, Space, Text, Title } from '@mantine/core';
import React from 'react';

const PurchaseDetails: React.FC<{
  details: ProductPurchase;
}> = ({ details }) => {
  return (
    <div>
      <div className="gap-5 lg:flex">
        <div className="grid grid-cols-2 gap-5 lg:w-7/12">
          <Paper shadow="md" p={10} withBorder>
            <div className="flex items-center justify-between">
              <div className="!text-left">
                <Text size={'sm'} fw={500}>
                  Purchase Date:
                </Text>
                <Text size={'sm'} fw={500}>
                  Order Date:
                </Text>
                <Text size={'sm'} fw={500}>
                  Purchase UID:
                </Text>
              </div>

              <div className="!text-right">
                <Text size={'sm'} fw={500}>
                  {dateFormat(details?.purchaseDate)}
                </Text>
                <Text size={'sm'} fw={500}>
                  {dateFormat(details?.purchaseOrderDate)}
                </Text>
                <Text size={'sm'} fw={500}>
                  {details?.purchaseUID}
                </Text>
              </div>
            </div>
          </Paper>

          <Paper shadow="md" p={10} withBorder>
            <div className="flex items-center justify-between">
              <div className="!text-left">
                <Text size={'sm'} fw={500}>
                  Net Bill:
                </Text>
                <Text size={'sm'} fw={500}>
                  Paid Amount:
                </Text>
                <Text size={'sm'} fw={500}>
                  Due Amount:
                </Text>
              </div>

              <div className="!text-right">
                <Text size={'sm'} fw={500}>
                  {details?.netTotal?.toFixed(2) ?? 0.0}
                  {' BDT'}
                </Text>
                <Text size={'sm'} fw={500}>
                  {details?.paidAmount?.toFixed(2) ?? 0.0}
                  {' BDT'}
                </Text>
                <Text size={'sm'} fw={500}>
                  {(details?.netTotal - details.paidAmount!).toFixed(2) ?? 0.0}
                  {' BDT'}
                </Text>
              </div>
            </div>
          </Paper>
        </div>
        <Paper className="lg:5/12" shadow="md" withBorder>
          <div className="p-2 bg-light-gray">
            <Title order={5}>Supplier Details</Title>
          </div>

          <div className="grid grid-cols-2 p-3">
            <div className="!text-left">
              <Text fw={500}>Name: </Text>
              <Text fw={500}>Contact number: </Text>
              <Text fw={500}>Company name: </Text>
              <Text fw={500}>Updated date:</Text>
              <Text fw={500}>Email: </Text>
              <Text fw={500}>Address: </Text>
            </div>

            <div className="!text-right">
              <Text fw={500}>{details?.supplier?.name}</Text>
              <Text fw={500}>{details?.supplier?.contactNumber}</Text>
              <Text fw={500}>{details?.supplier?.companyName}</Text>
              <Text fw={500}>{dateFormat(details?.supplier?.updatedAt)}</Text>
              <Text fw={500}>{details?.supplier?.email}</Text>
              <Text fw={500}>{details?.supplier?.address}</Text>
            </div>
          </div>
        </Paper>
      </div>

      <Space h={'xl'} />

      <div className="grid grid-cols-2 gap-5">
        <Paper shadow="md" withBorder>
          <div className="p-2 bg-light-gray">
            <Title order={5}>Supplier Details</Title>
          </div>

          <Space h={'xs'} />

          <div className="px-2">
            {details?.products?.map((item, idx) => (
              <Paper key={idx} py={10} px={15} radius={5} withBorder my={5}>
                <Flex justify={'space-between'} align={'center'}>
                  <Flex gap={8} align={'center'}>
                    <Text fw={500}>{item?.name}</Text> -
                    <Text fw={500}>{item?.quantity}</Text>
                  </Flex>
                  <Text fw={500}>{item?.netAmount} BDT</Text>
                </Flex>
              </Paper>
            ))}
          </div>
        </Paper>
        <Paper shadow="md" withBorder>
          <div className="p-2 bg-light-gray">
            <Title order={5}>Payment History</Title>
          </div>

          <Space h={'xs'} />

          <div className="px-2">
            {details?.paymentHistory?.map((item, idx) => (
              <Paper key={idx} py={10} px={15} radius={5} withBorder my={5}>
                <Flex justify={'space-between'} align={'center'}>
                  <Flex gap={8} align={'center'}>
                    <Text fw={500}>{item?.paymentUID}</Text> -
                    <Text fw={500}>{dateFormat(item?.date)}</Text>
                  </Flex>
                  <Text fw={500}>{item?.amount ?? 0} BDT</Text>
                </Flex>
              </Paper>
            ))}
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default PurchaseDetails;
