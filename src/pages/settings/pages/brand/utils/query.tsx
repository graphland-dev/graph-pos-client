import { gql } from "@apollo/client";

export const SETTING_BRAND_QUERY = gql`
   query Setup__brands {
  setup__brands {
    meta {
      totalCount
    }
    nodes {
      _id
      code
      createdAt
      name
      note
      updatedAt
    }
  }
}

`

export const SETTINGS_BRAND_CREATE_MUTATION = gql`
    mutation Setup__createBrand($body: CreateBrandInput!) {
  setup__createBrand(body: $body) {
    _id
  }
}
`

export const SETTING_BRAND_UPDATE_MUTATION = gql`
mutation Setup__updateBrand($where: CommonFindDocumentDto!, $body: UpdateBrandInput!) {
  setup__updateBrand(where: $where, body: $body)
}

`

export const SETTING_BRAND_DELETE_MUTATION = gql`
mutation Setup__removeBrand($where: CommonFindDocumentDto!) {
  setup__removeBrand(where: $where)
}

`