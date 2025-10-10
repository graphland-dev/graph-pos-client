import { useMutation } from "@apollo/client";
import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Paper, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { FORGOT_PASSWORD_MUTATION } from "./utils/query";

const ForgetPasswordPage = () => {
  // handle forget password form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
  }>({
    resolver: yupResolver(
      Yup.object().shape({
        email: Yup.string().email().required().label("Email"),
      })
    ),
  });

  // forget password mutation
  const [sendRequest, { loading: sending__request }] = useMutation(
    FORGOT_PASSWORD_MUTATION,
    commonNotifierCallback({
      successTitle: "Reset password link sent!",
      successMessage: "Please check your email inbox for the reset link.",
      errorMessage: "Failed to send reset password link. Please try again.",
    })
  );

  const handleOnSubmitForm = (data: { email: string }) => {
    const resetClientUrl = `${window.location.origin}/auth/reset-password?token=RESET_TOKEN&email=${data.email}`;

    sendRequest({
      variables: {
        input: {
          email: data.email,
          resetClientUrl,
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
              Forgot Password?
            </Text>
            <Text size="sm" c="dimmed">
              Enter your email address and we'll send you a link to reset your
              password.
            </Text>
          </div>

          <Input.Wrapper
            label="Email"
            error={<ErrorMessage errors={errors} name="email" />}
          >
            <Input
              placeholder="Enter your email address"
              {...register("email")}
            />
          </Input.Wrapper>

          <Button loading={sending__request} type="submit" fullWidth>
            Send Reset Link
          </Button>

          <Text size="sm" className="text-center">
            Back to{" "}
            <Link to={"/auth/login"} className="text-blue-600 hover:underline">
              Login
            </Link>
          </Text>
        </form>
      </Paper>
    </div>
  );
};

export default ForgetPasswordPage;
