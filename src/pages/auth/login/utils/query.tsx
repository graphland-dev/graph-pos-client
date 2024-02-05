import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Identity__login($input: LoginInput!) {
    identity__login(input: $input) {
      accessToken
    }
  }
`;
