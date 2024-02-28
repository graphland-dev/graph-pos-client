import Attachments from "@/_app/common/components/Attachments";
import { Expense } from "@/_app/graphql-models/graphql";
import { FOLDER__NAME } from "@/_app/models/FolderName";
import { Paper, Space, Table, Text, Title } from "@mantine/core";

interface IExpenseDetailsProps {
  expenseDetails: Expense | null;
  refetch: () => void;
}

const ViewExpenseDetails: React.FC<IExpenseDetailsProps> = ({
  expenseDetails,
}) => {
  return (
    <div>
      {/* <pre>{JSON.stringify(expenseDetails, null, 2)}</pre> */}
      <Paper mt={10} p={10} radius={10} shadow="sm" withBorder>
        <Text>Expense bank name: {expenseDetails?.account?.name}</Text>
        <Text>Expense note: {expenseDetails?.account?.note}</Text>
        <Text>Expense Amount: {expenseDetails?.amount}</Text>
      </Paper>

      <Space h={"xl"} />

      <Title order={4}>Opportunities of payment</Title>
      <Space h={"sm"} />
      <Table>
        <thead>
          <tr>
            <th>Opportunity name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* {expenseDetails?.account?.map((opp: any, key) => (
            <tr key={key}>
              <td>{opp?.path}</td>
              <td>{opp?.amount}</td>
            </tr>
          ))} */}
        </tbody>
      </Table>

      <Space h={"md"} />

      <Attachments
        attachments={expenseDetails?.attachments ?? []}
        onUploadDone={() => {}}
        enableUploader={false}
        folder={FOLDER__NAME.EXPENSE_ATTACHMENTS}
      />
    </div>
  );
};

export default ViewExpenseDetails;
