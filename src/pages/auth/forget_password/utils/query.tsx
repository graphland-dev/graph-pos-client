import { gql } from "@apollo/client";

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation Identity__forgotPassword($input: ForgotPasswordInput!) {
    identity__forgotPassword(input: $input)
  }
`;
