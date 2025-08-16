import DataTable from "@/commons/components/DataTable.tsx";
import PageTitle from "@/commons/components/PageTitle";
import {
  MatchOperator,
  ProductQuotation,
  ProductQuotationsWithPagination,
} from "@/commons/graphql-models/graphql";
import { currencyNumberWithSymbolFormat } from "@/commons/utils/commaNumber";
import dateFormat from "@/commons/utils/dateFormat";
import { useMutation, useQuery } from "@apollo/client";
import { Badge, Button, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  INVENTORY_PRODUCT_QUOTATIONS_QUERY, 
  DELETE_PRODUCT_QUOTATION_MUTATION 
} from "./utils/query.quotations";

const QuotationsPage = () => {
  const navigate = useNavigate();
  const [refetching, setRefetching] = useState(false);
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

  const params = useParams<{ tenant: string }>();

  const [deleteQuotation, { loading: deleting }] = useMutation(
    DELETE_PRODUCT_QUOTATION_MUTATION,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Quotation deleted successfully",
          color: "green",
        });
        refetch();
      },
      onError: (error) => {
        showNotification({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    }
  );

  const handleDeleteQuotation = (quotation: ProductQuotation) => {
    modals.openConfirmModal({
      title: "Delete Quotation",
      children: (
        <Text size="sm">
          Are you sure you want to delete quotation{" "}
          <strong>{quotation.quotationUID}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleting },
      onConfirm: () =>
        deleteQuotation({
          variables: {
            where: {
              key: "_id",
              operator: MatchOperator.Eq,
              value: quotation?._id,
            },
          },
        }),
    });
  };

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
    setRefetching(true);
    refetch(variables).finally(() => {
      setRefetching(false);
    });
  };

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

      <DataTable
        columns={columns}
        data={data?.inventory__productQuotations.nodes ?? []}
        refetch={handleRefetch}
        totalCount={data?.inventory__productQuotations.meta?.totalCount ?? 100}
        onRowClick={(row: ProductQuotation) => {
          navigate(
            `/${params.tenant}/inventory-management/quotations/${row._id}`
          );
        }}
        RowActionMenu={(row: ProductQuotation) => (
          <Menu>
            <Menu.Item
              onClick={() =>
                navigate(
                  `/${params.tenant}/inventory-management/quotations/${row._id}`
                )
              }
            >
              Edit Quotation
            </Menu.Item>
            <Menu.Item
              icon={<IconTrash size={18} />}
              color="red"
              onClick={() => handleDeleteQuotation(row)}
            >
              Delete
            </Menu.Item>
          </Menu>
        )}
        loading={loading || refetching}
      />
    </>
  );
};

export default QuotationsPage;
