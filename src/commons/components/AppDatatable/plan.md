I need a data table component that can handle various data types and provide features like sorting, filtering, and pagination. The component should be reusable and customizable to fit different use cases across the application.


```tsx
const columns = [
  { accessor: "id", title: "ID", sortable: true },
  { accessor: "name", title: "Name", Filter: (setValue) => <Input placeholder="Search Name" onChange={e => setValue("name", e.target.value)} /> },
  { 
    accessor: (row) => row?.email ?? "N/A", 
    title: "Email", 
    sortKey: "email", // Use sortKey when accessor is a function
    sortable: true 
  },
];

const data = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

<AppDatatable 
  columns={columns} 
  data={data} 
  paginationConfig={{
    pageSize: 10,
    totalItems: data.length,
  }}
  ActionColumn={(row) => <Button>Edit</Button>}
  onRowClick={(row) => console.log(row)}
  onSortChange={(column, direction) => console.log(column, direction)}
  onFilterChange={(column, value) => console.log(column, value)}
  onPaginationChange={(page, pageSize) => console.log(page, pageSize)}
/>
```