import { ProductInvoice, Tenant } from "@/commons/graphql-models/graphql";
import { gql, useQuery } from "@apollo/client";
import InvoiceTemplate from "./PrintableInvoice";
import { getFileUrl } from "@/commons/utils/getFileUrl";
import { useMemo } from "react";

interface Props {
  invoiceId: string;
  tenant: string;
}

const PrintableFullInvoice: React.FC<Props> = ({ invoiceId, tenant }) => {
  const invoiceQuery = useQuery<{ inventory__productInvoice: ProductInvoice }>(
    INVOICE_DETAILS_QUERY,
    {
      variables: {
        where: {
          key: "_id",
          operator: "eq",
          value: invoiceId,
        },
      },
    }
  );

  const tenantQuery = useQuery<{ identity__tenant: Tenant }>(
    TENANT_DETAILS_QUERY,
    {
      variables: { tenant },
    }
  );

  const invoice = useMemo(
    () => invoiceQuery.data?.inventory__productInvoice,
    [invoiceQuery.data]
  );

  return (
    <>
      <pre>
        {/* {JSON.stringify(invoiceQuery.data?.inventory__productInvoice, null, 2)} */}
        {/* <br /> */}
        {/* {JSON.stringify(tenantQuery.data?.identity__tenant, null, 2)} */}
      </pre>
      {/* <FullInvoiceUI
        date={
          dateFormat(invoiceQuery.data?.inventory__productInvoice?.date) || ""
        }
        paidAmount={
          invoiceQuery.data?.inventory__productInvoice?.paidAmount || 0
        }
        subTotal={invoiceQuery.data?.inventory__productInvoice?.subTotal || 0}
        netTotal={invoiceQuery.data?.inventory__productInvoice?.netTotal || 0}
        netTaxAmount={
          invoiceQuery.data?.inventory__productInvoice?.netTaxAmount || 0
        }
        netSubtotalDiscount={
          invoiceQuery.data?.inventory__productInvoice?.netDiscountAmount || 0
        }
        invoiceDiscountPercentage={
          invoiceQuery.data?.inventory__productInvoice
            ?.invoiceDiscountPercentage || 0
        }
        invoiceDiscountAmount={
          invoiceQuery.data?.inventory__productInvoice?.invoiceDiscountAmount ||
          0
        }
        invoiceDiscountMode={
          invoiceQuery.data?.inventory__productInvoice?.invoiceDiscountMode ||
          ProductDiscountMode.Percentage
        }
        netSellPrice={
          invoiceQuery.data?.inventory__productInvoice?.netSellPrice || 0
        }
        customerInfo={
          invoiceQuery.data?.inventory__productInvoice?.client
            ? {
                customerName:
                  invoiceQuery.data?.inventory__productInvoice?.client?.name ||
                  "No Name",
                customerAddress:
                  invoiceQuery.data?.inventory__productInvoice?.client
                    ?.address ?? "",
                customerPhone:
                  invoiceQuery.data?.inventory__productInvoice?.client
                    ?.contactNumber || "No Phone Number",
              }
            : null
        }
        companyInfo={
          tenantQuery.data?.identity__tenant
            ? {
                companyName:
                  tenantQuery.data?.identity__tenant?.name || "No Name",
                companyAddress:
                  tenantQuery.data?.identity__tenant?.address || "No Address",
                phoneNumber:
                  tenantQuery.data?.identity__tenant?.businessPhoneNumber ||
                  "No Phone Number",
              }
            : null
        }
        items={
          invoiceQuery.data?.inventory__productInvoice?.products.map(
            (item, index) => ({
              sl: index + 1,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice || 0,
              unitSellPrice: item.unitSellPrice || 0,
              discountAmount: item.discountAmount || 0,
              netAmount: item.netAmount,
              netTaxAmount: item.taxAmount,
              netTaxRate: item.taxRate,
            })
          ) || []
        }
        netDiscountAmount={
          invoiceQuery.data?.inventory__productInvoice?.netDiscountAmount || 0
        }
        costAmount={0}
      /> */}
      <InvoiceTemplate
        company={{
          logoUrl: tenantQuery.data?.identity__tenant.logo
            ? getFileUrl(tenantQuery.data?.identity__tenant.logo)
            : undefined,
          name: tenantQuery.data?.identity__tenant.name || "No Name",
          address: tenantQuery.data?.identity__tenant.address || undefined,
          phone:
            tenantQuery.data?.identity__tenant.businessPhoneNumber || undefined,
        }}
        customer={{
          name: invoice?.client?.name || undefined,
          address: invoice?.client?.address || undefined,
          phone: invoice?.client?.contactNumber || undefined,
          email: invoice?.client?.email || undefined,
        }}
        items={
          invoice?.products.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            netAmount: item.netAmount,
            discountAmount: item.discountAmount || 0,
          })) || []
        }
        date={invoice?.date}
        invoiceUID={invoice?.invoiceUID || ""}
        subtotal={invoice?.subTotal || 0}
        netTotal={invoice?.netTotal || 0}
        paidAmount={invoice?.paidAmount || 0}
        netDiscountAmount={invoice?.netDiscountAmount || 0}
        invoiceDiscountAmount={invoice?.invoiceDiscountAmount || 0}
        invoiceDiscountPercentage={invoice?.invoiceDiscountPercentage || 0}
        invoiceDiscountMode={invoice?.invoiceDiscountMode || null}
        netTaxAmount={invoice?.netTaxAmount || 0}
        note={invoice?.note || undefined}
      />
    </>
  );
};

export default PrintableFullInvoice;

const INVOICE_DETAILS_QUERY = gql`
  query Inventory__productInvoice($where: CommonFindDocumentDto!) {
    inventory__productInvoice(where: $where) {
      _id
      tenant
      invoiceUID
      paymentStatus
      lifecycleStatus
      client {
        address
        contactNumber
        email
        name
        tenant
        attachments {
          meta
          path
          provider
        }
      }
      date
      netTaxAmount
      netSellPrice
      netSubtotalDiscount
      invoiceDiscountAmount
      invoiceDiscountMode
      invoiceDiscountPercentage
      netDiscountAmount
      subTotal
      costAmount
      netTotal
      paidAmount
      note
      source
      createdAt
      updatedAt
      committedBy {
        email
        name
        referenceId
      }
      products {
        referenceId
        name
        code
        unitPrice
        unitSellPrice
        taxRate
        taxAmount
        quantity
        unitPurchasePrice
        netSellPrice
        netPurchaseAmount
        netProfit
        discountAmount
        netSubtotal
        netAmount
      }
      client {
        _id
        name
        email
        createdAt
        tenant
      }
    }
  }
`;

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
