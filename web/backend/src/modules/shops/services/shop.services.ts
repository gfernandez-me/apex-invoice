import { type Session } from '@shopify/shopify-api'

import { toShop } from '../mappers/shopMapper.js'
import { getShop } from '../query/getShop.js'
import { saveShop } from '../useCases/saveShop.js'

export async function saveShopService(session: Session) {
	const data = await getShop({ session })

	if (!data) {
		throw new Error('Shop not found')
	}

	const shop = toShop(data)

	await saveShop({ shop })
}
