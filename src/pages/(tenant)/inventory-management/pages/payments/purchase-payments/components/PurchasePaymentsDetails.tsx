import {
  ProductPurchasesWithPagination,
  PurchasePayment,
} from "@/_app/graphql-models/graphql";
import { useQuery } from "@apollo/client";
import { Paper, Table, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { Inventory__product_Purchases_Query } from "../../../purchases/purchase-list/utils/query";

const PurchasePaymentsDetails: React.FC<{
  purchasePaymentsRow: PurchasePayment;
}> = ({ purchasePaymentsRow }) => {
  const { data } = useQuery<{
    inventory__productPurchases: ProductPurchasesWithPagination;
  }>(Inventory__product_Purchases_Query, {
    variables: {
      where: {
        limit: -1,
        page: 1,
      },
    },
  });



  const elements = data?.inventory__productPurchases?.nodes;
  const totalAmount = data?.inventory__productPurchases?.nodes?.reduce(
    (total, current) => total + (current?.paidAmount ?? 0),
    0
  );
  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    maximumSignificantDigits: 3,
  });
  const formattedAmount = currencyFormatter.format(totalAmount || 0);
  const ths = (
    <tr>
      <th>Purchase UID</th>
      <th>Purchase Date</th>
      <th>Net Total</th>
      <th>Paid Amount</th>
    </tr>
  );
  const tfs = (
    <tr>
      <th></th>
      <th></th>
      <th>Total Amount</th>
      <th>{formattedAmount}</th>
    </tr>
  );

  const rows = elements?.map((element) => (
    <tr key={element._id}>
      <td>
        <Link
          to={`/${purchasePaymentsRow.account.tenant}/inventory-management/purchases?purchasesUId=${element.purchaseUID}`}
        >
          {element.purchaseUID}
        </Link>
        {}
      </td>
      <td>
        {dayjs(element.purchaseDate).format("dddd, MMMM D, YYYY h:mm A")}{" "}
      </td>
      <td>{currencyFormatter.format(element.netTotal)}</td>
      <td>{currencyFormatter.format(element.paidAmount || 0)}</td>
    </tr>
  ));

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex gap-4 justify-between">
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
            {currencyFormatter.format(purchasePaymentsRow.paidAmount || 0)}
          </Text>
          <Text>Check Number: {purchasePaymentsRow?.checkNo}</Text>
          <Text>Recept No: {purchasePaymentsRow?.receptNo}</Text>
          <Text>Note: {purchasePaymentsRow?.note}</Text>
        </Paper>

        <Paper p={10} radius={10} shadow="sm" withBorder className="w-full">
          <Title order={3}>Supplier</Title>

          <Text>
            Name:{" "}
            <Link
              to={`/${purchasePaymentsRow.account.tenant}/people/suppliers?supplierId=${purchasePaymentsRow?.supplier?._id}`}
            >
              {purchasePaymentsRow?.supplier?.name}
            </Link>
          </Text>
          <Text>
            Company Name:{" "}
            {currencyFormatter.format(purchasePaymentsRow.paidAmount || 0)}
          </Text>
          <Text>Email: {purchasePaymentsRow?.supplier.email}</Text>
          <Text>Contact: {purchasePaymentsRow?.supplier.contactNumber}</Text>
        </Paper>
      </div>
      <Paper p={10} radius={10} shadow="sm" withBorder className="w-6/12">
        <Title order={3}>Account</Title>
        <Text>
          Name:{" "}
          <Link
            to={`/${purchasePaymentsRow.account.tenant}/accounting/cashbook/accounts?accountId=${purchasePaymentsRow?.account?._id}`}
          >
            {purchasePaymentsRow?.account?.name}
          </Link>{" "}
        </Text>
        <Text>
          Company Name:{" "}
          {currencyFormatter.format(purchasePaymentsRow.paidAmount || 0)}
        </Text>
        {/* <Text>Email: {purchasePaymentsRow?.account.email}</Text>
        <Text>Contact: {purchasePaymentsRow?.account.contactNumber}</Text> */}
      </Paper>


      <Table withColumnBorders captionSide="bottom">
        <thead className="bg-slate-300">{ths}</thead>
        <tbody>{rows}</tbody>
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
