/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GET_USER_QUERIES($tenant: String!) {\n    identity__me {\n      _id\n      email\n      name\n      memberships {\n        tenant\n        roles\n      }\n      avatar {\n        meta\n        path\n        provider\n      }\n    }\n    identity__myPermissions(tenant: $tenant) {\n      collectionName\n      actions\n    }\n\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        address\n        businessPhoneNumber\n        description\n        createdAt\n        logo {\n          meta\n          path\n          provider\n        }\n      }\n    }\n  }\n": types.Get_User_QueriesDocument,
    "\n   query Setup__brands {\n  setup__brands {\n    meta {\n      totalCount\n    }\n    nodes {\n      _id\n      code\n      createdAt\n      name\n      note\n      updatedAt\n    }\n  }\n}\n\n": types.Setup__BrandsDocument,
    "\n    mutation Setup__createBrand($body: CreateBrandInput!) {\n  setup__createBrand(body: $body) {\n    _id\n  }\n}\n": types.Setup__CreateBrandDocument,
    "\nmutation Setup__updateBrand($where: CommonFindDocumentDto!, $body: UpdateBrandInput!) {\n  setup__updateBrand(where: $where, body: $body)\n}\n\n": types.Setup__UpdateBrandDocument,
    "\nmutation Setup__removeBrand($where: CommonFindDocumentDto!) {\n  setup__removeBrand(where: $where)\n}\n\n": types.Setup__RemoveBrandDocument,
    "\n  mutation Identity__login($input: LoginInput!) {\n    identity__login(input: $input) {\n      accessToken\n    }\n  }\n": types.Identity__LoginDocument,
    "\n  query Identity__myTenants {\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        createdAt\n      }\n    }\n  }\n": types.Identity__MyTenantsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GET_USER_QUERIES($tenant: String!) {\n    identity__me {\n      _id\n      email\n      name\n      memberships {\n        tenant\n        roles\n      }\n      avatar {\n        meta\n        path\n        provider\n      }\n    }\n    identity__myPermissions(tenant: $tenant) {\n      collectionName\n      actions\n    }\n\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        address\n        businessPhoneNumber\n        description\n        createdAt\n        logo {\n          meta\n          path\n          provider\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GET_USER_QUERIES($tenant: String!) {\n    identity__me {\n      _id\n      email\n      name\n      memberships {\n        tenant\n        roles\n      }\n      avatar {\n        meta\n        path\n        provider\n      }\n    }\n    identity__myPermissions(tenant: $tenant) {\n      collectionName\n      actions\n    }\n\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        address\n        businessPhoneNumber\n        description\n        createdAt\n        logo {\n          meta\n          path\n          provider\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n   query Setup__brands {\n  setup__brands {\n    meta {\n      totalCount\n    }\n    nodes {\n      _id\n      code\n      createdAt\n      name\n      note\n      updatedAt\n    }\n  }\n}\n\n"): (typeof documents)["\n   query Setup__brands {\n  setup__brands {\n    meta {\n      totalCount\n    }\n    nodes {\n      _id\n      code\n      createdAt\n      name\n      note\n      updatedAt\n    }\n  }\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Setup__createBrand($body: CreateBrandInput!) {\n  setup__createBrand(body: $body) {\n    _id\n  }\n}\n"): (typeof documents)["\n    mutation Setup__createBrand($body: CreateBrandInput!) {\n  setup__createBrand(body: $body) {\n    _id\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Setup__updateBrand($where: CommonFindDocumentDto!, $body: UpdateBrandInput!) {\n  setup__updateBrand(where: $where, body: $body)\n}\n\n"): (typeof documents)["\nmutation Setup__updateBrand($where: CommonFindDocumentDto!, $body: UpdateBrandInput!) {\n  setup__updateBrand(where: $where, body: $body)\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation Setup__removeBrand($where: CommonFindDocumentDto!) {\n  setup__removeBrand(where: $where)\n}\n\n"): (typeof documents)["\nmutation Setup__removeBrand($where: CommonFindDocumentDto!) {\n  setup__removeBrand(where: $where)\n}\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Identity__login($input: LoginInput!) {\n    identity__login(input: $input) {\n      accessToken\n    }\n  }\n"): (typeof documents)["\n  mutation Identity__login($input: LoginInput!) {\n    identity__login(input: $input) {\n      accessToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Identity__myTenants {\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        createdAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query Identity__myTenants {\n    identity__myTenants {\n      nodes {\n        _id\n        name\n        uid\n        createdAt\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;