import DataTable from '@/commons/components/DataTable.tsx';
import PageTitle from '@/commons/components/PageTitle';
import currencyNumberFormat from '@/commons/utils/commaNumber';
import dateFormat from '@/commons/utils/dateFormat';
import {
  InventoryInvoicePayment,
  InventoryInvoicePaymentsWithPagination,
  MatchOperator,
} from '@/commons/graphql-models/graphql';
import { useLazyQuery, useQuery } from '@apollo/client';
import { Drawer, Menu, Text } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconFileInfo } from '@tabler/icons-react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import InventoryInvoicePaymentDetails from './components/InventoryInvoicePaymentDetails';
import { INVENTORY_INVOICE_PAYMENTS_QUERY } from './utils/query.invoice-payments';

interface IState {
  refetching: boolean;
  openDrawer: boolean;
}

const InvoicePaymentsPage = () => {
  const [invoicePaymentsDetails, setInvoicePaymentsDetails] =
    useState<InventoryInvoicePayment>();
  const [state, setState] = useSetState<IState>({
    refetching: false,
    openDrawer: false,
  });

  const { data, loading, refetch } = useQuery<{
    accounting__inventoryInvoicePayments: InventoryInvoicePaymentsWithPagination;
  }>(INVENTORY_INVOICE_PAYMENTS_QUERY, {
    variables: {
      where: {
        limit: -1,
        page: 1,
      },
    },
  });

  const [searchParams] = useSearchParams();
  const invoicePaymentId = searchParams.get('invoicePaymentId');

  const [invoicePayment] = useLazyQuery<{
    accounting__inventoryInvoicePayments: InventoryInvoicePaymentsWithPagination;
  }>(INVENTORY_INVOICE_PAYMENTS_QUERY, {
    fetchPolicy: 'network-only',
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'inventoryInvoicePaymentUID',
        header: 'Invoice Payment UID',
      },

      {
        accessorKey: 'client.name',
        header: 'Client',
      },
      {
        accessorKey: 'date',
        accessorFn: (row: InventoryInvoicePayment) =>
          row?.date ? dateFormat(row?.date) : '',
        header: 'Date',
      },
      {
        accessorKey: 'netAmount',
        accessorFn: (originalRow: InventoryInvoicePayment) =>
          `${currencyNumberFormat(originalRow?.netAmount || 0)} BDT`,
        header: 'Net Total',
      },
    ],
    [],
  );

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  useEffect(() => {
    if (invoicePaymentId) {
      // alert(invoiceId);
      invoicePayment({
        variables: {
          where: {
            filters: [
              {
                key: '_id',
                operator: MatchOperator.Eq,
                value: invoicePaymentId,
              },
            ],
          },
        },
        onError: (err) => console.log(err),
      }).then((res) => {
        setInvoicePaymentsDetails(
          res.data?.accounting__inventoryInvoicePayments?.nodes?.[0],
        );
        setState({
          openDrawer: true,
        });
      });
    }
  }, [searchParams]);

  return (
    <>
      <PageTitle title="purchase-list" />
      <Drawer
        onClose={() =>
          setState({
            openDrawer: false,
          })
        }
        title={
          <Text className="text-2xl font-semibold">
            Inventory Invoice Payments Details
          </Text>
        }
        opened={state.openDrawer}
        size={'95%'}
      >
        <InventoryInvoicePaymentDetails id={`${invoicePaymentsDetails?._id}`} />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.accounting__inventoryInvoicePayments.nodes ?? []}
        refetch={handleRefetch}
        totalCount={
          data?.accounting__inventoryInvoicePayments.meta?.totalCount ?? 100
        }
        RowActionMenu={(row: InventoryInvoicePayment) => (
          <>
            <Menu.Item
              icon={<IconFileInfo size={18} />}
              onClick={() => {
                setInvoicePaymentsDetails(row);
                setState({
                  openDrawer: true,
                });
              }}
            >
              View
            </Menu.Item>
          </>
        )}
        loading={loading || state.refetching}
      />
    </>
  );
};

export default InvoicePaymentsPage;
