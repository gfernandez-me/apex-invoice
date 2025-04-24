import { type Session } from '@shopify/shopify-api'
import shopify from '../../../../lib/shopify.js'

export async function countOrders(
	session: Session,
	query: { updatedAtMin?: string; sinceId?: string },
): Promise<number> {
	return await shopify.api.rest.Order.count({
		session,
		updated_at_min: query.updatedAtMin,
		...(query.sinceId && { since_id: query.sinceId }),
		status: 'any',
	}).then((value) => (value as { count: number }).count)
}
