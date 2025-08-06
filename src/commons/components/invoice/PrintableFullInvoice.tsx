import { ProductInvoice, Tenant } from "@/commons/graphql-models/graphql";
import { gql, useQuery } from "@apollo/client";
import InvoiceTemplate from "./PrintableInvoice";

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
      <InvoiceTemplate />
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
      status
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
