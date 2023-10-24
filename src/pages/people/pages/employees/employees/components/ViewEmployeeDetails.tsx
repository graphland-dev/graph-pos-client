import { Employee } from "@/_app/graphql-models/graphql";
import { AppShell, Navbar, Text, Title, useMantineTheme } from "@mantine/core";


interface IEmployeesDetailsFormProps {
  viewDetails: Employee | null;
  refetch: (v: any) => void;
}

const ViewEmployeeDetails: React.FC<IEmployeesDetailsFormProps> = ({
  viewDetails,
}) => {
  console.log(viewDetails);
  const theme = useMantineTheme();
 

  return (
    <>
      <Title>Details</Title>
      <div>
        <AppShell
          styles={{
            main: {
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          }}
          navbarOffsetBreakpoint="sm"
          asideOffsetBreakpoint="sm"
          navbar={
            <Navbar
              p="md"
              hiddenBreakpoint="sm"
             
              width={{ sm: 200, lg: 300 }}
            >
            <Text>{ viewDetails?.address}</Text>
            </Navbar>
          }
        >
          <Text>Resize app to see responsive navbar in action</Text>
        </AppShell>
      </div>
    </>
  );
};

export default ViewEmployeeDetails