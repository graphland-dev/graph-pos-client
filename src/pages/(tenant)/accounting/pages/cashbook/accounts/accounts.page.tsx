import { confirmModal } from '@/_app/common/confirm/confirm';
import DataTable from '@/_app/common/data-table/DataTable';
import {
  Account,
  AccountsWithPagination,
  MatchOperator,
} from '@/_app/graphql-models/graphql';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Button, Drawer, Menu } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useEffect, useMemo } from 'react';
import AccountForm from './components/AccountForm';
import {
  ACCOUNTING_ACCOUNTS_LIST,
  ACCOUNTING_ACCOUNT_DELETE_MUTATION,
} from './utils/query';
import PageTitle from '@/_app/common/PageTitle';
import currencyNumberFormat from '@/_app/utils/commaNumber';
import { useSearchParams } from 'react-router-dom';

interface IState {
  modalOpened: boolean;
  operationType: 'create' | 'update';
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

const AccountsPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: 'create',
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  const { data, loading, refetch } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTING_ACCOUNTS_LIST, {
    variables: {
      where: {
        limit: 10,
        page: 1,
      },
    },
  });

  const [deleteAccountMutation] = useMutation(
    ACCOUNTING_ACCOUNT_DELETE_MUTATION,
    { onCompleted: () => handleRefetch({}) },
  );
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');

  const [fetchEmployee] = useLazyQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTING_ACCOUNTS_LIST, {
    fetchPolicy: 'network-only',
  });

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteAccount = (_id: string) => {
    confirmModal({
      title: 'Sure to delete account?',
      description: 'Be careful!! Once you deleted, it can not be undone',
      isDangerous: true,
      onConfirm() {
        deleteAccountMutation({
          variables: {
            where: { key: '_id', operator: MatchOperator.Eq, value: _id },
          },
        });
      },
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Account Name',
      },
      {
        accessorKey: 'referenceNumber',
        header: 'Reference',
      },
      {
        accessorFn: (row: Account) =>
          currencyNumberFormat(
            (row?.creditAmount || 0) - (row?.debitAmount || 0),
          ),
        header: 'Balance',
      },
      {
        accessorKey: 'note',
        header: 'Note',
      },
      {
        accessorFn: (row: Account) =>
          dayjs(row?.openedAt).format('MMMM D, YYYY h:mm A'),
        accessorKey: 'openedAt',
        header: 'Date',
      },
      {
        accessorKey: 'brunchName',
        header: 'Brunch Name',
      },
    ],
    [],
  );

  useEffect(() => {
    if (accountId) {
      // alert(invoiceId);
      fetchEmployee({
        variables: {
          where: {
            filters: [
              {
                key: '_id',
                operator: MatchOperator.Eq,
                value: accountId,
              },
            ],
          },
        },
        onError: (err) => console.log(err),
      }).then((res) => {
        setState({
          modalOpened: true,
          operationType: 'update',
          operationId: res.data?.accounting__accounts.nodes?.[0]._id,
          operationPayload: res.data?.accounting__accounts.nodes?.[0],
        });
      });
    }
  }, [searchParams]);

  return (
    <>
      <PageTitle title="accounts" />
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <AccountForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.accounting__accounts.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.accounting__accounts.meta?.totalCount ?? 10}
        RowActionMenu={(row: Account) => (
          <>
            <Menu.Item
              onClick={() =>
                setState({
                  modalOpened: true,
                  operationType: 'update',
                  operationId: row._id,
                  operationPayload: row,
                })
              }
              icon={<IconPencil size={18} />}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={() => handleDeleteAccount(row._id)}
              icon={<IconTrash size={18} />}
            >
              Delete
            </Menu.Item>
          </>
        )}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() =>
                setState({ modalOpened: true, operationType: 'create' })
              }
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        loading={loading || state.refetching}
      />
    </>
  );
};

export default AccountsPage;
