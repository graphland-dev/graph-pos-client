import { RouteObject } from "react-router-dom";
import ClientPage from "./pages/client/client.page";
import Suppliers from "./pages/suppliers/suppliers.page";
import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { peopleNavlinks } from "./people.navlinks";
import Departments from "./pages/employees/departments/departments.page";
import Increments from "./pages/employees/increments/increments.page";
import Employees from "./pages/employees/employees/employees.page";

export const peopleModuleRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout navlinks={peopleNavlinks} title="People" path="people" />
    ),
    children: [
      {
        path: "client",
        element: <ClientPage />,
      },
      {
        path: "suppliers",
        element: <Suppliers />,
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
    ],
  },
];
