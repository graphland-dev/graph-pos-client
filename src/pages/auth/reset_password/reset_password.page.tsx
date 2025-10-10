import { useMutation } from "@apollo/client";
import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Paper, PasswordInput, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { RESET_PASSWORD_MUTATION } from "./utils/query";

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // handle reset password form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    newPassword: string;
    confirmPassword: string;
  }>({
    resolver: yupResolver(
      Yup.object().shape({
        newPassword: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required()
          .label("New Password"),
        confirmPassword: Yup.string()
          .oneOf(
            [Yup.ref("newPassword")],
            "Password and confirm password must match"
          )
          .required()
          .label("Confirm password"),
      })
    ),
  });

  // reset password mutation
  const [resetPassword, { loading: resetting_password }] = useMutation(
    RESET_PASSWORD_MUTATION,
    commonNotifierCallback({
      successTitle: "Password reset successfully!",
      successMessage: "You can now login using your new password.",
      errorMessage: "Failed to reset password. Please try again or request a new reset link.",
      onSuccess: () => {
        navigate("/auth/login");
      },
    })
  );

  // handle submit form
  const handleOnSubmitForm = (data: { newPassword: string; confirmPassword: string }) => {
    const token = params.get("token");
    const email = params.get("email");

    if (!token || !email) {
      return;
    }

    resetPassword({
      variables: {
        input: {
          token,
          email,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
      },
    });
  };

  return (
    <div className="mx-auto my-20 md:w-4/12">
      <Paper withBorder p={"sm"}>
        <form
          onSubmit={handleSubmit(handleOnSubmitForm)}
          className="flex flex-col gap-3"
        >
          <div className="mb-2">
            <Text size="lg" fw={600} className="mb-1">
              Reset Your Password
            </Text>
            <Text size="sm" c="dimmed">
              Please enter your new password below. Make sure it's at least 6 characters long.
            </Text>
          </div>

          <Input.Wrapper
            label="New Password"
            error={<ErrorMessage errors={errors} name="newPassword" />}
          >
            <PasswordInput
              placeholder="Enter new password"
              {...register("newPassword")}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label="Confirm Password"
            error={<ErrorMessage errors={errors} name="confirmPassword" />}
          >
            <PasswordInput
              placeholder="Confirm new password"
              {...register("confirmPassword")}
            />
          </Input.Wrapper>

          <Button loading={resetting_password} type="submit" fullWidth>
            Reset Password
          </Button>

          <Text size="sm" className="text-center">
            Remember your password?{" "}
            <Link to={"/auth/login"} className="text-blue-600 hover:underline">
              Login
            </Link>
          </Text>
        </form>
      </Paper>
    </div>
  );
};

export default ResetPasswordPage;
