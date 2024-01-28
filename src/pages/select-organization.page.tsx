import { TenantsWithPagination } from "@/_app/graphql-models/graphql";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const MY_TENANTS = gql`
  query Identity__myTenants {
    identity__myTenants {
      nodes {
        _id
        name
        uid
        createdAt
      }
    }
  }
`;

const SelectOrganization = () => {
  const { data } = useQuery<{ identity__myTenants: TenantsWithPagination }>(
    MY_TENANTS
  );

  return (
    <div className="flex flex-col bg-neutral-primary">
      {data?.identity__myTenants.nodes?.map((tenant) => (
        <Link to={`/${tenant.uid}`}>{tenant.name}</Link>
      ))}
    </div>
  );
};

export default SelectOrganization;
