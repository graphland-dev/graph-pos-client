import { gql } from "@apollo/client";

export const SETTINGS_VAT_QUERY = gql`
query Setup__vats {
  setup__vats {
    meta {
      totalCount
    }
    nodes {
      _id
      createdAt
      updatedAt
    }
  }
}

`

export const SETTINGS_VAT_CREATE_MUTATION = gql `
    mutation CreateVatMutation($body: CreateVatInput!) {
  setup__createVat(body: $body) {
    _id
  }
}
`