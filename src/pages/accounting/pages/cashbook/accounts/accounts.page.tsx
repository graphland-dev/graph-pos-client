import DataTable from "@/_app/common/data-table/DataTable";
import { AccountsWithPagination } from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { AccountListQuery } from "./utils/query";
import { Button } from "@mantine/core";

const AccountsPage = () => {
  const { data, loading } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(AccountListQuery);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Account Name",
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
      <DataTable
        columns={columns}
        data={data?.accounting__accounts.nodes ?? []}
        ActionArea={
          <>
            <Button size="sm">Add new</Button>
          </>
        }
        loading={loading}
      />
    </>
  );
};

export default AccountsPage;
