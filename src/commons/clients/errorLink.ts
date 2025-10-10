import { onError } from "@apollo/client/link/error";

/**
 * Global error link for Apollo Client
 * Handles GraphQL errors and network errors globally
 * Shows notifications for permission/authorization errors at the top
 */
export const errorLink = onError(
  ({ graphQLErrors, networkError, operation }) => {
    console.log("🔴 ErrorLink triggered!");
    console.log("Operation:", operation.operationName);
    console.log("GraphQL Errors:", graphQLErrors);
    console.log("Network Error:", networkError);

    // Handle GraphQL errors (including permission errors)

    // if (graphQLErrors) {
    //   graphQLErrors.forEach((error) => {
    //     const { message, extensions, path } = error;

    //     const errorCode = extensions?.code as string;

    //     // Check if error is permission/authorization related
    //     const isPermissionError =
    //       errorCode === "FORBIDDEN" ||
    //       errorCode === "UNAUTHENTICATED" ||
    //       errorCode === "UNAUTHORIZED" ||
    //       message.toLowerCase().includes("permission") ||
    //       message.toLowerCase().includes("unauthorized") ||
    //       message.toLowerCase().includes("forbidden") ||
    //       message.toLowerCase().includes("not authorized");

    //     if (isPermissionError) {
    //       // Show permission error notification at the top
    //       showNotification({
    //         title: "Permission Denied",
    //         message:
    //           message ||
    //           "You don't have permission to perform this action. Please contact your administrator.",
    //         color: "red",
    //         icon: ErrorIcon,
    //         autoClose: 5000,
    //       });

    //       // Log for debugging
    //       console.error(
    //         `[Permission Error]: ${message}`,
    //         `\nOperation: ${operation.operationName}`,
    //         `\nPath: ${path?.join(" > ")}`,
    //         `\nCode: ${errorCode}`
    //       );
    //     } else {
    //       // Log other GraphQL errors for debugging
    //       console.error(
    //         `[GraphQL Error]: ${message}`,
    //         `\nOperation: ${operation.operationName}`,
    //         `\nPath: ${path?.join(" > ")}`,
    //         `\nCode: ${errorCode}`
    //       );
    //     }
    //   });
    // }

    // // Handle network errors
    // if (networkError) {
    //   console.error(`[Network Error]: ${networkError.message}`);

    //   // Show network error notification
    //   showNotification({
    //     title: "Network Error",
    //     message:
    //       "Unable to connect to the server. Please check your internet connection.",
    //     color: "red",
    //     icon: ErrorIcon,
    //     autoClose: 5000,
    //   });
    // }
  }
);
