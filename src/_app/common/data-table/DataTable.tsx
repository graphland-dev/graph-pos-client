import {
  CommonFindDocumentDto,
  MatchOperator,
  SortType,
} from "@/_app/graphql-models/graphql";
import { ActionIcon, Flex, Menu, UnstyledButton, rem } from "@mantine/core";
import {
  IconCsv,
  IconDownload,
  IconPdf,
  IconRefresh,
} from "@tabler/icons-react";
import cls from "classnames";
import {
  download as downloadCsvFile,
  generateCsv,
  mkConfig,
} from "export-to-csv";
import {
  MRT_ColumnDef,
  MRT_GlobalFilterTextInput,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React, { useEffect, useState } from "react";

interface Prop {
  columns: MRT_ColumnDef<any>[];
  data: any[];
  filters?: CommonFindDocumentDto[];
  refetch: (v: any) => void;
  totalCount: number;
  loading: boolean;
  ActionArea?: React.ReactNode;
  RowActionMenu?: (row: any) => React.ReactNode;
}

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const DataTable: React.FC<Prop> = ({
  columns,
  loading,
  data,
  filters = [],
  refetch,
  ActionArea,
  RowActionMenu,
  totalCount,
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const where = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sort: sorting[0]?.desc ? SortType.Desc : SortType.Asc,
    filters: [
      ...filters,
      ...columnFilters.map((f: any) => ({
        key: f.id,
        operator: MatchOperator.Contains,
        value: f.value,
      })),
    ],
  };

  useEffect(() => {
    refetch({ where });
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters]);

  const exportCSV = () => {
    const csv = generateCsv(csvConfig)(data);
    downloadCsvFile(csvConfig)(csv);
  };

  const table = useMantineReactTable({
    columns,
    data,

    state: {
      showProgressBars: loading,
      pagination,
      sorting,
    },
    rowCount: totalCount,

    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    enableRowSelection: false,
    enableColumnOrdering: false,
    enableGlobalFilter: true,
    enableRowNumbers: true,

    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    paginationDisplayMode: "pages",
    initialState: {
      showGlobalFilter: true,
      density: "xs",
    },
    enableRowActions: RowActionMenu ? true : false,
    positionActionsColumn: "last",
    renderRowActionMenuItems: (_row) => RowActionMenu?.(_row?.row?.original),
    renderTopToolbar: () => {
      return (
        <div className="flex justify-between p-2">
          <div className="flex items-center gap-1">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <IconDownload color="gray" size={20} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconPdf style={{ width: rem(18), height: rem(18) }} />}
                >
                  Download Pdf
                </Menu.Item>
                <Menu.Item
                  onClick={exportCSV}
                  icon={<IconCsv style={{ width: rem(18), height: rem(18) }} />}
                >
                  Download Excel
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <Flex gap={"md"}>
            <ActionIcon
              onClick={() => refetch({ where })}
              variant="outline"
              radius={100}
              size={"lg"}
            >
              <IconRefresh
                className={cls({ "animate-reverse-spin": loading })}
              />
            </ActionIcon>
            {ActionArea}
          </Flex>
        </div>
      );
    },
  });
  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
};

export default DataTable;
