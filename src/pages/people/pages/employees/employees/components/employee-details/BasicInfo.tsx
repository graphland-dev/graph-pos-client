import { Employee } from "@/_app/graphql-models/graphql";
import { Button, Divider, Paper, Text, Title } from "@mantine/core";
import { IconBrandBadoo, IconNote } from "@tabler/icons-react";

interface IEmployeesDetailsProps {
  employeeDetails: Employee | null;
  refetch: (v: any) => void;
}

const BasicInfo: React.FC<IEmployeesDetailsProps> = ({
  employeeDetails,
}) => {
  return (
    <>
      <Paper shadow="md" p={"lg"}>
        <div className="flex  items-center gap-4 justify-between">
          <div className="flex  items-center gap-4">
            <IconNote size={24} />
            <Title order={3}>Personal Information</Title>
          </div>
          <Button>Add Info</Button>
        </div>
        <Divider my="sm" />
        <div className="flex flex-col gap-3 w-5/12">
          <div className="flex justify-between ">
            <Title color="gray" order={4}>
              Name:
            </Title>
            <Text>{employeeDetails?.name}</Text>
          </div>
          <div className="flex justify-between ">
            <Title color="gray" order={4}>
              Designation:
            </Title>
            <Text>{employeeDetails?.designation}</Text>
          </div>
          <div className="flex justify-between ">
            <Title color="gray" order={4}>
              Department name:
            </Title>
            <Text>{employeeDetails?.department?.name}</Text>
          </div>
          <div className="flex justify-between">
            <Title color="gray" order={4}>
              Salary:
            </Title>
            <Text>{employeeDetails?.salary}</Text>
          </div>
          <div className="flex justify-between">
            <Title color="gray" order={4}>
              Address:
            </Title>
            <Text>{employeeDetails?.address}</Text>
          </div>
          
        </div>
      </Paper>
      <Paper shadow="md" p={"lg"}>
        <div className="flex  items-center gap-4 justify-between">
          <div className="flex  items-center gap-4">
            <IconBrandBadoo size={24} />
            <Title order={3}>Hobbies and Interest</Title>
          </div>
         
        </div>
        <Divider my="sm" />
        <div className="flex flex-col gap-3 w-5/12">
          <div className="flex justify-between ">
            <Title color="gray" order={4}>
              Name:
            </Title>
            <Text>{employeeDetails?.name}</Text>
          </div>
          <div className="flex justify-between ">
            <Title color="gray" order={4}>
              Designation:
            </Title>
            <Text>{employeeDetails?.designation}</Text>
          </div>
          <div className="flex justify-between ">
            <Title color="gray" order={4}>
              Department name:
            </Title>
            <Text>{employeeDetails?.department?.name}</Text>
          </div>
          <div className="flex justify-between">
            <Title color="gray" order={4}>
              Salary:
            </Title>
            <Text>{employeeDetails?.salary}</Text>
          </div>
          <div className="flex justify-between">
            <Title color="gray" order={4}>
              Address:
            </Title>
            <Text>{employeeDetails?.address}</Text>
          </div>
          {/* <Text>Name:{employeeDetails?.name}</Text>
          <Text>Name:{employeeDetails?.name}</Text>
          <Text>Name:{employeeDetails?.name}</Text> */}
        </div>
      </Paper>
      {/* <pre>{JSON.stringify(employeeDetails, null, 2)}</pre> */}
    </>
  );
};

export default BasicInfo;
