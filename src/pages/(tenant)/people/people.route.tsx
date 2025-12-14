import { RouteObject } from "react-router-dom";
import PeopleModuleRoot from "./module-root.page";
import ClientPage from "./pages/client/client.page";
import Departments from "./pages/employees/departments/departments.page";
import Employees from "./pages/employees/employees/employees.page";
import Increments from "./pages/employees/increments/increments.page";
import SuppliersPage from "./pages/suppliers/suppliers.page";

export const peopleModuleRouter: RouteObject[] = [
  {
    path: "",
    element: <PeopleModuleRoot />,
  },
  {
    path: "client",
    element: <ClientPage />,
  },
  {
    path: "suppliers",
    element: <SuppliersPage />,
  },
  {
    path: "employees",
    children: [
      {
        path: "departments",
        element: <Departments />,
      },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "increments",
        element: <Increments />,
      },
    ],
  },
];
