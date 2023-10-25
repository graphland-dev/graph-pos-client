
import { INCREMENTS_QUERY } from '../../../increments/utils/increment.query';
import { EmployeeIncrementsWithPagination } from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import { Button, Divider, Paper, Text, Title } from '@mantine/core';
import { IconChartArrowsVertical } from '@tabler/icons-react';
import dayjs from 'dayjs';

interface IIncrementsDetailsProps {
  id: string | undefined;
}


const Increments: React.FC<IIncrementsDetailsProps> = ({id}) => {

    const { data: increments } = useQuery<{
      people__employeeIncrements: EmployeeIncrementsWithPagination;
    }>(INCREMENTS_QUERY, {
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
    
    const incrementsData = increments?.people__employeeIncrements.nodes ?? []
    return (
      <div>
        <Paper shadow="md" p={"lg"}>
          <div className="flex  items-center gap-4 justify-between">
            <div className="flex  items-center gap-4">
              <IconChartArrowsVertical size={24} />
              <Title order={3}>Increment Information</Title>
            </div>
            <Button>Add Info</Button>
          </div>
          <Divider my="sm" />
          <div className="flex flex-col gap-3 w-8/12">
            {incrementsData.map((increment) => (
              <>
                <div className="flex justify-between ">
                  <Title color="gray" order={4}>
                    Name:
                  </Title>
                  <Text>{increment?.employee?.name}</Text>
                </div>

                <div className="flex justify-between ">
                  <Title color="gray" order={4}>
                    Note:
                  </Title>
                  <Text>{increment.note}</Text>
                </div>
                <div className="flex justify-between">
                  <Title color="gray" order={4}>
                    Increment Date:
                  </Title>
                  <Text>
                    {dayjs(increment.date).format("MMMM D, YYYY h:mm A")}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Title color="gray" order={4}>
                    Create date:
                  </Title>
                  <Text>
                    {dayjs(increment.createdAt).format("MMMM D, YYYY h:mm A")}
                  </Text>
                </div>
              </>
            ))}
          </div>
        </Paper>
        
        <pre>{JSON.stringify(incrementsData, null, 2)}</pre>
      </div>
    );
}

export default Increments