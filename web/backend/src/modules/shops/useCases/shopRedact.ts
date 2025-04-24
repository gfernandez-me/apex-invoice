import { prisma } from '../../../lib/db/client.js'

export interface ShopRedact {
	shop_id: number
	shop_domain: string
}

export async function shopRedact({ shop_id }: ShopRedact) {
	await prisma.invoice.deleteMany({ where: { shopId: shop_id.toString() } })
	await prisma.shop.delete({ where: { id: shop_id.toString() } })
}
