import { useQuery } from "@apollo/client";
import { INVENTORY_PRODUCT_INVOICES_QUERY } from "./utils/query.invoices";

const InvoicesPage = () => {
  const { data } = useQuery(INVENTORY_PRODUCT_INVOICES_QUERY);

  console.log(data);

  return <div>InvoicesPage</div>;
};

export default InvoicesPage;
