import { ProductDiscountMode } from '@/commons/graphql-models/graphql';
import { currencyNumberWithSymbolFormat } from '@/commons/utils/commaNumber';
import { Button, Tabs } from '@mantine/core';
import { Printer } from 'lucide-react';
import numberToWords from 'number-to-words';

import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

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
  invoiceDiscountAmount,
  invoiceDiscountPercentage,
  invoiceDiscountMode,
  note,
}) => {
  const fullInvoicePrintRef = useRef<HTMLDivElement | null>(null);
  const posInvoicePrintRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pos');

  const handleFullInvoicePrint = useReactToPrint({
    contentRef: fullInvoicePrintRef,
  });

  const handlePOSPrint = useReactToPrint({
    contentRef: posInvoicePrintRef,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen p-4 print:p-0">
      <Tabs
        defaultValue="pos"
        value={activeTab}
        onChange={(value) => setActiveTab(value || 'pos')}
      >
        <div className="my-10 print:hidden">
          <div className="flex justify-between items-center mb-4">
            <Tabs.List>
              <Tabs.Tab value="pos">POS Invoice</Tabs.Tab>
              <Tabs.Tab value="full">Full Invoice</Tabs.Tab>
            </Tabs.List>
            <div className="flex gap-2">
              {activeTab === 'pos' ? (
                <Button onClick={handlePOSPrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print POS Invoice
                </Button>
              ) : (
                <Button onClick={handleFullInvoicePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Full Invoice
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* POS Invoice Tab */}
        <Tabs.Panel value="pos">
          <POSInvoiceTemplate
            ref={posInvoicePrintRef}
            invoiceUID={invoiceUID}
            date={date}
            customer={customer}
            company={company}
            items={items}
            subtotal={subtotal}
            netTotal={netTotal}
            paidAmount={paidAmount}
            netTaxAmount={netTaxAmount}
            netDiscountAmount={netDiscountAmount}
            invoiceDiscountAmount={invoiceDiscountAmount}
            invoiceDiscountPercentage={invoiceDiscountPercentage}
            invoiceDiscountMode={invoiceDiscountMode}
            formatDateTime={formatDateTime}
          />
        </Tabs.Panel>

        {/* Full Invoice Tab */}
        <Tabs.Panel value="full">
          <FullInvoiceTemplate
            ref={fullInvoicePrintRef}
            invoiceUID={invoiceUID}
            date={date}
            customer={customer}
            company={company}
            items={items}
            subtotal={subtotal}
            netTotal={netTotal}
            paidAmount={paidAmount}
            netTaxAmount={netTaxAmount}
            netDiscountAmount={netDiscountAmount}
            invoiceDiscountAmount={invoiceDiscountAmount}
            invoiceDiscountPercentage={invoiceDiscountPercentage}
            invoiceDiscountMode={invoiceDiscountMode}
            note={note}
            formatDate={formatDate}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

// POS Invoice Component (Compact Receipt Style)
const POSInvoiceTemplate = React.forwardRef<
  HTMLDivElement,
  InvoiceData & { formatDateTime: (date: string) => string }
>(
  (
    {
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
      formatDateTime,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className="flex justify-center text-sm font-mono w-full min-h-[50vh] py-[50px] box-border print:justify-start print:py-0"
      >
        {/* Box Ticket */}
        <div className="w-[300px] px-5 py-2.5 cursor-default relative shadow-[0px_5px_10px_rgb(0_0_0_/_10%)] print:w-full print:shadow-none print:px-0">
          {/* Box Header */}
          <div className="text-sm text-center px-[17px] leading-[0.3rem] print:px-4">
            {company.logoUrl && (
              <img
                className="h-12 mx-auto mb-2"
                src={company.logoUrl}
                alt="logo"
              />
            )}
            <p className="text-[17px] font-black">{company.name}</p>
            {company.address && (
              <p className="text-xs mt-1">{company.address}</p>
            )}
            <h3 className="py-3 border-t border-b border-dashed border-[#333333] mt-2 mb-2">
              Invoice
            </h3>
          </div>

          {/* Box Content */}
          <div className="px-[17px] my-5 print:px-4">
            {/* Invoice Details */}
            <div className="flex justify-between w-full leading-[0.1em] mb-3">
              <p>Invoice#</p>
              <p className="font-semibold">{invoiceUID}</p>
            </div>
            <div className="flex justify-between w-full leading-[0.1em] mb-3">
              <p>Date</p>
              <p>{formatDateTime(date)}</p>
            </div>
            {customer.name && (
              <div className="flex justify-between w-full leading-[0.1em] mb-3">
                <p>Customer</p>
                <p>{customer.name}</p>
              </div>
            )}

            {/* Main Table */}
            <table className="w-full border-collapse my-4 border-b border-dashed border-[#333333]">
              <tbody>
                <tr className="text-center border-t border-b border-dashed border-[#333333]">
                  <td className="w-[22mm] text-left py-2"># Item</td>
                  <td className="text-right py-2">Qty</td>
                  <td className="text-right py-2">Rate</td>
                  <td className="text-right py-2">Total</td>
                </tr>
                {items.map((item, index) => (
                  <tr key={index} className="leading-6">
                    <td className="text-left py-1">{item.name}</td>
                    <td className="text-right py-1">{item.quantity}</td>
                    <td className="text-right py-1">
                      {currencyNumberWithSymbolFormat(item.unitPrice)}
                    </td>
                    <td className="text-right py-1">
                      {currencyNumberWithSymbolFormat(item.netAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Sub Table */}
            <table className="w-full border-collapse my-4 border-b border-solid border-[#333333]">
              <tbody>
                <tr className="flex justify-between py-1">
                  <th className="text-left">SubTotal:</th>
                  <td>{currencyNumberWithSymbolFormat(subtotal)}</td>
                </tr>
                {netTaxAmount > 0 && (
                  <tr className="flex justify-between py-1">
                    <th className="text-left">Tax:</th>
                    <td>{currencyNumberWithSymbolFormat(netTaxAmount)}</td>
                  </tr>
                )}
                {netDiscountAmount > 0 && (
                  <tr className="flex justify-between py-1">
                    <th className="text-left">Discount:</th>
                    <td>{currencyNumberWithSymbolFormat(netDiscountAmount)}</td>
                  </tr>
                )}
                <tr className="flex justify-between py-1 font-bold border-t border-[#333333] mt-2 pt-2">
                  <th className="text-left">Total:</th>
                  <td>{currencyNumberWithSymbolFormat(netTotal)}</td>
                </tr>
                {paidAmount > 0 && (
                  <tr className="flex justify-between py-1">
                    <th className="text-left">Paid:</th>
                    <td>{currencyNumberWithSymbolFormat(paidAmount)}</td>
                  </tr>
                )}
                {paidAmount > 0 && netTotal - paidAmount > 0 && (
                  <tr className="flex justify-between py-1">
                    <th className="text-left">Due:</th>
                    <td>
                      {currencyNumberWithSymbolFormat(netTotal - paidAmount)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Legal Copy */}
            {note && (
              <div className="my-4 text-xs">
                <p>
                  <strong>Terms & Conditions:</strong>
                  <br />
                  {note}
                </p>
              </div>
            )}

            {/* Footer - Powered by Graphland */}
            <div className="mt-6 pt-4 border-t border-dashed border-[#333333] text-center text-xs text-muted-foreground">
              <p>Powered by Graphland</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

POSInvoiceTemplate.displayName = 'POSInvoiceTemplate';

// Full Invoice Component (Existing Template)
const FullInvoiceTemplate = React.forwardRef<
  HTMLDivElement,
  InvoiceData & { formatDate: (date: string) => string }
>(
  (
    {
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
      formatDate,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`invoice-container flex flex-col max-w-4xl mx-auto print-font-small print:max-w-full print:mx-0 print:mt-0`}
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

        {/* Footer - Powered by Graphland */}
        <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground print:mt-4">
          <p>Powered by Graphland</p>
        </div>
      </div>
    );
  },
);

FullInvoiceTemplate.displayName = 'FullInvoiceTemplate';

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
