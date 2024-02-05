// import { Forgot__Password__Mutation } from "@/_app/common/modules/auth/utils/query.auth";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Paper, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as Yup from "yup";

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
  //   const [sendRequest, { loading: sending__request }] = useMutation(
  //     Forgot__Password__Mutation,
  //     Notify({
  //       successTitle: "Reset Password has been sent to your email!",
  //       successMessage: "Please check your email inbox.",
  //       errorTitle: "Failed to send reset password to your email!",
  //       errorMessage: "Please try again later.",
  //     })
  //   );

  const handleOnSubmitForm = () => {
    // sendRequest({
    //   variables: {
    //     input: {
    //       email,
    //       clientUrl: import.meta.env.VITE_API,
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
            label="Email"
            error={<ErrorMessage errors={errors} name="email" />}
          >
            <Input {...register("email")} />
          </Input.Wrapper>

          {/* <Button loading={sending__request} type="submit">
            Continue
          </Button> */}

          <Text>
            Back to <Link to={"/auth/login"}>Login</Link>
          </Text>
        </form>
      </Paper>
    </div>
  );
};

export default ForgetPasswordPage;

// can('accounting__Transfer', ['*', 'update'])
