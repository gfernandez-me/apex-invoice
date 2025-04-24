import { type Prisma } from '@prisma/client'
import { prisma } from '../../../lib/db/client.js'
import logger from '../../../lib/logger.js'

interface UpdateInvoiceInput {
	invoice: Prisma.InvoiceCreateWithoutShopInput
	webhook?: Prisma.ShopifyWebhookCreateInput
	shopHost: string
}

export async function upsertInvoice({
	invoice: { id, ...invoice },
	webhook,
	shopHost,
}: UpdateInvoiceInput) {
	const shop = await prisma.shop.findUnique({
		where: { shopify_domain: shopHost },
		select: { id: true },
	})

	if (!shop) {
		throw new Error('Shop not found')
	}

	if (
		webhook &&
		(await prisma.shopifyWebhook.findFirst({ where: { id: webhook.id } }))
	) {
		logger.warn({ id: webhook.id }, 'Webhook duplicated, ignoring invoice')
		return
	}

	await prisma.invoice.upsert({
		where: { id: id },
		update: {
			...invoice,
			shopifyWebhooks: { create: webhook },
		},
		create: {
			id,
			...invoice,
			shopId: shop.id,
			...(webhook && {
				shopifyWebhooks: { create: webhook },
			}),
		},
	})
}
