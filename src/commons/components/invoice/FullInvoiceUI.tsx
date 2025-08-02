import { ProductDiscountMode } from "@/commons/graphql-models/graphql";
import currencyNumberFormat from "@/commons/utils/commaNumber";
import { Button } from "@mantine/core";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface InvoiceItem {
  sl: number;
  name: string;
  quantity: number;
  unitPrice: number; // unit price
  unitSellPrice: number; // unit sell price
  discountAmount: number;
  netAmount: number; // net amount
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

  netTaxAmount: number;
  netSubtotalDiscount: number;
  invoiceDiscountPercentage: number;
  invoiceDiscountAmount: number;
  invoiceDiscountMode: ProductDiscountMode;
  netDiscountAmount: number;
  netSellPrice: number;
  subTotal: number;
  costAmount: number;
  netTotal: number;
  paidAmount: number;
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
  //

  netTaxAmount,
  netSubtotalDiscount,
  invoiceDiscountPercentage,
  invoiceDiscountAmount,
  invoiceDiscountMode,
  netSellPrice,
  subTotal,
  netTotal,
  paidAmount,
}: InvoiceProps) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });
  return (
    <div
      ref={printRef}
      className="max-w-5xl p-8 mx-auto text-black bg-[#fff] print:p-4 print:max-w-none"
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
      <table className="w-full mb-6 border border-collapse border-black">
        <thead>
          <tr className="border-b border-black bg-gray-50">
            <th className="px-2 py-2 text-sm font-semibold text-center border-r border-black w-[80px]">
              SL
            </th>
            <th className="px-2 py-2 text-sm font-semibold text-center border-r border-black">
              Product
            </th>
            <th className="px-2 py-2 text-sm font-semibold text-center border-r border-black w-[120px]">
              Quantity
            </th>
            <th className="px-2 py-2 text-sm font-semibold text-center border-r border-black w-[120px]">
              Price
            </th>
            <th className="px-2 py-2 text-sm font-semibold text-center border-r border-black w-[120px]">
              Discount
            </th>
            <th className="px-2 py-2 text-sm font-semibold text-center w-[120px]">
              Net Price
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-black">
              <td className="px-2 py-2 text-sm text-center border-r border-black">
                {item.sl}
              </td>
              <td className="px-2 py-2 text-sm text-left border-r border-black">
                {item.name}
              </td>
              <td className="px-2 py-2 text-sm text-right border-r border-black">
                {item.quantity}
              </td>
              <td className="px-2 py-2 text-sm text-right border-r border-black">
                {item.unitPrice?.toFixed(2)}
              </td>
              <td className="px-2 py-2 text-sm text-right border-r border-black">
                {item.discountAmount?.toFixed(2)}
              </td>
              <td className="px-2 py-2 text-sm text-right">
                {item.netAmount?.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* In Word Section */}
        <div />

        {/* Amount Summary */}
        <table className="w-full border border-collapse border-black">
          <tbody>
            <tr className="border-b border-black">
              <td className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
                Subtotal
              </td>
              <td className="px-3 py-1 text-sm text-right">
                {currencyNumberFormat(subTotal)}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
                Sell price
              </td>
              <td className="px-3 py-1 text-sm text-right">
                {currencyNumberFormat(netSellPrice)}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
                Discount
              </td>
              <td className="px-3 py-1 text-sm text-right">
                {currencyNumberFormat(netSubtotalDiscount)}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
                Extra Discount{" "}
                {invoiceDiscountMode === ProductDiscountMode.Percentage
                  ? `(${invoiceDiscountPercentage}%)`
                  : ""}
              </td>
              <td className="px-3 py-1 text-sm text-right">
                {currencyNumberFormat(invoiceDiscountAmount)}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
                VAT
              </td>
              <td className="px-3 py-1 text-sm text-right">
                {currencyNumberFormat(netTaxAmount)}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
                Net total
              </td>
              <td className="px-3 py-1 text-sm text-right">
                {currencyNumberFormat(netTotal)}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
                Paid Amount
              </td>
              <td className="px-3 py-1 text-sm text-right">
                {currencyNumberFormat(paidAmount || 0)}
              </td>
            </tr>
            <tr className="border-b border-black">
              <td className="px-3 py-1 text-sm font-semibold bg-gray-100 border-r border-black">
                Due Amount
              </td>
              <td className="px-3 py-1 text-sm text-right">
                {currencyNumberFormat(netTotal - paidAmount || 0)}
              </td>
            </tr>
          </tbody>
        </table>
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
