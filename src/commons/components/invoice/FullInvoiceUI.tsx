import currencyNumberFormat from "@/commons/utils/commaNumber";
import { Button } from "@mantine/core";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface InvoiceItem {
  sl: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  netAmount: number;
}

interface CustomerInfo {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
}

interface CompanyInfo {
  companyName: string;
  companyAddress: string;
  phoneNumber: string;
}

interface InvoiceProps {
  companyInfo?: CompanyInfo | null;
  customerInfo?: CustomerInfo | null;
  date?: string;
  items?: InvoiceItem[];

  subTotal?: number;
  discountSuffix?: string;
  discountAmount?: number;

  vatSuffix?: string;
  vatAmount?: number;

  netTotal?: number;
  paidAmount?: number;
}

export default function FullInvoiceUI({
  companyInfo = {
    companyName: "No Company Name",
    companyAddress: "No Company Address",
    phoneNumber: "No Phone Number",
  },
  customerInfo = {
    customerName: "No Name",
    customerAddress: "No Address",
    customerPhone: "No Phone Number",
  },
  date = "2023-01-01",
  items = [],
  subTotal = 0,
  discountSuffix = "15%",
  discountAmount = 0,
  vatSuffix,
  paidAmount = 0,
  vatAmount = 0,
  netTotal = 0,
}: InvoiceProps) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });
  return (
    <div
      ref={printRef}
      className="max-w-4xl p-8 mx-auto text-black bg-[#fff] print:p-4 print:max-w-none"
    >
      {/* Print Button - Hidden when printing */}
      <div className="mb-6 print:hidden">
        <Button onClick={handlePrint}>🖨️ Print Invoice</Button>
      </div>

      {/* Company Header */}
      <div className="pb-4 mb-6 text-center border-b-2 border-black">
        <h1 className="mb-2 text-2xl font-bold">{companyInfo?.companyName}</h1>
        <div className="text-sm whitespace-pre-line">
          {companyInfo?.companyAddress}
        </div>
        <div className="mt-2 text-sm font-semibold">
          Phone Number: {companyInfo?.phoneNumber}
        </div>
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          {customerInfo && (
            <div className="border-black">
              <div className="px-3 py-1 font-semibold bg-gray-100 border-b border-black">
                Customer
              </div>
              <div className="px-3 py-2 min-h-[40px]">
                <p className="text-sm font-bold">
                  {customerInfo?.customerName}
                </p>
                <p className="text-sm">{customerInfo?.customerAddress}</p>
                <p className="text-sm">{customerInfo?.customerPhone}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <p>Date: {date}</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-6 border border-black">
        {/* Table Header */}
        <div className="grid grid-cols-6 border-b border-black bg-gray-50">
          <div className="px-2 w-[60px] py-2 text-sm font-semibold text-center border-r border-black">
            SL
          </div>
          <div className="justify-center col-span-2 px-2 py-2 text-sm font-semibold text-center border-r border-black">
            Product
          </div>
          <div className="px-2 py-2 text-sm font-semibold text-center border-r border-black">
            Quantity
          </div>
          <div className="px-2 py-2 text-sm font-semibold text-center border-r border-black">
            Unit Price
          </div>
          <div className="px-2 py-2 text-sm font-semibold text-center border-r border-black">
            Price
          </div>
        </div>

        {/* Table Rows */}
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-6 border-b border-black">
            <div className="px-2 py-2 w-[60px] text-sm text-center border-r border-black">
              {item.sl}
            </div>
            <div className="col-span-2 px-2 py-2 text-sm text-left border-r border-black">
              {item.productName}
            </div>
            <div className="px-2 py-2 text-sm text-center border-r border-black">
              {item.quantity}
            </div>
            <div className="px-2 py-2 text-sm text-center border-r border-black">
              {item.unitPrice?.toFixed(2)}
            </div>
            <div className="px-2 py-2 text-sm text-right border-r border-black">
              {item.netAmount?.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* In Word Section */}
        <div />

        {/* Amount Summary */}
        <div className="space-y-0">
          <div className="grid grid-cols-2 border border-black">
            <div className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
              Sub Total
            </div>
            <div className="px-3 py-1 text-sm text-right">
              {currencyNumberFormat(subTotal)}
            </div>
          </div>
          <div className="grid grid-cols-2 border border-black">
            <div className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
              VAT {vatSuffix}
            </div>
            <div className="px-3 py-1 text-sm text-right">
              {currencyNumberFormat(vatAmount)}
            </div>
          </div>
          <div className="grid grid-cols-2 border border-t-0 border-black">
            <div className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
              Discount {discountSuffix}
            </div>
            <div className="px-3 py-1 text-sm text-right">
              {currencyNumberFormat(discountAmount)}
            </div>
          </div>
          <div className="grid grid-cols-2 border border-t-0 border-black">
            <div className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
              Paid Amount
            </div>
            <div className="px-3 py-1 text-sm text-right">
              {currencyNumberFormat(paidAmount || 0)}
            </div>
          </div>
          <div className="grid grid-cols-2 border border-t-0 border-black">
            <div className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
              Due Amount
            </div>
            <div className="px-3 py-1 text-sm text-right">
              {currencyNumberFormat(netTotal - paidAmount || 0)}
            </div>
          </div>
          <div className="grid grid-cols-2 border border-t-0 border-black">
            <div className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
              Net Total
            </div>
            <div className="px-3 py-1 text-sm text-right">
              {currencyNumberFormat(netTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-16 text-right">
        <div className="inline-block">
          <div className="w-48 mb-2 border-b border-black"></div>
          <div className="font-semibold text-center">Signature</div>
        </div>
      </div>
    </div>
  );
}
