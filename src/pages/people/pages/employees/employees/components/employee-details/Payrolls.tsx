
import { PayrollsWithPagination } from "@/_app/graphql-models/graphql";
import { PAYROLL_QUERY } from "@/pages/accounting/pages/cashbook/payroll/utils/payroll.query";
import { useQuery } from "@apollo/client";
import { Button, Divider, Paper, Text, Title } from "@mantine/core";
import { IconCurrencyTaka } from "@tabler/icons-react";

interface IPayrollDetailsProps {
  id: string | undefined;
}


const Payrolls: React.FC<IPayrollDetailsProps>= ({id}) => {
 

  const { data: payRolls } = useQuery<{
    accounting__payrolls: PayrollsWithPagination;
  }>(PAYROLL_QUERY, {
    variables: {
      where: {
        filters: [
          {
            key: "employee",
            operator: "eq",
            value: id,
          },
        ],
      },
    },
  });
  // console.log(payRolls);
  const payRollsData = payRolls?.accounting__payrolls?.nodes ?? [];
  return (
    <div>
      <Paper shadow="md" p={"lg"}>
        <div className="flex  items-center gap-4 justify-between">
          <div className="flex  items-center gap-4">
            <IconCurrencyTaka size={24} />
            <Title order={3}>Payroll Information</Title>
          </div>
          <Button>Add Info</Button>
        </div>
        <Divider my="sm" />
        <div className="flex flex-col gap-3 w-5/12">
          {payRollsData?.map((payRoll) => (
            <>
              <div className="flex justify-between ">
                <Title color="gray" order={4}>
                  Name:
                </Title>
                <Text>{payRoll?.employee.name}</Text>
              </div>

              <div className="flex justify-between ">
                <Title color="gray" order={4}>
                  Department name:
                </Title>
                <Text>{payRoll?.account?.name}</Text>
              </div>
              <div className="flex justify-between">
                <Title color="gray" order={4}>
                  Salary:
                </Title>
                <Text>{payRoll?.salaryMonth}</Text>
              </div>
              <div className="flex justify-between">
                <Title color="gray" order={4}>
                  Address:
                </Title>
                <Text>{payRoll?.employee?.salary}</Text>
              </div>
            </>
          ))}
        </div>
      </Paper>
      
      <pre>{JSON.stringify(payRolls, null, 2)}</pre>
    </div>
  );
};

export default Payrolls;
