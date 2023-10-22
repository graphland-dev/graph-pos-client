import { gql } from "@apollo/client";

export const SETTINGS_VAT_QUERY = gql`
query Setup__vats {
  setup__vats {
    meta {
      totalCount
    }
    nodes {
      code
      name
      note
      percentage
      updatedAt
      createdAt
      _id
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

export const SETTINGS_VAT_UPDATE_MUTATION = gql `
  mutation Setup__updateVat($where: CommonFindDocumentDto!, $body: UpdateVatInput!) {
  setup__updateVat(where: $where, body: $body)
}

`
export const SETTING_VAT_REMOVE_MUTATION = gql`
 mutation Setup__removeVat($where: CommonFindDocumentDto!) {
  setup__removeVat(where: $where)
}
`