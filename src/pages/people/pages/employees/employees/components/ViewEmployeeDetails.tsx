import ViewDashboardLayout from "@/_app/common/layouts/ViewDashboard";
import { Employee, EmployeeDepartment } from "@/_app/graphql-models/graphql";
import { NavLink, Paper, Text, Title } from "@mantine/core";
import {
  IconChartArrowsVertical,
  IconCurrencyTaka,
  IconUserBolt,
} from "@tabler/icons-react";
import { useState } from "react";
import EmployeeDetailsBasicInfo from "./employee-details/EmployeeDetailsBasicInfo";
import EmployeeDetailsIncrements from "./employee-details/EmployeeDetailsIncrements";
import EmployeeDetailsPayrolls from "./employee-details/EmployeeDetailsPayrolls";

interface IEmployeesDetailsFormProps {
  employeeDetails: Employee | null;
  departments: EmployeeDepartment[] | null;
  refetch: (v: any) => void;
}

const ViewEmployeeDetails: React.FC<IEmployeesDetailsFormProps> = ({
  employeeDetails,
  departments,
  refetch,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <ViewDashboardLayout
      TopSection={
        <Paper shadow="sm" p={"sm"} withBorder>
          <Title order={3}>{employeeDetails?.name}</Title>
          <Text fz={"sm"}>{employeeDetails?.designation}</Text>
          <Text fz={"sm"}>{employeeDetails?.department?.name}</Text>
          <Text fz={"sm"}>Salary: {employeeDetails?.salary || 0} BDT</Text>
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
            label={"Payrolls"}
            icon={<IconCurrencyTaka size={16} />}
            onClick={() => setActiveTab(1)}
            active={activeTab === 1}
          />
          <NavLink
            label={"Increments"}
            icon={<IconChartArrowsVertical size={16} />}
            onClick={() => setActiveTab(2)}
            active={activeTab === 2}
          />
        </>
      }
    >
      {activeTab === 0 && (
        <EmployeeDetailsBasicInfo
          employeeDetails={employeeDetails}
          departments={departments || []}
          refetch={refetch}
        />
      )}
      {activeTab === 1 && (
        <EmployeeDetailsPayrolls employeeDetails={employeeDetails} />
      )}
      {activeTab === 2 && (
        <EmployeeDetailsIncrements id={employeeDetails?._id} />
      )}
    </ViewDashboardLayout>
  );
};

export default ViewEmployeeDetails;
