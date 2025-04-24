/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type GetShopProfileQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type GetShopProfileQuery = { shop: (
    Pick<AdminTypes.Shop, 'id' | 'url' | 'myshopifyDomain' | 'email' | 'name' | 'contactEmail' | 'currencyCode'>
    & { primaryDomain: Pick<AdminTypes.Domain, 'host'>, billingAddress: Pick<AdminTypes.ShopAddress, 'address1' | 'address2' | 'city' | 'provinceCode' | 'country' | 'phone' | 'countryCodeV2' | 'latitude' | 'longitude' | 'province' | 'zip'> }
  ) };

export type ExciseProductsQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type ExciseProductsQuery = { productVariants: { edges: Array<{ node: (
        Pick<AdminTypes.ProductVariant, 'id' | 'weight' | 'sku' | 'availableForSale' | 'compareAtPrice' | 'displayName' | 'title' | 'taxable'>
        & { product: Pick<AdminTypes.Product, 'title'> }
      ) }> } };

export type ExciseTypeFragment = (
  Pick<AdminTypes.Metaobject, 'id' | 'handle'>
  & { color?: AdminTypes.Maybe<Pick<AdminTypes.MetaobjectField, 'value'>>, text_color?: AdminTypes.Maybe<Pick<AdminTypes.MetaobjectField, 'value'>> }
);

export type GetProductVariantQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetProductVariantQuery = { productVariant?: AdminTypes.Maybe<(
    Pick<AdminTypes.ProductVariant, 'price' | 'compareAtPrice'>
    & { product: (
      Pick<AdminTypes.Product, 'id' | 'title' | 'handle'>
      & { exciseType?: AdminTypes.Maybe<{ reference?: AdminTypes.Maybe<(
          Pick<AdminTypes.Metaobject, 'id' | 'handle'>
          & { color?: AdminTypes.Maybe<Pick<AdminTypes.MetaobjectField, 'value'>>, text_color?: AdminTypes.Maybe<Pick<AdminTypes.MetaobjectField, 'value'>> }
        )> }> }
    ) }
  )> };

interface GeneratedQueryTypes {
  "query GetShopProfile {\n  shop {\n    id\n    url\n    primaryDomain {\n      host\n    }\n    myshopifyDomain\n    email\n    name\n    contactEmail\n    currencyCode\n    billingAddress {\n      address1\n      address2\n      city\n      provinceCode\n      country\n      phone\n      countryCodeV2\n      latitude\n      longitude\n      province\n      zip\n    }\n  }\n}": {return: GetShopProfileQuery, variables: GetShopProfileQueryVariables},
  "#graphql\n  query ExciseProducts {\n    productVariants(first: 20, query: \"sku:>=excise AND sku:<=excise-ZZ\") {\n      edges {\n        node {\n          product {\n            title\n          }\n          id\n          weight\n          sku\n          availableForSale\n          compareAtPrice\n          displayName\n          title\n          taxable\n        }\n      }\n    }\n}": {return: ExciseProductsQuery, variables: ExciseProductsQueryVariables},
  "#graphql\n\n    fragment ExciseType on Metaobject {\n      id\n      handle\n      color: field(key: \"color\") {\n        value\n      }\n      text_color: field(key: \"text_color\") {\n        value\n      }\n    }\n\n    query GetProductVariant($id: ID!) {\n      productVariant(id: $id) {\n        price\n        compareAtPrice\n        product {\n          id\n          title\n          handle\n          exciseType: metafield(namespace: \"hydrogen\", key: \"excise_tax_type\") {\n            reference {\n              ...ExciseType\n            }\n         }\n       }\n     }\n}": {return: GetProductVariantQuery, variables: GetProductVariantQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
