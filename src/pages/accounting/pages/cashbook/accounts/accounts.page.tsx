import { useQuery } from "@apollo/client";
import { AccountListQuery } from "./utils/query";
import { AccountsWithPagination } from "@/_app/graphql-models/graphql";

const AccountsPage = () => {
  const { data, loading } = useQuery<AccountsWithPagination>(AccountListQuery);

  return (
    <div>
      <pre>{JSON.stringify({ loading, data }, null, 2)}</pre>
    </div>
  );
};

export default AccountsPage;
