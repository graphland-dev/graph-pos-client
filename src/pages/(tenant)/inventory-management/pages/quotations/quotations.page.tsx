import DataTable from "@/commons/components/DataTable.tsx";
import PrintableFullQuotation from "@/commons/components/quotation/PrintableFullQuotation";
import PageTitle from "@/commons/components/PageTitle";
import {
  MatchOperator,
  ProductQuotation,
  ProductQuotationsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import dateFormat from "@/commons/utils/dateFormat";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Badge, Button, Drawer, Menu, Text } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconFileInfo, IconEdit } from "@tabler/icons-react";
import { PrinterIcon } from "lucide-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ProductQuotationDetails from "./components/ProductQuotationDetails";
import QuotationStatusActions from "./components/QuotationStatusActions";
import { INVENTORY_PRODUCT_QUOTATIONS_QUERY } from "./utils/query.quotations";

interface IState {
  refetching: boolean;
  openDrawer: boolean;
  openPrintableQuotation: boolean;
  printableQuotationId?: string;
}

const QuotationsPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useSetState<IState>({
    refetching: false,
    openDrawer: false,
    openPrintableQuotation: false,
    printableQuotationId: undefined,
  });
  const { data, loading, refetch } = useQuery<{
    inventory__productQuotations: ProductQuotationsWithPagination;
  }>(INVENTORY_PRODUCT_QUOTATIONS_QUERY, {
    variables: {
      where: {
        limit: -1,
        page: 1,
      },
    },
  });

  const [searchParams] = useSearchParams();
  const quotationId = searchParams.get("quotationId");
  const params = useParams<{ tenant: string }>();

  const [productQuotation] = useLazyQuery<{
    inventory__productQuotations: ProductQuotationsWithPagination;
  }>(INVENTORY_PRODUCT_QUOTATIONS_QUERY, {
    fetchPolicy: "network-only",
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "quotationUID",
        header: "Quotation UID",
      },
      {
        accessorFn(originalRow) {
          return (
            originalRow?.client?.name || (
              <p className="px-2 bg-destructive/10">No Client</p>
            )
          );
        },
        header: "Client Name",
      },
      {
        accessorFn: (row: ProductQuotation) =>
          row?.date ? dateFormat(row?.date) : "",
        header: "Quotation Date",
      },
      {
        accessorFn: (row: ProductQuotation) =>
          row?.validUntil ? dateFormat(row?.validUntil) : "",
        header: "Valid Until",
      },
      {
        accessorKey: "subTotal",
        accessorFn: (originalRow: ProductQuotation) =>
          `${currencyNumberWithSymbolFormat(originalRow?.netTotal || 0)} BDT`,
        header: "Sub Total",
      },
      {
        accessorKey: "netTotal",
        accessorFn: (originalRow: ProductQuotation) =>
          `${currencyNumberWithSymbolFormat(originalRow?.netTotal || 0)} BDT`,
        header: "Net Total",
      },
      {
        accessorKey: "status",
        accessorFn: (originalRow: ProductQuotation) => {
          const status = originalRow?.status || "DRAFT";
          let color = "gray";

          switch (status) {
            case "SENT":
              color = "blue";
              break;
            case "ACCEPTED":
              color = "green";
              break;
            case "REJECTED":
              color = "red";
              break;
            case "CONVERTED":
              color = "violet";
              break;
            case "EXPIRED":
              color = "orange";
              break;
          }

          return <Badge color={color}>{status}</Badge>;
        },
        header: "Status",
      },
    ],
    []
  );

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  useEffect(() => {
    if (quotationId) {
      productQuotation({
        variables: {
          where: {
            filters: [
              {
                key: "_id",
                operator: MatchOperator.Eq,
                value: quotationId,
              },
            ],
          },
        },
      }).then((res) => {
        setState({
          openDrawer: true,
          printableQuotationId:
            res.data?.inventory__productQuotations?.nodes?.[0]?._id,
        });
      });
    }
  }, [searchParams]);

  return (
    <>
      <PageTitle title="quotation-details" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Quotations
          </Text>
          <Text size="sm" color="dimmed">
            Manage and track your quotations
          </Text>
        </div>
        <Button
          onClick={() =>
            navigate(`/${params.tenant}/inventory-management/quotations/create`)
          }
        >
          Create Quotation
        </Button>
      </div>

      <Drawer
        onClose={() => setState({ openDrawer: false })}
        title={
          <div className="flex items-center justify-between gap-3">
            <Text className="text-2xl font-semibold">Quotation Details</Text>
            <Button
              variant="outline"
              leftIcon={<PrinterIcon />}
              onClick={() =>
                setState({
                  openPrintableQuotation: true,
                  printableQuotationId: state.printableQuotationId ?? "",
                })
              }
            >
              Print
            </Button>
          </div>
        }
        opened={state.openDrawer}
        size={"100%"}
      >
        <ProductQuotationDetails
          quotationId={state.printableQuotationId ?? ""}
        />
      </Drawer>

      <Drawer
        onClose={() =>
          setState({
            openPrintableQuotation: false,
          })
        }
        title={
          <Text className="text-2xl font-semibold">Printable Quotation</Text>
        }
        opened={state.openPrintableQuotation}
        size={"100%"}
      >
        {state.printableQuotationId && (
          <PrintableFullQuotation
            quotationId={state.printableQuotationId}
            tenant={params.tenant ?? ""}
          />
        )}
      </Drawer>

      <DataTable
        columns={columns}
        data={data?.inventory__productQuotations.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.inventory__productQuotations.meta?.totalCount ?? 100}
        RowActionMenu={(row: ProductQuotation) => (
          <>
            <Menu.Item
              icon={<IconFileInfo size={18} />}
              onClick={() => {
                setState({
                  openDrawer: true,
                  printableQuotationId: row._id,
                });
              }}
            >
              View
            </Menu.Item>
            <Menu.Item
              icon={<IconEdit size={18} />}
              onClick={() => {
                navigate(
                  `/${params.tenant}/inventory-management/quotations/create?quotationId=${row._id}`
                );
              }}
            >
              Edit
            </Menu.Item>
            <Menu.Divider />
            <QuotationStatusActions
              quotationId={row._id}
              currentStatus={row.status || "DRAFT"}
              onStatusChange={() => handleRefetch({})}
            />
          </>
        )}
        loading={loading || state.refetching}
      />
    </>
  );
};

export default QuotationsPage;
