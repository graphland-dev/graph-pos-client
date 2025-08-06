import { Button } from "@mantine/core";
import { Printer } from "lucide-react";
import React, { useRef, useState } from "react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  billToName: string;
  billToAddress: string;
  billToEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const sampleInvoiceData: InvoiceData = {
  invoiceNumber: "INV-2024-001",
  date: "2024-01-15",
  dueDate: "2024-02-15",
  companyName: "Your Company Name",
  companyAddress: "123 Business St.\nCity, State 12345",
  companyPhone: "+1 (555) 123-4567",
  companyEmail: "info@yourcompany.com",
  billToName: "Client Name",
  billToAddress: "456 Client Ave.\nClient City, State 67890",
  billToEmail: "client@email.com",
  items: [
    {
      id: "1",
      description: "Web Design Services",
      quantity: 1,
      rate: 2500.0,
      amount: 2500.0,
    },
    {
      id: "2",
      description: "Development Hours",
      quantity: 40,
      rate: 75.0,
      amount: 3000.0,
    },
    {
      id: "3",
      description: "Project Management",
      quantity: 1,
      rate: 500.0,
      amount: 500.0,
    },
  ],
  subtotal: 6000.0,
  tax: 480.0,
  total: 6480.0,
};

export const InvoiceTemplate: React.FC = () => {
  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = () => {
    window.print();
  };

  const [invoiceData] = useState<InvoiceData>(sampleInvoiceData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-4 bg-muted">
      {/* Print Controls */}
      <div className="my-10 text-center">
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4" />
          Print
        </Button>
      </div>

      {/* Invoice Container */}
      <div
        ref={printRef}
        className={`invoice-container max-w-4xl mx-auto bg-card shadow-lg print-font-small`}
      >
        <div className="invoice-container-inner">
          {/* Header */}
          <div className="flex flex-row items-start justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <h1 className="mb-2 text-3xl font-bold text-primary">INVOICE</h1>
              <div className="text-muted-foreground">
                <p className="font-semibold">
                  Invoice #: {invoiceData.invoiceNumber}
                </p>
                <p>Date: {formatDate(invoiceData.date)}</p>
                <p>Due Date: {formatDate(invoiceData.dueDate)}</p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="mb-2 text-xl font-bold text-foreground">
                {invoiceData.companyName}
              </h2>
              <div className="text-muted-foreground">
                <p className="whitespace-pre-line">
                  {invoiceData.companyAddress}
                </p>
                <p>{invoiceData.companyPhone}</p>
                <p>{invoiceData.companyEmail}</p>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Bill To:
              </h3>
              <div className="text-muted-foreground">
                <p className="font-semibold text-foreground">
                  {invoiceData.billToName}
                </p>
                <p className="whitespace-pre-line">
                  {invoiceData.billToAddress}
                </p>
                <p>{invoiceData.billToEmail}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="px-2 py-3 font-semibold text-left text-foreground">
                      Description
                    </th>
                    <th className="w-20 px-2 py-3 font-semibold text-center text-foreground">
                      Qty
                    </th>
                    <th className="w-24 px-2 py-3 font-semibold text-right text-foreground">
                      Rate
                    </th>
                    <th className="px-2 py-3 font-semibold text-right text-foreground w-28">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-muted/30" : ""}
                    >
                      <td className="py-2 text-foreground">
                        {item.description}
                      </td>
                      <td className="py-2 text-center text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="py-2 font-semibold text-right text-foreground">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-80">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(invoiceData.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Tax (8%):</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(invoiceData.tax)}
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-xl font-bold text-foreground">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(invoiceData.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 mt-12 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2 font-semibold">Payment Terms:</p>
              <p>
                Payment is due within 30 days of invoice date. Late payments may
                be subject to fees.
              </p>
              <p className="mt-4">Thank you for your business!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
