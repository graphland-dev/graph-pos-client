import {
  MRT_ColumnDef,
  MRT_GlobalFilterTextInput,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import React from "react";

interface Prop {
  columns: MRT_ColumnDef<any>[];
  data: any[];
  ActionArea: React.ReactNode;
  loading: boolean;
}

const DataTable: React.FC<Prop> = ({ columns, loading, data, ActionArea }) => {
  const table = useMantineReactTable({
    state: {
      showSkeletons: loading,
    },
    columns,
    data,
    enableRowSelection: false, //enable some features
    enableColumnOrdering: false,
    enableGlobalFilter: true, //turn off a feature
    enableRowNumbers: true,
    initialState: {
      showGlobalFilter: true,
      density: "xs",
    },
    renderTopToolbar: () => {
      return (
        <div className="flex justify-between p-2">
          <div className="flex gap-1">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
          </div>
          {ActionArea}
        </div>
      );
    },
  });
  return <MantineReactTable table={table} />;
};

export default DataTable;
