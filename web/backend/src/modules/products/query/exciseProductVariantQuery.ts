import { type Session } from '@shopify/shopify-api'
import { type GetFvtProductQuery } from '../../../graphql/generated.js'
import { createCacheEntry, lruCache } from '../../../lib/cache.js'
import { type Shopify } from '../../../lib/shopify.js'

const GetExciseProductsQuery = `#graphql
  query ExciseProducts {
    productVariants(first: 20, query: "sku:>=excise AND sku:<=excise-ZZ") {
      edges {
        node {
          product {
            title
          }
          id
          sku
          availableForSale
          compareAtPrice
          displayName
          title
          taxable
        }
      }
    }
}`

export type ExciseProductsVariant =
	GetFvtProductQuery['productVariants']['edges'][number]['node']

export type ExciseProductsVariantEdges =
	GetFvtProductQuery['productVariants']['edges']

export interface ExciseProductsQueryArgs {
	session: Session
}

// 1 day in milliseconds
const exciseTTL = 24 * 60 * 60 * 1000

export function createExciseProductsQuery(shopify: Shopify) {
	return async ({ session }: ExciseProductsQueryArgs) => {
		let exciseVariants = lruCache.get('exciseVariants')?.value as Record<
			string,
			ExciseProductsVariant
		>
		if (exciseVariants) {
			return exciseVariants
		}
		const client = new shopify.api.clients.Graphql({ session })
		const response = await client.request(GetExciseProductsQuery, {
			retries: 3,
		})
		let exciseProductsBySku: Record<string, ExciseProductsVariant> = {}
		if (response.data?.productVariants.edges) {
			for (const { node } of response.data.productVariants.edges) {
				if (node.sku) {
					exciseProductsBySku[node.sku] = node
				}
			}
		}

		lruCache.set(
			'exciseProducts',
			createCacheEntry(exciseProductsBySku, {
				ttl: exciseTTL,
			}),
		)
		return exciseProductsBySku
	}
}
