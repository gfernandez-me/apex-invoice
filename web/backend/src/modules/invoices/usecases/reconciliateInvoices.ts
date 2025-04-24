import { type Prisma } from '@prisma/client'
import { prisma } from '../../../lib/db/client.js'
import logger from '../../../lib/logger.js'

interface ReconciliateInvoiceInvoiceInput {
	invoices: Prisma.InvoiceCreateWithoutShopInput[]
	shopHost: string
}

export async function reconciliateInvoices({
	invoices,
	shopHost,
}: ReconciliateInvoiceInvoiceInput) {
	const shop = await prisma.shop.findUnique({
		where: { shopify_domain: shopHost },
		select: { id: true },
	})
	console.log('reconciliateInvoices')

	if (!shop) {
		throw new Error('Shop not found')
	}

	for (const invoice of invoices) {
		const { id, ...update } = invoice

		try {
			await prisma.invoice.upsert({
				where: { id },
				create: { ...invoice, shopId: shop.id },
				update: update,
			})
		} catch (e) {
			logger.error(e)
			logger.warn(`Skipping invoice ${id} due to error`)
		}
	}
}
