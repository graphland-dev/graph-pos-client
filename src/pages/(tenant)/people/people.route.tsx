import DashboardLayout from "@/_app/common/layouts/DashboardLayout";
import { Navigate, RouteObject } from "react-router-dom";
import ClientPage from "./pages/client/client.page";
import Departments from "./pages/employees/departments/departments.page";
import Employees from "./pages/employees/employees/employees.page";
import Increments from "./pages/employees/increments/increments.page";
import SuppliersPage from "./pages/suppliers/suppliers.page";
import { peopleNavlinks } from "./people.navlinks";

export const peopleModuleRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout navlinks={peopleNavlinks} title="People" path="people" />
    ),
    children: [
      {
        path: "",
        element: <Navigate to={"client"} />,
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
    ],
  },
];
