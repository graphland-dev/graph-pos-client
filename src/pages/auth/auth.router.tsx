import { RouteObject } from "react-router-dom";
import ForgetPasswordPage from "./forget_password/forget_password.page";
import LoginPage from "./login/login.page";
import ResetPasswordPage from "./reset_password/reset_password.page";
import MyProfilePage from "./my_profile/profile.page";

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
  {
    path: "my-profile",
    element: <MyProfilePage />,
  },
];
