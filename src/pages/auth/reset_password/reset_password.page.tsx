// import { Reset__Password__Mutation } from "@/_app/common/modules/auth/utils/query.auth";
// import { Notify } from "@/_app/utils/Notify";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Paper, PasswordInput, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as Yup from "yup";

const ResetPasswordPage = () => {
  //   const [params] = useSearchParams();
  //   const navigate = useNavigate();

  // handle reset password form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    resolver: yupResolver(
      Yup.object().shape({
        password: Yup.string().required().label("Password"),
        confirmPassword: Yup.string()
          .oneOf(
            [Yup.ref("password")],
            "Password and confirm password must match"
          )
          .required()
          .label("Confirm password"),
      })
    ),
  });

  // reset password mutation
  //   const [resetPassword, { loading: resetting_password }] = useMutation(
  //     Reset__Password__Mutation,
  //     Notify({
  //       successTitle: "Password reset successfully!",
  //       successMessage: "Please login using new password.",
  //       errorTitle: "Failed to reset password!",
  //       errorMessage: "Please try again later.",
  //       onSuccess: () => {
  //         navigate("/auth/login");
  //       },
  //     })
  //   );

  //   handle submit form
  const handleOnSubmitForm = () => {
    // resetPassword({
    //   variables: {
    //     input: {
    //       password,
    //       email: params.get("email"),
    //       token: params.get("token"),
    //     },
    //   },
    // });
  };

  return (
    <div className="mx-auto my-20 md:w-4/12">
      <Paper withBorder p={"sm"}>
        <form
          onSubmit={handleSubmit(handleOnSubmitForm)}
          className="flex flex-col gap-2"
        >
          <Input.Wrapper
            label="Password"
            error={<ErrorMessage errors={errors} name="password" />}
          >
            <PasswordInput
              placeholder="New password"
              {...register("password")}
            />
          </Input.Wrapper>

          <Input.Wrapper
            label="Confirm password"
            error={<ErrorMessage errors={errors} name="confirmPassword" />}
          >
            <PasswordInput
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
          </Input.Wrapper>

          {/* <Button loading={resetting_password} type="submit">
            Reset
          </Button> */}

          <Text>
            <Link to={"/auth/forget-password"}>Forget password ?</Link>
          </Text>
        </form>
      </Paper>
    </div>
  );
};

export default ResetPasswordPage;
