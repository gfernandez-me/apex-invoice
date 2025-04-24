import type * as ShopifyResource from '@apex/shared'
import { type Session } from '@shopify/shopify-api'
import { mapToInvoiceInput } from '../mappers/invoiceMappper.js'
import { ceateInvoice } from '../usecases/handleCeateInvoiceWebhook.js'
import { upsertInvoice } from '../usecases/updateInvoice.js'
import { addInvoiceMetadatas } from './addInvoiceMetadatas.js'

interface InvoiceArgs {
	order: ShopifyResource.Order
	webhook: { id: string; topic: string }
	session: Session
}

export async function handleOrderCreatedWebhook({
	order,
	webhook,
	session,
}: InvoiceArgs) {
	const invoice = mapToInvoiceInput(order)

	await addInvoiceMetadatas(session, invoice)

	await ceateInvoice({ invoice, webhook, shopHost: session.shop })
}

export async function handleOrderUpdatedWebhook({
	order,
	webhook,
	session,
}: InvoiceArgs) {
	const invoice = mapToInvoiceInput(order)

	await addInvoiceMetadatas(session, invoice)

	await upsertInvoice({ invoice, webhook, shopHost: session.shop })
}
