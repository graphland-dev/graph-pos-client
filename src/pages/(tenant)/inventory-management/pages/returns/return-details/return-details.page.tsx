import PageTitle from "@/commons/components/PageTitle";
import {
  MatchOperator,
  Product_Return_Status,
  ProductReturn,
  ReturnPaymentsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { formatTableColumnDate } from "@/commons/utils/dateFormat";
import { useMutation, useQuery } from "@apollo/client";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Drawer,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_PRODUCT_RETURN,
  GET_RETURN_PAYMENTS,
  UPDATE_PRODUCT_RETURN,
} from "../utils/returns.query";
import ReturnPaymentEntry from "../components/ReturnPaymentEntry";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "yellow";
    case "APPROVED":
      return "blue";
    case "COMPLETED":
      return "green";
    case "REJECTED":
    case "CANCELLED":
      return "red";
    default:
      return "gray";
  }
};

const ReturnDetailsPage = () => {
  const { tenant, returnId } = useParams<{
    tenant: string;
    returnId: string;
  }>();
  const navigate = useNavigate();

  const [openPaymentEntry, setOpenPaymentEntry] = useState(false);

  const { data, loading, error } = useQuery<{
    inventory__productReturn: ProductReturn;
  }>(GET_PRODUCT_RETURN, {
    variables: {
      where: {
        key: "_id",
        operator: MatchOperator.Eq,
        value: returnId,
      },
    },
    skip: !returnId,
  });

  const [updateProductReturn, { loading: updating }] = useMutation(
    UPDATE_PRODUCT_RETURN,
    {
      refetchQueries: [
        {
          query: GET_PRODUCT_RETURN,
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: returnId },
          },
        },
      ],
    }
  );

  const { data: paymentsData, loading: paymentsLoading, refetch: refetchPayments } = useQuery<{
    accounting__returnPayments: ReturnPaymentsWithPagination;
  }>(GET_RETURN_PAYMENTS, {
    variables: {
      where: {
        filters: [
          {
            key: "productReturn",
            operator: MatchOperator.Eq,
            value: returnId,
          },
        ],
      },
    },
    skip: !returnId,
  });

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateProductReturn({
        variables: {
          input: {
            productReturnId: returnId,
            status: newStatus,
          },
        },
      });
    } catch (err) {
      console.error("Error updating return status:", err);
    }
  };

  const returnData = data?.inventory__productReturn;
  const returnItems = useMemo(
    () => returnData?.returnItems || [],
    [returnData?.returnItems]
  );
  const invoice = useMemo(() => returnData?.invoice, [returnData?.invoice]);

  const hasItemNotes = useMemo(
    () => returnItems.some((item: any) => item.itemNotes),
    [returnItems]
  );

  const itemsWithNotes = useMemo(
    () => returnItems.filter((item: any) => item.itemNotes),
    [returnItems]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader size="lg" />
        <Text className="mt-4">Loading return details...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red">
        Failed to load return details: {error.message}
      </Alert>
    );
  }

  if (!returnData) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="blue">
        Return not found
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ActionIcon
            variant="light"
            onClick={() => navigate(`/${tenant}/inventory-management/returns`)}
          >
            <IconArrowLeft size={18} />
          </ActionIcon>
          <PageTitle title="Return Details" />
        </div>

        {returnData && returnData.status === "PENDING" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              color="blue"
              loading={updating}
              onClick={() => handleStatusUpdate("APPROVED")}
            >
              Approve
            </Button>
            <Button
              size="sm"
              color="red"
              variant="outline"
              loading={updating}
              onClick={() => handleStatusUpdate("REJECTED")}
            >
              Reject
            </Button>
          </div>
        )}

        {returnData && returnData.status === "APPROVED" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              color="green"
              loading={updating}
              onClick={() => handleStatusUpdate("COMPLETED")}
            >
              Complete
            </Button>
            <Button
              size="sm"
              color="red"
              variant="outline"
              loading={updating}
              onClick={() => handleStatusUpdate("CANCELLED")}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="flex flex-col col-span-8 gap-4">
            {/* Return Information */}
            <Paper p="sm" withBorder>
              <Title order={4} mb="md">
                Return Information
              </Title>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <Text c="dimmed">Return ID:</Text>
                    <Text fw={500}>{returnData.returnUID}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text c="dimmed">Status:</Text>
                    <Badge
                      color={getStatusColor(returnData.status)}
                      variant="light"
                    >
                      {returnData.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <Text c="dimmed">Return Date:</Text>
                    <Text>{formatTableColumnDate(returnData.returnDate)}</Text>
                  </div>
                  {returnData.processedDate && (
                    <div className="flex justify-between">
                      <Text c="dimmed">Processed Date:</Text>
                      <Text>
                        {formatTableColumnDate(returnData.processedDate)}
                      </Text>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <Text c="dimmed">Reason:</Text>
                    <Text>{returnData.reason.replace("_", " ")}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text c="dimmed">Type:</Text>
                    <Text>{returnData.returnType.replace("_", " ")}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text c="dimmed">Return Amount:</Text>
                    <Text fw={500}>
                      {currencyNumberWithSymbolFormat(
                        returnData?.totalReturnAmount
                      )}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text c="dimmed">Restocking Fee:</Text>
                    <Text>
                      -
                      {currencyNumberWithSymbolFormat(
                        returnData?.restockingFee || 0
                      )}
                    </Text>
                  </div>
                  <div className="flex justify-between">
                    <Text c="dimmed" fw={600}>
                      Net Refund:
                    </Text>
                    <Text fw={600} size="lg" c="green">
                      {currencyNumberWithSymbolFormat(
                        returnData?.netRefundAmount
                      )}
                    </Text>
                  </div>
                  {returnData?.processedRefundAmount ? (
                    <div className="flex justify-between">
                      <Text c="dimmed" fw={600}>
                        Processed Refund:
                      </Text>
                      <Text fw={600} size="lg" c="blue">
                        {currencyNumberWithSymbolFormat(
                          returnData?.processedRefundAmount ?? 0
                        )}
                      </Text>
                    </div>
                  ) : null}
                </div>
              </div>

              {returnData.reasonDescription && (
                <>
                  <Divider my="md" />
                  <div>
                    <Text c="dimmed" size="sm" mb="xs">
                      Detailed Reason:
                    </Text>
                    <Text>{returnData.reasonDescription}</Text>
                  </div>
                </>
              )}

              {returnData.customerNotes && (
                <>
                  <Divider my="md" />
                  <div>
                    <Text c="dimmed" size="sm" mb="xs">
                      Customer Notes:
                    </Text>
                    <Text>{returnData.customerNotes}</Text>
                  </div>
                </>
              )}

              {returnData.internalNotes && (
                <>
                  <Divider my="md" />
                  <div>
                    <Text c="dimmed" size="sm" mb="xs">
                      Internal Notes:
                    </Text>
                    <Text>{returnData.internalNotes}</Text>
                  </div>
                </>
              )}
            </Paper>

            {/* Original Invoice Information */}
            {invoice && (
              <Paper p="sm" withBorder>
                <Title order={4} mb="md">
                  Original Invoice
                </Title>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <Text c="dimmed">Invoice ID:</Text>
                      <Text
                        fw={500}
                        c="blue"
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() =>
                          navigate(
                            `/${tenant}/inventory-management/invoices/${invoice._id}`
                          )
                        }
                      >
                        {invoice.invoiceUID}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text c="dimmed">Invoice Date:</Text>
                      <Text>{formatTableColumnDate(invoice.date)}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text c="dimmed">Invoice Total:</Text>
                      <Text fw={500}>
                        {currencyNumberWithSymbolFormat(invoice.netTotal)}
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                      <Text c="dimmed">Client:</Text>
                      <Text>{invoice.client?.name}</Text>
                    </div>
                    {invoice.client?.contactNumber && (
                      <div className="flex justify-between">
                        <Text c="dimmed">Contact:</Text>
                        <Text>{invoice.client.contactNumber}</Text>
                      </div>
                    )}
                    {invoice.client?.email && (
                      <div className="flex justify-between">
                        <Text c="dimmed">Email:</Text>
                        <Text>{invoice.client.email}</Text>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            )}

            {/* Return Items */}
            <Paper p="sm" withBorder>
              <Title order={5} mb="md">
                Return Items
              </Title>
              {returnItems.length === 0 ? (
                <Text c="dimmed">No items to return</Text>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border border-collapse ">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left border ">Product</th>
                        <th className="px-4 py-2 text-left border">
                          Original Qty
                        </th>
                        <th className="px-4 py-2 text-left border">
                          Return Qty
                        </th>
                        <th className="px-4 py-2 text-left border">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-left border">
                          Total Price
                        </th>
                        <th className="px-4 py-2 text-left border">
                          Condition
                        </th>
                        <th className="px-4 py-2 text-left border">Restock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnItems.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border">
                            <div>
                              <Text fw={500}>{item.name}</Text>
                              {item.code && (
                                <Text size="sm" c="dimmed">
                                  {item.code}
                                </Text>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2 border">
                            {item.originalQuantity}
                          </td>
                          <td className="px-4 py-2 border">
                            {item.returnQuantity}
                          </td>
                          <td className="px-4 py-2 border">
                            {currencyNumberWithSymbolFormat(
                              item.unitPrice || 0
                            )}
                          </td>
                          <td className="px-4 py-2 border">
                            {currencyNumberWithSymbolFormat(
                              item.totalReturnAmount || 0
                            )}
                          </td>
                          <td className="px-4 py-2 border">
                            {item?.condition ?? "N/A"}
                          </td>
                          <td className="px-4 py-2 border ">
                            <Badge
                              size="sm"
                              color={item.canRestock ? "green" : "red"}
                              variant="light"
                            >
                              {item.canRestock ? "Yes" : "No"}
                            </Badge>
                            {item.isRestocked && (
                              <Badge
                                size="sm"
                                color="blue"
                                variant="light"
                                className="ml-2"
                              >
                                Restocked
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {hasItemNotes && (
                <>
                  <Divider my="md" />
                  <Title order={6} mb="sm">
                    Item Notes:
                  </Title>
                  <div className="flex flex-col gap-2">
                    {itemsWithNotes.map((item: any, index: number) => (
                      <Card key={index} p="xs" withBorder>
                        <Text size="sm" fw={500}>
                          {item.name}:
                        </Text>
                        <Text size="sm" c="dimmed">
                          {item.itemNotes}
                        </Text>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </Paper>

            {/* Return Payments */}
            <Paper p="sm" withBorder>
              <div className="flex items-center justify-between mb-4">
                <Title order={5}>Return Payments</Title>
                <Button
                  size="sm"
                  onClick={() => setOpenPaymentEntry(true)}
                  disabled={
                    returnData.status !== Product_Return_Status.Approved
                  }
                >
                  Add Payment
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left border">Payment ID</th>
                      <th className="px-4 py-2 text-left border">Date</th>
                      <th className="px-4 py-2 text-left border">Amount</th>
                      <th className="px-4 py-2 text-left border">Method</th>
                      <th className="px-4 py-2 text-left border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center border">
                          <Loader size="sm" />
                        </td>
                      </tr>
                    ) : paymentsData?.accounting__returnPayments?.nodes?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-gray-500 border"
                        >
                          No payments found
                        </td>
                      </tr>
                    ) : (
                      paymentsData?.accounting__returnPayments?.nodes?.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border">
                            <Text fw={500}>{payment.returnPaymentUID}</Text>
                          </td>
                          <td className="px-4 py-2 border">
                            {payment.paymentDate
                              ? formatTableColumnDate(payment.paymentDate)
                              : formatTableColumnDate(payment.createdAt)}
                          </td>
                          <td className="px-4 py-2 border">
                            {currencyNumberWithSymbolFormat(payment.totalAmount)}
                          </td>
                          <td className="px-4 py-2 border">
                            <div className="flex flex-col gap-1">
                              {payment.paymentItems?.map((item, idx) => (
                                <Badge key={idx} size="sm" variant="light">
                                  {item.type}
                                </Badge>
                              )) || <Badge size="sm" variant="light">N/A</Badge>}
                            </div>
                          </td>
                          <td className="px-4 py-2 border">
                            <Badge 
                              size="sm" 
                              color={payment.status === 'COMPLETED' ? 'green' : 
                                     payment.status === 'FAILED' ? 'red' : 
                                     payment.status === 'PROCESSING' ? 'blue' : 'yellow'}
                              variant="light"
                            >
                              {payment.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Paper>
          </div>

          <div className="col-span-4">
            {/* Processing Information */}
            <Paper p="md" mb="md" withBorder>
              <Title order={4} mb="md">
                Processing Information
              </Title>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <Text c="dimmed">Created By:</Text>
                  <div className="text-right">
                    <Text size="sm" fw={500}>
                      {returnData.committedBy?.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {returnData.committedBy?.email}
                    </Text>
                  </div>
                </div>

                {returnData.processedBy && (
                  <div className="flex justify-between">
                    <Text c="dimmed">Processed By:</Text>
                    <div className="text-right">
                      <Text size="sm" fw={500}>
                        {returnData.processedBy.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {returnData.processedBy.email}
                      </Text>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Text c="dimmed">Created:</Text>
                  <Text size="sm">
                    {formatTableColumnDate(returnData.createdAt)}
                  </Text>
                </div>

                <div className="flex justify-between">
                  <Text c="dimmed">Last Updated:</Text>
                  <Text size="sm">
                    {formatTableColumnDate(returnData.updatedAt)}
                  </Text>
                </div>

                <Divider />
                <div className="flex justify-between">
                  <Text c="dimmed" fw={600}>
                    Processed Refund:
                  </Text>
                  <Text fw={600} c="green">
                    {currencyNumberWithSymbolFormat(
                      returnData?.processedRefundAmount ?? 0
                    )}
                  </Text>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </div>

      {/* Payment Entry Drawer */}
      <Drawer
        opened={openPaymentEntry}
        onClose={() => setOpenPaymentEntry(false)}
        title="Add Return Payment"
        position="right"
        size="md"
      >
        <ReturnPaymentEntry
          onDone={() => {
            setOpenPaymentEntry(false);
            refetchPayments();
          }}
          productReturnId={returnId!}
          remainingAmount={
            (returnData?.netRefundAmount || 0) -
            (returnData?.processedRefundAmount || 0)
          }
        />
      </Drawer>
    </div>
  );
};

export default ReturnDetailsPage;
