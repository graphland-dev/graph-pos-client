import DataTable from "@/_app/common/data-table/DataTable";
import { AccountsWithPagination } from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Button, Drawer } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import React, { useMemo } from "react";
import AccountForm from "./components/AccountForm";
import { ACCOUNTING_ACCOUNTS_LIST } from "./utils/query";

const AccountsPage = () => {
  const [open, setOpen] = React.useState(false);
  const [refetching, setRefetching] = React.useState(false);

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

  const handleRefetch = (variables: any) => {
    setRefetching(true);
    refetch(variables).finally(() => {
      setRefetching(false);
    });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Account Name",
      },
      {
        accessorKey: "note",
        header: "Note",
      },
      {
        accessorFn: (row) => dayjs(row.createdAt).format("MMMM D, YYYY h:mm A"),
        accessorKey: "createdAt",
        header: "CreatedAt",
      },
      {
        accessorKey: "referenceNumber",
        header: "Reference Number",
      },
      {
        accessorKey: "brunchName",
        header: "Brunch Name",
      },
    ],
    []
  );

  return (
    <>
      <Drawer opened={open} onClose={() => setOpen(false)} position="right">
        <AccountForm
          onSubmissionDone={() => {
            refetch();
            setOpen(false);
          }}
        />
      </Drawer>
      <DataTable
        columns={columns}
        data={data?.accounting__accounts.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.accounting__accounts.meta?.totalCount ?? 10}
        ActionArea={
          <>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={() => setOpen(true)}
              size="sm"
            >
              Add new
            </Button>
          </>
        }
        loading={loading || refetching}
        onPaginationChange={(p) => {
          console.log(p.pageIndex);
          console.log(p.pageSize);
        }}
      />
    </>
  );
};

export default AccountsPage;
