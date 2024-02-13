import Attachments from "@/_app/common/components/Attachments";
import { Payroll } from "@/_app/graphql-models/graphql";
import { Paper, Space, Table, Text, Title } from "@mantine/core";

const PayrollDetails: React.FC<{ payRollRow: Payroll }> = ({ payRollRow }) => {
  return (
    <div>
      <Paper p={10} radius={10} shadow="sm" withBorder>
        <Text>Employee name: {payRollRow?.employee?.name}</Text>
        <Text>Salary month: {payRollRow?.salaryMonth}</Text>
        <Text>Base salary: {payRollRow?.employee?.salary}</Text>
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
          {payRollRow?.opportunities?.map((opp, idx) => (
            <tr key={idx}>
              <td>{opp?.name}</td>
              <td>{opp?.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Space h={"md"} />

      {/* <AttachmentUploadArea
        details={payRollRow}
        folder="Graphland__Payroll__Attachments"
        updateAttachmentsMutation={() => {}}
        updating={false}
        isGridStyle={true}
      /> */}

      <Attachments
        attachments={payRollRow.attachments ?? []}
        onUploadDone={() => {}}
        enableUploader={false}
        folder={"Graphland__Payroll__Attachments"}
      />
    </div>
  );
};

export default PayrollDetails;
