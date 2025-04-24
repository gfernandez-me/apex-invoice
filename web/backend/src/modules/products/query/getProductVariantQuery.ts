import { type Session } from '@shopify/shopify-api'
import { type Shopify } from '../../../lib/shopify.js'

const GetProductVariantQuery = `#graphql
    fragment ExciseType on Metaobject {
      id
      handle
      color: field(key: "color") {
        value
      }
      text_color: field(key: "text_color") {
        value
      }
    }

    query GetProductVariant($id: ID!) {
      productVariant(id: $id) {
        price
        compareAtPrice
        product {
          id
          title
          handle
          exciseType: metafield(namespace: "hydrogen", key: "excise_tax_type") {
            reference {
              ...ExciseType
            }
          }
          msrp1: metafield(namespace: "hydrogen", key: "msrp") {
            type
            value
          }
          msrp2: metafield(namespace: "hydrogen", key: "msrp2") {
            type
            value
          }
       }
     }
}`

//1h in ms
// const productVariantTTL = 60 * 60 * 1000

export function createProductVariantQuery(shopify: Shopify) {
	return async ({ id, session }: { id: string; session: Session }) => {
		const client = new shopify.api.clients.Graphql({ session })

		// let productVariant = lruCache.get(id)?.value as
		// 	| GetProductVariantQuery['productVariant']
		// 	| undefined

		// if (productVariant) {
		// 	return productVariant
		// }

		const response = await client.request(GetProductVariantQuery, {
			variables: {
				id,
			},
			retries: 3,
		})

		if (!response?.data?.productVariant) {
			return
		}

		// lruCache.set(
		// 	id,
		// 	createCacheEntry(
		// 		{ value: response.data.productVariant },
		// 		{ ttl: productVariantTTL },
		// 	),
		// )

		return response.data.productVariant
	}
}
