import { RouteObject } from "react-router-dom";
import LoginPage from "./login/login.page";
import ForgetPasswordPage from "./forget_password/forget_password.page";
import ResetPasswordPage from "./reset_password/reset_password.page";

export const authRouter: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "forget-password",
    element: <ForgetPasswordPage />,
  },
  {
    path: "reset-password",
    element: <ResetPasswordPage />,
  },
];
