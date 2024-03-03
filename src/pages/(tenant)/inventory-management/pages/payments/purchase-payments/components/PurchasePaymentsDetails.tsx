import Attachments from "@/_app/common/components/Attachments";
import { PurchasePayment } from "@/_app/graphql-models/graphql";
import { Paper, Space, Text } from "@mantine/core";
import React from "react";
import { FOLDER__NAME } from "@/_app/models/FolderName";

const PurchasePaymentsDetails: React.FC<{
  purchasePaymentsRow: PurchasePayment;
}> = ({ purchasePaymentsRow }) => {
  return (
    <div>
      <Paper p={10} radius={10} shadow="sm" withBorder>
        <Text>
          Account name: {purchasePaymentsRow?.account?.name} [
          {purchasePaymentsRow?.account?.referenceNumber}]
        </Text>
        <Text>Supplier: {purchasePaymentsRow?.supplier.name}</Text>
        <Text>Paid Amount: {purchasePaymentsRow?.paidAmount}</Text>
      </Paper>

      {/* <Table>
        <thead>
          <tr>
            <th>Opportunity name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {purchasePaymentsRow?.opportunities?.map((opp, idx) => (
            <tr key={idx}>
              <td>{opp?.name}</td>
              <td>{opp?.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table> */}

      <Space h={"sm"} />

      {/* <AttachmentUploadArea
        details={purchasePaymentsRow}
        folder="Graphland__Payroll__Attachments"
        updateAttachmentsMutation={() => {}}
        updating={false}
        isGridStyle={true}
      /> */}

      <Attachments
        attachments={purchasePaymentsRow.attachments ?? []}
        onUploadDone={() => {}}
        enableUploader={false}
        folder={FOLDER__NAME.PURCHASE_PAYMENTS_ATTACHMENTS}
      />
    </div>
  );
};

export default PurchasePaymentsDetails;
