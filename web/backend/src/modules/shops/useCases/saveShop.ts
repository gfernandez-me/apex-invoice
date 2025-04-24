import { type Prisma } from '@prisma/client'
import { prisma } from '../../../lib/db/client.js'

interface CreateShopInput {
	shop: Prisma.ShopCreateInput
}

export async function saveShop({ shop }: CreateShopInput) {
	const { id, ...update } = shop
	await prisma.shop.upsert({
		where: { id },
		create: shop,
		update: update,
	})
}
