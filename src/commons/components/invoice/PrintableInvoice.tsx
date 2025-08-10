import { ProductDiscountMode } from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { Button } from "@mantine/core";
import { Printer } from "lucide-react";
import numberToWords from "number-to-words";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  netAmount: number;
  discountAmount: number;
}

interface InvoiceData {
  invoiceUID: string;
  date: string;
  dueDate?: string;
  company: {
    logoUrl?: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  customer: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  note?: string;
  items: InvoiceItem[];
  subtotal: number;
  netTotal: number;
  paidAmount: number;
  netDiscountAmount: number;
  invoiceDiscountAmount: number;
  invoiceDiscountPercentage: number;
  invoiceDiscountMode?: ProductDiscountMode | null;
  netTaxAmount: number;
}

export const InvoiceTemplate: React.FC<InvoiceData> = ({
  invoiceUID,
  date,
  customer,
  company,
  items,
  subtotal,
  netTotal,
  paidAmount,
  netTaxAmount,
  netDiscountAmount,
  note,
  // invoiceDiscountMode,
  // invoiceDiscountPercentage,
  // invoiceDiscountAmount,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);
  // const handlePrint = () => {
  //   window.print();
  // };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-4">
      {/* Print Controls */}
      <div className="my-10 text-center print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4" />
          Print
        </Button>
      </div>

      {/* Invoice Container */}
      <div
        ref={printRef}
        className={`invoice-container flex flex-col max-w-4xl mx-auto bg-card print-font-small`}
      >
        <div className="relative invoice-container-inner">
          {/* Header */}
          <div className="flex flex-row items-start justify-between mb-8">
            <div>
              {company.logoUrl && (
                <img className="h-10 mb-2" src={company.logoUrl} alt="logo" />
              )}

              <h2 className="mb-2 text-xl font-bold text-foreground">
                {company.name}
              </h2>
              <div className="text-muted-foreground">
                {company.address && (
                  <pre className="font-sans whitespace-pre-line">
                    {company.address}
                  </pre>
                )}
                {company.phone && <p>Phone Number: {company.phone}</p>}
                {company.email && <p>Email Address: {company.email}</p>}
              </div>
            </div>
            <div className="mb-6 md:mb-0">
              {/* <h1 className="mb-2 text-3xl font-bold text-primary">INVOICE</h1> */}
              <div className="text-muted-foreground">
                <p className="font-semibold">Invoice ID: {invoiceUID}</p>
                <p>Date: {formatDate(date)}</p>
              </div>
            </div>
          </div>

          {/* Invoice Title */}

          <div className="flex justify-center">
            <h1 className="mb-2 text-3xl font-bold text-foreground">INVOICE</h1>
          </div>

          {/* Billing Information */}
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Bill To:
              </h3>
              <div className="text-muted-foreground">
                <p className="font-semibold text-foreground">{customer.name}</p>
                {customer.address && (
                  <p className="whitespace-pre-line">{customer.address}</p>
                )}
                {customer.phone && <p>{customer.phone}</p>}
                {/* {customer.email && <p>{customer.email}</p>} */}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="py-3 font-semibold text-left text-foreground">
                      SL
                    </th>
                    <th className="py-3 font-semibold text-left text-foreground">
                      Product
                    </th>
                    <th className="w-[40px] px-2 py-3 font-semibold text-foreground">
                      Qty
                    </th>
                    <th className="w-20 px-2 py-3 font-semibold text-right text-foreground">
                      Price
                    </th>

                    <th className="w-24 px-2 py-3 font-semibold text-right text-foreground">
                      Discount
                    </th>
                    <th className="px-2 py-3 font-semibold text-right text-foreground w-28">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="w-8 py-2 text-foreground">{index + 1}</td>
                      <td className="py-2 text-foreground">{item.name}</td>
                      <td className="py-2 text-center text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {currencyNumberWithSymbolFormat(item.unitPrice)}
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {currencyNumberWithSymbolFormat(item.discountAmount)}
                      </td>
                      <td className="py-2 font-semibold text-right text-foreground">
                        {currencyNumberWithSymbolFormat(item.netAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold text-foreground">
                    {currencyNumberWithSymbolFormat(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-semibold text-foreground">
                    {currencyNumberWithSymbolFormat(netTaxAmount)}
                  </span>
                </div>
                {netDiscountAmount ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Discount
                      {/* {invoiceDiscountMode === ProductDiscountMode.Percentage
                        ? `(+ ${invoiceDiscountPercentage}%)`
                        : formatCurrency(invoiceDiscountAmount ?? 0)} */}
                      :
                    </span>
                    <span className="font-semibold text-foreground">
                      {currencyNumberWithSymbolFormat(netDiscountAmount)}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between">
                  <span className="font-bold text-foreground">
                    Grant total:
                  </span>
                  <span className="font-bold">
                    {currencyNumberWithSymbolFormat(netTotal)}
                  </span>
                </div>
                <div className="flex flex-col justify-between">
                  <span className="font-bold text-foreground">In words:</span>
                  <span>{numberToWords.toWords(netTotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold text-foreground">
                    Paid Amount:
                  </span>
                  <span className="font-bold">
                    {currencyNumberWithSymbolFormat(paidAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Due Amount:</span>
                  <span className="font-bold">
                    {currencyNumberWithSymbolFormat(netTotal - paidAmount)}
                  </span>
                </div>
                {/*  */}
              </div>
            </div>
          </div>

          {/* Footer */}
          {note && (
            <div className="pt-8 mt-12 border-t border-border">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2 font-semibold">Payment Terms:</p>
                <pre className="font-sans whitespace-pre-wrap ">{note}</pre>
              </div>
            </div>
          )}

          {/* Signature Blocks - Always at Bottom */}
        </div>
        <SignatureBlock />
      </div>
    </div>
  );
};

export default InvoiceTemplate;

const SignatureBlock = () => {
  return (
    <div className="flex-none hidden grid-cols-2 signature-block gap-80 print:grid">
      <div className="text-center">
        <div className="mb-16"></div>
        <div className="pt-2 border-t border-black">
          <span className="font-semibold text-foreground">
            Customer signature
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="mb-16"></div>
        <div className="pt-2 border-t border-black">
          <span className="font-semibold text-foreground">
            Authorised signature
          </span>
        </div>
      </div>
    </div>
  );
};
