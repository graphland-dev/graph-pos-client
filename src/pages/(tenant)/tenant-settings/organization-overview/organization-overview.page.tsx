import { userTenantsAtom } from "@/_app/states/user.atom";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";

const OrganizationOverviewPage = () => {
  const params = useParams<{ tenant: string }>();
  const [tenants] = useAtom(userTenantsAtom);
  const tenant = tenants?.find((t) => t.uid === params.tenant);

  return (
    <div>
      <pre>{JSON.stringify(tenant, null, 2)}</pre>
    </div>
  );
};

export default OrganizationOverviewPage;
