import { type Session } from '@shopify/shopify-api'
import { type Logger } from 'pino'
import shopify from '../../../../lib/shopify.js'

export const ORDERS_LIMIT = 25

export interface PageInfoParams {
	path: string
	query: any
}
export interface PageInfo {
	limit: string
	fields?: string[]
	previousPageUrl?: string
	nextPageUrl?: string
	prevPage?: PageInfoParams
	nextPage?: PageInfoParams
}
interface OrdersQuery {
	updatedAtMin?: string
	sinceId?: string
	pageInfo?: PageInfo
}

interface ByIdsOrdersQuery {
	ids?: string
	pageInfo?: PageInfo
}

export const createPaginatedOrdersQuery = (
	session: Session,
	logger: Logger,
) => {
	async function fetchOrdersWithRetry(
		query: OrdersQuery,
		maxRetries: number = 3,
		initialDelay: number = 1000,
		maxDelay: number = 8000,
	) {
		let attempts = 0
		let delay = initialDelay

		while (attempts < maxRetries) {
			try {
				const orders = await shopify.api.rest.Order.all({
					session,
					...query.pageInfo?.nextPage?.query,
					limit: ORDERS_LIMIT,
					...(query.updatedAtMin && { updated_at_min: query.updatedAtMin }),
					...(query.sinceId && { since_id: query.sinceId }),
					// status: 'any',
				})
				return orders // Return orders if the call is successful
			} catch (err) {
				attempts++
				logger.error({ err })
				if (attempts === maxRetries) {
					throw new Error('All attempts to fetch orders have failed')
				}
				await new Promise((resolve) => setTimeout(resolve, delay)) // Wait for the current delay before retrying
				delay = Math.min(delay * 2, maxDelay) // Double the delay for the next attempt, but do not exceed maxDelay
			}
		}
	}

	return async function* paginateOrders(query: OrdersQuery) {
		do {
			const createdOrdersResponse = await fetchOrdersWithRetry(query)

			const createdOrders = createdOrdersResponse?.data ?? []

			yield createdOrders

			const pageInfo = createdOrdersResponse?.pageInfo

			query = {
				pageInfo,
			}
		} while (query.pageInfo?.nextPage)
	}
}

export const createByIdsOrdersQuery = (session: Session, logger: Logger) => {
	/**
	 * Fetches a single page of orders from Shopify using the provided IDs, which should be
	 * a comma-separated string of order IDs. The function fetches up to 100 orders and does not
	 * implement pagination.
	 *
	 * @param {Session} session - The Shopify session object to authenticate API calls.
	 * @param {Logger} logger - The logging instance to record errors or other important info.
	 * @returns {Promise<Array>} A promise that resolves to an array of orders.
	 */
	async function fetchByIds(
		query: ByIdsOrdersQuery,
		maxRetries: number = 3,
		initialDelay: number = 1000,
		maxDelay: number = 8000,
	) {
		let attempts = 0
		let delay = initialDelay

		while (attempts < maxRetries) {
			try {
				const orders = await shopify.api.rest.Order.all({
					session,
					ids: query.ids,
					status: 'any',
					limit: 10, // Limit the number of orders to 10
				})
				return orders // Return orders if the call is successful
			} catch (err) {
				attempts++
				logger.error({ err })
				if (attempts === maxRetries) {
					throw new Error('All attempts to fetch orders have failed')
				}
				await new Promise((resolve) => setTimeout(resolve, delay)) // Wait for the current delay before retrying
				delay = Math.min(delay * 2, maxDelay) // Double the delay for the next attempt, but do not exceed maxDelay
			}
		}
	}

	return fetchByIds // Return the fetchByIds function directly
}
