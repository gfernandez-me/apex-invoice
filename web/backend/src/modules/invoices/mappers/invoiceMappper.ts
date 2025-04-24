import type * as ShopifyResource from '@apex/shared'
import { FinancialStatus, FulfillmentStatus, type Prisma } from '@prisma/client'
import { mapToLineItemInput } from './lineItemMapper.js'
import { mapMoneyBag } from './moneyMapper.js'
import { mapOrderTaxLine } from './taxLineMapper.js'

export function mapToInvoiceInput(order: ShopifyResource.Order) {
	const {
		order_number,
		admin_graphql_api_id,
		number,
		subtotal_price_set,
		total_price_set,
		total_discounts_set,
		total_shipping_price_set,
		total_tax_set,
		updated_at,
		created_at,
		taxes_included,
		name,
		shipping_address,
		billing_address,
		customer,
		line_items,
		closed_at,
		cancelled_at,
		processed_at,
		email,
		payment_terms,
	} = order
	const financial_status: FinancialStatus | null = order.financial_status
		? FinancialStatus[order.financial_status]
		: null

	const fulfillment_status: FulfillmentStatus | null = order.fulfillment_status
		? FulfillmentStatus[order.fulfillment_status]
		: null

	const note = order.note ?? null

	// const autoShipMetafield =

	const autoShipMetafield = order.metafields?.find((metafield) => {
		return (
			metafield.key === 'as_pad_due_date' && metafield.namespace === 'hydrogen'
		)
	})

	let pad_due_date = payment_terms?.payment_schedules[0]?.due_at
		? new Date(payment_terms?.payment_schedules[0]?.due_at)
		: autoShipMetafield?.value
			? new Date(autoShipMetafield.value)
			: undefined

	return {
		id: order.id.toString(),
		admin_graphql_api_id,
		order_number,
		number,
		name,
		email,
		updated_at,
		created_at,
		note,
		fulfillment_status,
		financial_status,
		taxes_included,
		subtotal_price_set: mapMoneyBag(subtotal_price_set),
		total_discounts_set: mapMoneyBag(total_discounts_set),
		total_shipping_price_set: mapMoneyBag(total_shipping_price_set),
		total_price_set: mapMoneyBag(total_price_set),
		total_tax_set: mapMoneyBag(total_tax_set),
		customer: mapToCustomerInput(customer),
		line_items: line_items.map(mapToLineItemInput),
		shipping_address,
		billing_address,
		tax_lines: order.tax_lines.map(mapOrderTaxLine),
		closed_at,
		cancelled_at,
		processed_at,
		pad_due_date,
	} satisfies Prisma.InvoiceCreateWithoutShopInput
}

function mapToCustomerInput(
	customer?: ShopifyResource.Customer,
): Prisma.CustomerCreateInput | null {
	if (customer) {
		const { email, last_name, first_name, admin_graphql_api_id } = customer
		const shopifyId = admin_graphql_api_id?.match(/(\d+)$/)?.[0]
		return {
			email: email ?? null,
			last_name: last_name ?? null,
			first_name: first_name ?? null,
			shopifyId: shopifyId ?? null,
		}
	}

	return null
}
