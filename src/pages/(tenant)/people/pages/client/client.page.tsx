import AppDatatable, {
  ColumnDef,
} from "@/commons/components/AppDatatable/AppDatatable";
import PageTitle from "@/commons/components/PageTitle";
import {
  Client,
  ClientsWithPagination,
  MatchOperator,
} from "@/commons/graphql-models/graphql";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Button, Drawer, Input, Text } from "@mantine/core";
import { useDisclosure, useSetState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ClientCreateForm from "./components/ClientCreateFrom";
import {
  PEOPLE_CLIENTS_QUERY,
  PEOPLE_REMOVE_CLIENT,
} from "./utils/client.query";

interface IState {
  refetching: boolean;
  action: "CREATE" | "EDIT";
  selectedClient: Client | null;
}

interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortingState {
  column: string;
  direction: "asc" | "desc" | null;
}

const ClientPage = () => {
  const [openedDrawer, drawerHandler] = useDisclosure();
  const [state, setState] = useSetState<IState>({
    refetching: false,
    action: "CREATE",
    selectedClient: null,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>({
    column: "",
    direction: null,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");

  // Build query variables
  const buildQueryVariables = () => {
    const graphqlFilters = [];

    // Add search filters
    if (filters.name) {
      graphqlFilters.push({
        key: "name",
        operator: MatchOperator.Contains,
        value: filters.name,
      });
    }

    if (filters.contactNumber) {
      graphqlFilters.push({
        key: "contactNumber",
        operator: MatchOperator.Contains,
        value: filters.contactNumber,
      });
    }

    if (filters.email) {
      graphqlFilters.push({
        key: "email",
        operator: MatchOperator.Contains,
        value: filters.email,
      });
    }

    return {
      page: pagination.page,
      limit: pagination.pageSize,
      sortBy: sorting.column || "createdAt",
      sort: sorting.direction === "asc" ? "ASC" : "DESC",
      filters: graphqlFilters,
    };
  };

  const {
    data,
    refetch,
    loading: fetchingPeople,
  } = useQuery<{
    people__clients: ClientsWithPagination;
  }>(PEOPLE_CLIENTS_QUERY, {
    variables: {
      where: buildQueryVariables(),
    },
    fetchPolicy: "cache-and-network",
  });

  const [searchuser] = useLazyQuery<{
    people__clients: ClientsWithPagination;
  }>(PEOPLE_CLIENTS_QUERY, { fetchPolicy: "network-only" });

  const [deleteClientMutation, { loading: deleting }] = useMutation(
    PEOPLE_REMOVE_CLIENT,
    {
      onCompleted: () => {
        showNotification({
          title: "Success",
          message: "Client deleted successfully",
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

  const handleRefetch = () => {
    setState({ refetching: true });
    refetch({ where: buildQueryVariables() }).finally(() => {
      setState({ refetching: false });
    });
  };

  const handleDeleteClient = (client: Client) => {
    modals.openConfirmModal({
      title: "Delete Client",
      children: (
        <Text size="sm">
          Are you sure you want to delete client <strong>{client.name}</strong>?
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleting },
      onConfirm: () =>
        deleteClientMutation({
          variables: {
            where: {
              key: "_id",
              operator: MatchOperator.Eq,
              value: client._id,
            },
          },
        }),
    });
  };

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessor: "name",
        title: "Name",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search name..."
            onChange={(e) => setValue("name", e.target.value)}
          />
        ),
      },
      {
        accessor: "contactNumber",
        title: "Contact Number",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search contact number..."
            onChange={(e) => setValue("contactNumber", e.target.value)}
          />
        ),
      },
      {
        accessor: "email",
        title: "Email",
        sortable: true,
        Filter: (setValue) => (
          <Input
            type="text"
            placeholder="Search email..."
            onChange={(e) => setValue("email", e.target.value)}
          />
        ),
      },
      {
        accessor: "address",
        title: "Address",
        sortable: false,
      },
    ],
    []
  );

  useEffect(() => {
    if (clientId) {
      // alert(clientId);
      drawerHandler.open();
      searchuser({
        variables: {
          where: {
            filters: [
              {
                key: "_id",
                operator: MatchOperator.Eq,
                value: clientId,
              },
            ],
          },
        },
      }).then((res) => {
        setState({
          selectedClient: res.data?.people__clients?.nodes?.[0],
          action: "EDIT",
        });
      });
    }
  }, [searchParams]);

  return (
    <>
      <PageTitle title="client" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Text size="xl" weight={600}>
            Clients
          </Text>
          <Text size="sm" color="dimmed">
            Manage your clients and customer information
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefetch}
            disabled={state.refetching}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {state.refetching ? "Refreshing..." : "Refresh"}
          </button>
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() => {
              drawerHandler.open();
              setState({
                action: "CREATE",
              });
            }}
          >
            Add Client
          </Button>
        </div>
      </div>

      <AppDatatable
        columns={columns}
        data={data?.people__clients?.nodes ?? []}
        paginationConfig={{
          pageSize: pagination.pageSize,
          totalItems: data?.people__clients?.meta?.totalCount ?? 0,
          currentPage: pagination.page,
        }}
        ActionColumn={(row: Client) => (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                drawerHandler.open();
                setState({
                  selectedClient: row,
                  action: "EDIT",
                });
              }}
              className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 rounded-md bg-green-50 hover:bg-green-100"
            >
              <IconEdit size={14} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClient(row);
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
          setFilters((prev) => ({ ...prev, [column]: value }));
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onPaginationChange={(page, pageSize) => {
          setPagination({ page, pageSize });
        }}
        loading={fetchingPeople || state.refetching}
        emptyMessage="No clients found. Try adjusting your filters."
      />

      <Drawer
        opened={openedDrawer}
        onClose={drawerHandler.close}
        position="right"
        title={state.action === "CREATE" ? "Create new client" : "Edit client"}
        withCloseButton={true}
        size={"60%"}
      >
        <ClientCreateForm
          action={state.action}
          formData={state.selectedClient!}
          onFormSubmitted={() => {
            refetch();
            drawerHandler.close();
          }}
        />
      </Drawer>
    </>
  );
};

export default ClientPage;
