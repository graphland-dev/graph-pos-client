import DataTable from "@/_app/common/data-table/DataTable";
import { AccountsWithPagination } from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { MRT_ColumnDef } from "mantine-react-table";
import React, { useMemo } from "react";
import { AccountListQuery } from "./utils/query";
import { Button, Drawer } from "@mantine/core";
import AccountForm from "./components/AccountForm";
import { IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";

const AccountsPage = () => {
  const [open, setOpen] = React.useState(false);
  const { data, loading, refetch } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(AccountListQuery);

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
        accessorKey: "CreatedAt",
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
      {/* <pre>{JSON.stringify(pagination)}</pre> */}

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
        loading={loading}
      />
    </>
  );
};

export default AccountsPage;
