import currencyNumberFormat from "@/_app/common/utils/commaNumber";
import dateFormat from "@/_app/common/utils/dateFormat";
import { PurchasePayment } from "@/_app/graphql-models/graphql";
import {
  Anchor,
  Divider,
  Paper,
  Skeleton,
  Table,
  Text,
  Title,
} from "@mantine/core";
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
          
          to={`/${purchasePaymentsRow.account.tenant}/inventory-management/purchases?purchaseId=${element.purchase._id}`}
        >
          {element.purchaseUID}
        </Anchor>
        
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
          radius={5}
          shadow="sm"
          withBorder
          className="w-full flex flex-col gap-1"
        >
          <Title order={4}>Basic Info</Title>
          <Divider />
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Payment UID:
            </span>{" "}
            {purchasePaymentsRow?.paymentUID}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              {" "}
              Paid Amount:
            </span>

            {currencyNumberFormat(purchasePaymentsRow.paidAmount || 0)}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              {" "}
              Check Number:
            </span>
            {purchasePaymentsRow?.checkNo}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              {" "}
              Recept No:
            </span>
            {purchasePaymentsRow?.receptNo}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary"> Note:</span>
            {purchasePaymentsRow?.note}
          </Text>
        </Paper>

        <Paper
          p={10}
          radius={5}
          shadow="sm"
          withBorder
          className="w-full flex flex-col gap-1"
        >
          <Title order={4}>Supplier</Title>
          <Divider />
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary"> Name:</span>

            <Anchor
              component={Link}
              to={`/${purchasePaymentsRow.account.tenant}/people/suppliers?supplierId=${purchasePaymentsRow?.supplier?._id}`}
            >
              {purchasePaymentsRow?.supplier?.name}
            </Anchor>
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              {" "}
              Company Name:{" "}
            </span>

            {purchasePaymentsRow?.supplier?.companyName}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">Email: </span>
            {purchasePaymentsRow?.supplier.email}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              {" "}
              Contact:
            </span>
            {purchasePaymentsRow?.supplier.contactNumber}
          </Text>
        </Paper>
      </div>
      <Paper
        p={10}
        radius={5}
        shadow="sm"
        withBorder
        className="w-6/12 flex flex-col gap-1"
      >
        <Title order={4}>Account</Title>
        <Divider />
        <Text className="flex justify-between">
          <span className="font-semibold text-neutral-primary">Name:</span>{" "}
          <Anchor
            component={Link}
            to={`/${purchasePaymentsRow.account.tenant}/accounting/cashbook/accounts?accountId=${purchasePaymentsRow?.account?._id}`}
          >
            {purchasePaymentsRow?.account?.name}
          </Anchor>{" "}
        </Text>
        <Text className="flex justify-between">
          <span className="font-semibold text-neutral-primary">
            {" "}
            Company Name:
          </span>{" "}
          <span>
            {" "}
            {currencyNumberFormat(purchasePaymentsRow.paidAmount || 0)}
          </span>
        </Text>
      </Paper>

    
      <Table mt={"md"} withColumnBorders captionSide="bottom">
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
