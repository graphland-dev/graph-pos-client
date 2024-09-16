import EmptyState from '@/commons/components/EmptyState.tsx';
import { commonNotifierCallback } from '@/commons/components/Notification/commonNotifierCallback.ts';
import { MatchOperator, ProductInvoice } from '@/commons/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { Button, Drawer, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { openConfirmModal } from '@mantine/modals';
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Remove_Invoice } from '../../utils/query.payment';

const HoldList: React.FC<{
  onSelectInvoice: (state: ProductInvoice) => void;
  holdList: ProductInvoice[];
  onRefetchHoldList: () => void;
}> = ({ onSelectInvoice, holdList, onRefetchHoldList }) => {
  const [opened, handler] = useDisclosure();

  return (
    <div>
      <Button
        variant="subtle"
        size="xs"
        onClick={handler.open}
        color="red"
        className="cursor-pointer"
      >
        Hold List ({holdList?.length ?? 0})
      </Button>
      <Drawer
        opened={opened}
        onClose={handler.close}
        title="Hold list"
        position="right"
        size={'lg'}
      >
        <Table withBorder>
          <thead>
            <tr>
              <th>Client</th>
              <th>Reference</th>
              <th>Net Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {holdList?.map((invoice: ProductInvoice, idx: number) => (
              <TableRow
                key={idx}
                invoice={invoice}
                onSelectInvoice={onSelectInvoice}
                onRefetchHoldList={onRefetchHoldList}
              />
            ))}
          </tbody>
        </Table>
        {!holdList?.length ? (
          <EmptyState label={'Hold list is empty!'} />
        ) : null}
      </Drawer>
    </div>
  );
};

export default HoldList;

const TableRow: React.FC<{
  invoice: ProductInvoice;
  onSelectInvoice: (state: ProductInvoice) => void;
  onRefetchHoldList: () => void;
}> = ({ invoice, onSelectInvoice, onRefetchHoldList }) => {
  const params = useParams<{ tenant: string }>();

  const [removeInvoice, { loading }] = useMutation(
    Remove_Invoice,
    commonNotifierCallback({
      successTitle: 'Invoice removed',
      onSuccess() {
        onRefetchHoldList();
      },
    }),
  );
  return (
    <tr>
      <td>
        <NavLink
          to={`/${params?.tenant}/people/client?clientId=${invoice?.client?._id}`}
          className="text-blue-400 underline"
        >
          {invoice?.client?.name}
        </NavLink>
      </td>
      <td>{invoice?.reference}</td>
      <td className="font-bold">{invoice?.netTotal ?? 0} BDT</td>
      <td>
        {' '}
        <Button onClick={() => onSelectInvoice(invoice!)} size={'xs'}>
          Proceed
        </Button>
        &nbsp; &nbsp;
        <Button
          color="red"
          size={'xs'}
          loading={loading}
          onClick={() =>
            openConfirmModal({
              title: 'Proceed to confirm action',
              children: <Text>Are you sure to remove invoice ?</Text>,
              labels: {
                cancel: 'No',
                confirm: 'Yes',
              },
              onCancel: () => {},
              onConfirm: () =>
                removeInvoice({
                  variables: {
                    where: {
                      key: '_id',
                      operator: MatchOperator.Eq,
                      value: invoice?._id,
                    },
                  },
                }),
            })
          }
        >
          Remove
        </Button>
      </td>
    </tr>
  );
};
