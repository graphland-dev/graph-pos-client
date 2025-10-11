import { confirmModal } from "@/commons/components/confirm.tsx";
import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import {
  CommonFindDocumentDto,
  CommonPaginationDto,
  MatchOperator,
  Unit,
  UnitsWithPagination,
} from "@/commons/graphql-models/graphql";
import { useMutation, useQuery, gql } from "@apollo/client";
import { Button, Drawer, Input } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { IconPlus, IconTrash, IconPencil } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import CreateAndUpdateUnitForm from "./components/CreateAndUpdateUnitForm";
import { SETUP_REMOVE_UNIT } from "./utils/units.query";
import PageTitle from "@/commons/components/PageTitle";

interface IState {
  modalOpened: boolean;
  operationType: "create" | "update";
  operationId?: string | null;
  operationPayload?: any;
  refetching: boolean;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const UnitPage = () => {
  const [state, setState] = useSetState<IState>({
    modalOpened: false,
    operationType: "create",
    operationId: null,
    operationPayload: {},
    refetching: false,
  });

  // Pagination and sorting states
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: "",
    direction: null,
  });
  const [datatableFilters, setDatatableFilters] = useState<Record<string, any>>(
    {}
  );

  // Build filter variables
  const buildFilterVariables = (): CommonPaginationDto => {
    const graphqlFilters: CommonFindDocumentDto[] = [];

    // Add search filters
    if (datatableFilters.name) {
      graphqlFilters.push({
        key: "name",
        operator: MatchOperator.Contains,
        value: datatableFilters.name,
      });
    }

    if (datatableFilters.code) {
      graphqlFilters.push({
        key: "code",
        operator: MatchOperator.Contains,
        value: datatableFilters.code,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? "ASC" : "DESC",
      filters: graphqlFilters,
    } as CommonPaginationDto;
  };

  const { data, loading, refetch } = useQuery<{
    setup__units: UnitsWithPagination;
  }>(UNITS_QUERY, {
    variables: {
      where: buildFilterVariables(),
    },
    fetchPolicy: "cache-and-network",
  });

  // const { data: unitsData, refetch: refetchAccounts } = useQuery<{
  //   setup__units: AccountsWithPagination;
  // }>(ACCOUNTS_LIST_DROPDOWN, {
  //   variables: {
  //     where: { limit: -1 },
  //   },
  // });

  const [deleteUnitMutation] = useMutation(SETUP_REMOVE_UNIT, {
    onCompleted: () => handleRefetch({}),
  });

  const handleDeleteAccount = (_id: string) => {
    confirmModal({
      title: "Sure to delete?",
      description: "Be careful!! Once you deleted, it can not be undone",
      isDangerous: true,
      onConfirm() {
        deleteUnitMutation({
          variables: {
            where: { key: "_id", operator: MatchOperator.Eq, value: _id },
          },
        });
      },
    });
  };

  const handleRefetch = (variables: any) => {
    setState({ refetching: true });
    // refetchAccounts();
    refetch(variables).finally(() => {
      setState({ refetching: false });
    });
  };

  const columns = useMemo<ColumnDef<Unit>[]>(
    () => [
      {
        accessor: "name",
        title: "Name",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search by name..."
            onChange={(e) => setValue("name", e.target.value)}
          />
        ),
      },
      {
        accessor: "code",
        title: "Code",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search by code..."
            onChange={(e) => setValue("code", e.target.value)}
          />
        ),
      },
      {
        accessor: "note",
        title: "Note",
        sortable: false,
      },
      {
        accessor: (row) => dayjs(row?.createdAt).format("MMMM D, YYYY h:mm A"),
        title: "Date",
        sortKey: "createdAt",
        sortable: true,
      },
    ],
    []
  );
  return (
    <>
      <PageTitle title="setting-unit" />
      <Drawer
        opened={state.modalOpened}
        onClose={() => setState({ modalOpened: false })}
        position="right"
      >
        <CreateAndUpdateUnitForm
          onSubmissionDone={() => {
            handleRefetch({});
            setState({ modalOpened: false });
          }}
          // units={unitsData?.accounting__accounts?.nodes || []}
          operationType={state.operationType}
          operationId={state.operationId}
          formData={state.operationPayload}
        />
      </Drawer>
      <div className="flex items-center justify-between mb-4">
        <div></div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() =>
            setState({
              modalOpened: true,
              operationType: "create",
              operationPayload: {},
            })
          }
          size="sm"
        >
          Add new
        </Button>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.setup__units?.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.setup__units?.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: Unit) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  modalOpened: true,
                  operationType: "update",
                  operationId: row._id,
                  operationPayload: row,
                });
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
            >
              <IconPencil size={14} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAccount(row._id);
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 rounded-md bg-red-50 hover:bg-red-100"
            >
              <IconTrash size={14} />
              Delete
            </button>
          </div>
        )}
        onSortChange={(column, direction) => {
          setSorting({ column, direction });
        }}
        onFilterChange={(column, value) => {
          setDatatableFilters((prev) => ({ ...prev, [column]: value }));
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onPaginationChange={(page, pageSize) => {
          setPagination({ page, pageSize });
        }}
        loading={loading || state.refetching}
        emptyMessage="No units found. Try adjusting your filters."
      />
    </>
  );
};

export default UnitPage;

// Local GraphQL query for Units with filtering support
const UNITS_QUERY = gql`
  query UnitsFiltered($where: CommonPaginationDto) {
    setup__units(where: $where) {
      nodes {
        _id
        name
        code
        note
        createdAt
        updatedAt
      }
      meta {
        totalCount
        currentPage
        hasNextPage
        totalPages
      }
    }
  }
`;
