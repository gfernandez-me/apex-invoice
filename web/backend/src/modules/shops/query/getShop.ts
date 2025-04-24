import { type Session } from '@shopify/shopify-api'
import { print } from 'graphql'
import {
	GetShopProfileDocument,
	type GetShopProfileQuery,
} from '../../../graphql/generated.js'
import shopify from '../../../lib/shopify.js'
export async function getShop({ session }: { session: Session }) {
	const client = new shopify.api.clients.Graphql({ session })

	const response = await client.request<GetShopProfileQuery>(
		print(GetShopProfileDocument),
	)

	return response.data?.shop
}
