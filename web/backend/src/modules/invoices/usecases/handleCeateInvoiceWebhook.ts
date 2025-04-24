import { type Prisma } from '@prisma/client'
import { prisma } from '../../../lib/db/client.js'
import logger from '../../../lib/logger.js'

interface CreateInvoiceInput {
	invoice: Prisma.InvoiceCreateWithoutShopInput
	webhook?: Prisma.ShopifyWebhookCreateInput
	shopHost: string
}

export async function ceateInvoice({
	invoice,
	webhook,
	shopHost,
}: CreateInvoiceInput) {
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

	if (await prisma.invoice.findFirst({ where: { id: invoice.id } })) {
		logger.warn({ id: invoice.id }, 'Invoice duplicated, ignoring invoice')
		return
	}

	await prisma.invoice.create({
		data: {
			...invoice,
			...(webhook && {
				shopifyWebhooks: { create: webhook },
			}),
			shopId: shop.id,
		},
	})
}
