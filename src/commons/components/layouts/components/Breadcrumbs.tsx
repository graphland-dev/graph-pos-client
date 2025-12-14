import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/commons/shadcn/components/ui/breadcrumb";
import { useParams } from "react-router-dom";

export function Breadcrumbs() {
  const location = useLocation();
  const params = useParams<{ tenant: string }>();

  const pathnames = location.pathname.split("/").filter((x) => x);

  // Remove tenant from breadcrumbs
  const filteredPathnames = pathnames.filter((path) => path !== params.tenant);

  const getBreadcrumbLabel = (path: string) => {
    // Convert path to readable label
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (filteredPathnames.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {filteredPathnames.map((path, index) => {
          const isLast = index === filteredPathnames.length - 1;
          const to = `/${params.tenant}/${filteredPathnames.slice(0, index + 1).join("/")}`;

          return (
            <React.Fragment key={path}>
              {isLast ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumbLabel(path)}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={to}>{getBreadcrumbLabel(path)}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

