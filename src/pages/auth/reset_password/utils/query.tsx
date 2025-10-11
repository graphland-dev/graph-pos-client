import { gql } from "@apollo/client";

export const RESET_PASSWORD_MUTATION = gql`
  mutation Identity__resetPassword($input: ResetPasswordInput!) {
    identity__resetPassword(input: $input)
  }
`;
