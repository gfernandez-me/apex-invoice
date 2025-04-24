import type * as ShopifyResource from '@apex/shared'
import { type Session } from '@shopify/shopify-api'
import { type Logger } from 'pino'
import { mapToInvoiceInput } from '../mappers/invoiceMappper.js'
import { reconciliateInvoices } from '../usecases/reconciliateInvoices.js'
import { addInvoiceMetadatas } from './addInvoiceMetadatas.js'
import { countOrders } from './shopify/ordersCountQuery.js'
import {
	createByIdsOrdersQuery,
	createPaginatedOrdersQuery,
	ORDERS_LIMIT,
} from './shopify/ordersQuery.js'

interface InvoiceReconciliationArgs {
	session: Session
	log: Logger
	atMinDate?: Date
	sinceId?: string
	onProgress?: (value: number) => void
}
interface InvoiceReconciliationByOrderNumberArgs {
	session: Session
	log: Logger
	ids: string
	onProgress?: (value: number) => void
}

function defaultMinDate() {
	const xDaysEarlier = new Date()
	xDaysEarlier.setDate(xDaysEarlier.getDate() - 1)
	return xDaysEarlier
}

export async function invoiceReconciliation({
	session,
	log,
	atMinDate = defaultMinDate(),
	sinceId,
	onProgress = () => ({}),
}: InvoiceReconciliationArgs) {
	const childLog = log.child({ job: 'Invoice Reconciliation' })

	const paginateOrders = createPaginatedOrdersQuery(session, childLog)

	const atMin = atMinDate.toISOString()

	childLog.info(`Starting reconciliation at ${atMin}, sinceId ${sinceId}`)

	const orderCounts = await countOrders(session, {
		updatedAtMin: atMin,
		sinceId,
	})

	childLog.info(`Order counts ${orderCounts}`)

	const ordersGenerator = await paginateOrders({
		updatedAtMin: atMin,
		sinceId,
	})

	const steps = orderCounts / ORDERS_LIMIT
	let currentStep = 0

	for await (const orders of ordersGenerator) {
		const invoices = orders
			.map((order) => order.serialize() as ShopifyResource.Order)
			.map(mapToInvoiceInput)

		await Promise.all(
			invoices.map(
				async (invoice) => await addInvoiceMetadatas(session, invoice),
			),
		)

		await reconciliateInvoices({ invoices, shopHost: session.shop })

		onProgress(Math.min((++currentStep / steps) * 100, 100))
	}
	childLog.debug('Finished')
}

/**
 * Performs invoice reconciliation for a specific set of order IDs.
 * This function fetches orders based on the provided IDs, processes them into invoices,
 * adds metadata to each invoice, and optionally saves them. It also sets the progress
 * to 100% upon completion, which can be used to update UI elements or trigger other
 * notifications.
 *
 * @param {InvoiceReconciliationByOrderNumberArgs} args - The arguments required for the function:
 *   - session: The Shopify session object to authenticate API calls.
 *   - log: The logging instance to record errors or other important info.
 *   - ids: A comma-separated string of order IDs to fetch and process.
 *   - onProgress: An optional callback to report the progress of the operation.
 */
export async function invoiceReconciliationByIds({
	session,
	log,
	ids,
	onProgress = () => ({}),
}: InvoiceReconciliationByOrderNumberArgs) {
	const childLog = log.child({ job: 'Invoice Reconciliation' })

	const byIdsOrders = createByIdsOrdersQuery(session, childLog)

	childLog.info(`Starting reconciliation for IDs: ${ids}`)

	const orders = await byIdsOrders({ ids })

	const invoices = orders?.data.map((order) => {
		const serializedOrder = order.serialize() as ShopifyResource.Order
		return mapToInvoiceInput(serializedOrder)
	})

	if (!invoices) {
		throw new Error('No invoices found')
	}

	await Promise.all(
		invoices.map(async (invoice) => {
			await addInvoiceMetadatas(session, invoice)
		}),
	)

	// Reconciliation can be performed here if necessary
	await reconciliateInvoices({ invoices, shopHost: session.shop })

	onProgress(100) // Set progress to 100% after all operations are complete
	childLog.debug('Finished')
}
