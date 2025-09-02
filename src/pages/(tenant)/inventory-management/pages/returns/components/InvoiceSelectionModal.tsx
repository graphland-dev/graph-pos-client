import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Modal, Text, Input, Button, Loader, Badge } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import {
  ProductInvoice,
  ProductInvoicesWithPagination,
  MatchOperator,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { formatTableColumnDate } from "@/commons/utils/dateFormat";
import { INVENTORY_PRODUCT_INVOICES_QUERY } from "../../invoices/utils/query.invoices";

interface InvoiceSelectionModalProps {
  opened: boolean;
  onClose: () => void;
}

const InvoiceSelectionModal: React.FC<InvoiceSelectionModalProps> = ({
  opened,
  onClose,
}) => {
  const navigate = useNavigate();
  const { tenant } = useParams<{ tenant: string }>();
  const [searchTerm, setSearchTerm] = useState("");

  // Query invoices with search filter
  const { data, loading } = useQuery<{
    inventory__productInvoices: ProductInvoicesWithPagination;
  }>(INVENTORY_PRODUCT_INVOICES_QUERY, {
    variables: {
      where: {
        page: 1,
        limit: 50,
        sortBy: "createdAt",
        sort: "DESC",
        filters: searchTerm
          ? [
              {
                key: "invoiceUID",
                operator: MatchOperator.Contains,
                value: searchTerm,
              },
            ]
          : undefined,
      },
    },
    skip: !opened,
  });

  const handleSelectInvoice = (invoice: ProductInvoice) => {
    navigate(`/${tenant}/inventory-management/returns/create/${invoice._id}`);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Select Invoice for Return"
      size="full"
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search by Invoice ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-collapse border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left border border-gray-300">
                    Invoice ID
                  </th>
                  <th className="px-4 py-2 text-left border border-gray-300">
                    Client
                  </th>
                  <th className="px-4 py-2 text-left border border-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left border border-gray-300">
                    Net Total
                  </th>
                  <th className="px-4 py-2 text-left border border-gray-300">
                    Due Amount
                  </th>
                  <th className="px-4 py-2 text-left border border-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.inventory__productInvoices?.nodes?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center border border-gray-300"
                    >
                      <Text c="dimmed">No invoices found</Text>
                    </td>
                  </tr>
                ) : (
                  data?.inventory__productInvoices?.nodes?.map((invoice) => {
                    const paidAmount = invoice.paidAmount || 0;
                    const netTotal = invoice.netTotal || 0;
                    const dueAmount = netTotal - paidAmount;

                    return (
                      <tr key={invoice._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-300">
                          <Text fw={500}>{invoice.invoiceUID}</Text>
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          <Text>{invoice.client?.name || "No Client"}</Text>
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          <Text>
                            {invoice.date
                              ? formatTableColumnDate(invoice.date)
                              : ""}
                          </Text>
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          <Text fw={500}>
                            {currencyNumberWithSymbolFormat(netTotal)}
                          </Text>
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          <Badge
                            color={
                              dueAmount > 0 && paidAmount !== 0
                                ? "yellow"
                                : dueAmount === 0 && paidAmount !== 0
                                ? "green"
                                : "red"
                            }
                          >
                            {currencyNumberWithSymbolFormat(dueAmount)}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 border border-gray-300">
                          <Button
                            size="xs"
                            onClick={() => handleSelectInvoice(invoice)}
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceSelectionModal;
