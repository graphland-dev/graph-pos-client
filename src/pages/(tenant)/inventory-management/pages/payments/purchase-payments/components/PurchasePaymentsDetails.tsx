import currencyNumberFormat from "@/_app/common/utils/commaNumber";
import dateFormat from "@/_app/common/utils/dateFormat";
import { PurchasePayment } from "@/_app/graphql-models/graphql";
import { Anchor, Paper, Skeleton, Table, Text, Title } from "@mantine/core";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const PurchasePaymentsDetails: React.FC<{
  purchasePaymentsRow: PurchasePayment;
  loading: boolean;
}> = ({ purchasePaymentsRow, loading }) => {

  const elements = purchasePaymentsRow?.items;
  const totalAmount = useMemo(
    () =>
      purchasePaymentsRow?.items?.reduce(
        (total, current) => total + (current?.purchase.paidAmount ?? 0),
        0
      ),
    [purchasePaymentsRow?.items]
  );

  const ths = (
    <tr>
      <th>Purchase UID</th>
      <th>Purchase Date</th>
      <th>Net Total</th>
      <th>Paid Amount</th>
    </tr>
  );

  const trSkeleton = Array.from({ length: 10 })
    .fill(null)
    .map(() => (
      <tr>
        <td>
          <Skeleton h={35} />
        </td>
        <td>
          <Skeleton h={35} />
        </td>
        <td>
          <Skeleton h={35} />
        </td>
        <td>
          <Skeleton h={35} />
        </td>
      </tr>
    ));

  const tfs = (
    <tr>
      <th></th>
      <th></th>
      <th className="!text-center">Total Amount</th>
      <th>{currencyNumberFormat(totalAmount!)}</th>
    </tr>
  );

  const rows = elements?.map((element) => (
    <tr key={element.purchaseUID}>
      <td>
        <Anchor
          component={Link}
          to={`/${purchasePaymentsRow.account.tenant}/inventory-management/purchases?purchasesUId=${element.purchaseUID}`}
        >
          {element.purchaseUID}
        </Anchor>
        {}
      </td>
      <td>{dateFormat(element.purchase.purchaseDate)} </td>
      <td>{currencyNumberFormat(element.purchase.netTotal)}</td>
      <td>{currencyNumberFormat(element.purchase.paidAmount || 0)}</td>
    </tr>
  ));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between w-full gap-4">
        <Paper
          key={purchasePaymentsRow._id}
          p={10}
          radius={10}
          shadow="sm"
          withBorder
          className="w-full"
        >
          <Title order={3}>Basic Info</Title>
          <Text>Payment UID: {purchasePaymentsRow?.paymentUID}</Text>
          <Text>
            Paid Amount:{" "}
            {currencyNumberFormat(purchasePaymentsRow.paidAmount || 0)}
          </Text>
          <Text>Check Number: {purchasePaymentsRow?.checkNo}</Text>
          <Text>Recept No: {purchasePaymentsRow?.receptNo}</Text>
          <Text>Note: {purchasePaymentsRow?.note}</Text>
        </Paper>

        <Paper p={10} radius={10} shadow="sm" withBorder className="w-full">
          <Title order={3}>Supplier</Title>

          <Text>
            Name:{" "}
            <Anchor
              component={Link}
              to={`/${purchasePaymentsRow.account.tenant}/people/suppliers?supplierId=${purchasePaymentsRow?.supplier?._id}`}
            >
              {purchasePaymentsRow?.supplier?.name}
            </Anchor>
          </Text>
          <Text>
            Company Name:{" "}
            {purchasePaymentsRow?.supplier?.companyName}
          </Text>
          <Text>Email: {purchasePaymentsRow?.supplier.email}</Text>
          <Text>Contact: {purchasePaymentsRow?.supplier.contactNumber}</Text>
        </Paper>
      </div>
      <Paper p={10} radius={10} shadow="sm" withBorder className="w-6/12">
        <Title order={3}>Account</Title>
        <Text>
          Name:{" "}
          <Anchor
            component={Link}
            to={`/${purchasePaymentsRow.account.tenant}/accounting/cashbook/accounts?accountId=${purchasePaymentsRow?.account?._id}`}
          >
            {purchasePaymentsRow?.account?.name}
          </Anchor>{" "}
        </Text>
        <Text>
          Company Name:{" "}
          {currencyNumberFormat(purchasePaymentsRow.paidAmount || 0)}
        </Text>
       
      </Paper>

      <Table withColumnBorders captionSide="bottom">
        <thead className="bg-card-header">{ths}</thead>
        <tbody>{loading ? trSkeleton : rows}</tbody>
        <tfoot>{tfs}</tfoot>
      </Table>

      {/* <Attachments
        attachments={purchasePaymentsRow.attachments ?? []}
        onUploadDone={() => {}}
        enableUploader={false}
        folder={FOLDER__NAME.PURCHASE_PAYMENTS_ATTACHMENTS}
      /> */}
    </div>
  );
};

export default PurchasePaymentsDetails;
