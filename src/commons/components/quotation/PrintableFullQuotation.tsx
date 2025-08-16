import { INVENTORY_PRODUCT_QUOTATION_QUERY } from "@/pages/(tenant)/inventory-management/pages/quotations/utils/query.quotations";
import { ProductDiscountMode, Tenant } from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import { getFileUrl } from "@/commons/utils/getFileUrl";
import { Button } from "@mantine/core";
import { Printer } from "lucide-react";
import numberToWords from "number-to-words";
import React, { useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { gql, useQuery } from "@apollo/client";

interface PrintableFullQuotationProps {
  quotationId: string;
  tenant: string;
}

interface QuotationItem {
  name: string;
  code: string;
  quantity: number;
  unitSellPrice: number;
  netAmount: number;
  discountAmount: number;
}

interface QuotationData {
  quotationUID: string;
  date: string;
  validUntil?: string;
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
  terms?: string;
  items: QuotationItem[];
  subtotal: number;
  netTotal: number;
  netDiscountAmount: number;
  quotationDiscountAmount: number;
  quotationDiscountPercentage: number;
  quotationDiscountMode?: ProductDiscountMode | null;
  netTaxAmount: number;
}

export const QuotationTemplate: React.FC<QuotationData> = ({
  quotationUID,
  date,
  validUntil,
  customer,
  company,
  items,
  subtotal,
  netTotal,
  netTaxAmount,
  netDiscountAmount,
  note,
  terms,
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

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

      {/* Quotation Container */}
      <div
        ref={printRef}
        className={`quotation-container flex flex-col max-w-4xl mx-auto bg-card print-font-small`}
      >
        <div className="relative quotation-container-inner">
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
              <div className="text-muted-foreground">
                <p className="font-semibold">Quotation ID: {quotationUID}</p>
                <p>Date: {formatDate(date)}</p>
                {validUntil && <p>Valid Until: {formatDate(validUntil)}</p>}
              </div>
            </div>
          </div>

          {/* Quotation Title */}
          <div className="flex justify-center">
            <h1 className="mb-2 text-3xl font-bold text-foreground">QUOTATION</h1>
          </div>

          {/* Client Information */}
          <div className="grid gap-8 mb-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                Quote To:
              </h3>
              <div className="text-muted-foreground">
                <p className="font-semibold text-foreground">{customer.name}</p>
                {customer.address && (
                  <p className="whitespace-pre-line">{customer.address}</p>
                )}
                {customer.phone && <p>{customer.phone}</p>}
                {customer.email && <p>{customer.email}</p>}
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
                      <td className="py-2 text-foreground">
                        <div>
                          <p>{item.name}</p>
                          {item.code && (
                            <p className="text-sm text-muted-foreground">
                              Code: {item.code}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-2 text-center text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {currencyNumberWithSymbolFormat(item.unitSellPrice)}
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
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-semibold text-foreground">
                      {currencyNumberWithSymbolFormat(netDiscountAmount)}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Grand total:</span>
                  <span className="font-bold">
                    {currencyNumberWithSymbolFormat(netTotal)}
                  </span>
                </div>
                <div className="flex flex-col justify-between">
                  <span className="font-bold text-foreground">In words:</span>
                  <span>{numberToWords.toWords(netTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {note && (
            <div className="pt-8 mt-12 border-t border-border">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2 font-semibold">Notes:</p>
                <pre className="font-sans whitespace-pre-wrap">{note}</pre>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          {terms && (
            <div className="pt-4 mt-8">
              <div className="text-sm text-muted-foreground">
                <p className="mb-2 font-semibold">Terms & Conditions:</p>
                <pre className="font-sans whitespace-pre-wrap">{terms}</pre>
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

const PrintableFullQuotation = ({
  quotationId,
  tenant,
}: PrintableFullQuotationProps) => {
  const quotationQuery = useQuery(INVENTORY_PRODUCT_QUOTATION_QUERY, {
    variables: {
      where: {
        key: "_id",
        operator: "eq",
        value: quotationId,
      },
    },
    skip: !quotationId,
  });

  const tenantQuery = useQuery<{ identity__tenant: Tenant }>(
    TENANT_DETAILS_QUERY,
    {
      variables: { tenant },
    }
  );

  const quotation = useMemo(
    () => quotationQuery.data?.inventory__productQuotation,
    [quotationQuery.data]
  );

  if (quotationQuery.loading || tenantQuery.loading) {
    return <div className="p-4 text-center">Loading quotation...</div>;
  }

  if (!quotation) {
    return <div className="p-4 text-center">Quotation not found</div>;
  }

  // Transform quotation data to match template interface
  const quotationData: QuotationData = {
    quotationUID: quotation.quotationUID || "",
    date: quotation.date,
    validUntil: quotation.validUntil,
    company: {
      logoUrl: tenantQuery.data?.identity__tenant.logo
        ? getFileUrl(tenantQuery.data?.identity__tenant.logo)
        : undefined,
      name: tenantQuery.data?.identity__tenant.name || "Company Name",
      address: tenantQuery.data?.identity__tenant.address || undefined,
      phone: tenantQuery.data?.identity__tenant.businessPhoneNumber || undefined,
      email: undefined, // Tenant doesn't have email field
    },
    customer: {
      name: quotation.client?.name || "No Client",
      address: quotation.client?.address || "",
      email: quotation.client?.email || "",
      phone: quotation.client?.contactNumber || "",
    },
    note: quotation.note || "",
    terms: quotation.terms || "",
    items: quotation.products?.map((product: any) => ({
      name: product.name,
      code: product.code || "",
      quantity: product.quantity,
      unitSellPrice: product.unitSellPrice || 0,
      netAmount: product.netAmount || 0,
      discountAmount: product.discountAmount || 0,
    })) || [],
    subtotal: quotation.subTotal || 0,
    netTotal: quotation.netTotal || 0,
    netDiscountAmount: quotation.netDiscountAmount || 0,
    quotationDiscountAmount: quotation.quotationDiscountAmount || 0,
    quotationDiscountPercentage: quotation.quotationDiscountPercentage || 0,
    quotationDiscountMode: quotation.quotationDiscountMode,
    netTaxAmount: quotation.netTaxAmount || 0,
  };

  return <QuotationTemplate {...quotationData} />;
};

export default PrintableFullQuotation;

const TENANT_DETAILS_QUERY = gql`
  query Identity__tenant($tenant: String!) {
    identity__tenant(tenant: $tenant) {
      _id
      name
      logo {
        path
        provider
      }
      address
      businessPhoneNumber
      description
      uid
      subscriptionType
      allowedCollections
      createdAt
      updatedAt
    }
  }
`;