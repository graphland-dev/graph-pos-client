import ViewDashboardLayout from "@/_app/common/layouts/ViewDashboard";
import { Supplier } from "@/_app/graphql-models/graphql";
import { NavLink, Paper, Text, Title } from "@mantine/core";
import {
  IconPaperclip,
  IconShoppingCart,
  IconTruckReturn,
  IconUserBolt,
} from "@tabler/icons-react";
import { useState } from "react";
import SupplierDetailsBasicInfo from "../SupplierDetailsBasicInfo";
import SupplierDetailsPurchase from "./SupplierDetailsPurchase";
import SupplierDetailsDocuments from "./SupplierDetailsDocuments";

interface ISupplierDetailsFormProps {
  supplierDetails: Supplier | null;
  refetch: () => void;
}

const ViewSupplierDetails: React.FC<ISupplierDetailsFormProps> = ({
  supplierDetails,
  refetch,
}) => {
  // console.log({ supplierDetails });
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <div>
      <ViewDashboardLayout
        TopSection={
          <Paper shadow="sm" p={"sm"} withBorder>
            <Title order={3}>{supplierDetails?.name}</Title>
            <Text>{supplierDetails?.companyName}</Text>
          </Paper>
        }
        NavSection={
          <>
            <NavLink
              label={"Basic Information"}
              icon={<IconUserBolt size={16} />}
              onClick={() => setActiveTab(0)}
              active={activeTab === 0}
            />
            <NavLink
              label={"Purchase"}
              icon={<IconShoppingCart size={16} />}
              onClick={() => setActiveTab(1)}
              active={activeTab === 1}
            />
            <NavLink
              label={"Return"}
              icon={<IconTruckReturn size={16} />}
              onClick={() => setActiveTab(2)}
              active={activeTab === 2}
            />
            <NavLink
              label={"Documents"}
              icon={<IconPaperclip size={16} />}
              onClick={() => setActiveTab(3)}
              active={activeTab === 3}
            />
          </>
        }
      >
        {activeTab === 0 && (
          <SupplierDetailsBasicInfo
            supplierDetails={supplierDetails}
            // refetch={() => refetch()}
          />
        )}
        {activeTab === 1 && (
          <SupplierDetailsPurchase
            supplierDetails={supplierDetails}
            // refetch={refetch}
          />
        )}
        {activeTab === 2 && (
          <SupplierDetailsBasicInfo
            supplierDetails={supplierDetails}
            // refetch={() => refetch()}
          />
        )}
        {activeTab === 3 && (
          <SupplierDetailsDocuments
            supplierDetails={supplierDetails}
            refetch={() => refetch()}
          />
        )}
      </ViewDashboardLayout>
    </div>
  );
};

export default ViewSupplierDetails;
