import { type Order } from '@apex/shared'
import { type AddHandlersParams, DeliveryMethod } from '@shopify/shopify-api'

import logger from '../lib/logger.js'
import { sessionStorage } from '../lib/sessionStorage.js'
import shopify from '../lib/shopify.js'
import {
	handleOrderCreatedWebhook,
	handleOrderUpdatedWebhook,
} from '../modules/invoices/services/index.js'

export const OrdersWebHooksHandles: AddHandlersParams = {
	ORDERS_CREATE: {
		metafieldNamespaces: ['edit-order', 'hydrogen'],
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: '/api/webhooks',
		callback: async (topic, shop, body, webhookId) => {
			logger.info(`Webhook callback ${topic}`)
			const offlineSessionId = await shopify.api.session.getOfflineId(shop)
			const session = await sessionStorage.loadSession(offlineSessionId)
			if (!session) {
				logger.error('Session not found')
				return
			}

			logger.info(`Processing order created webhook: ${webhookId}`)

			const order = JSON.parse(body) as Order
			const webhook = { id: webhookId, topic }

			handleOrderCreatedWebhook({
				session,
				order,
				webhook,
			})
		},
	},

	ORDERS_UPDATED: {
		metafieldNamespaces: ['edit-order', 'hydrogen'],
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: '/api/webhooks',
		callback: async (topic, shop, body, webhookId) => {
			logger.info(`Webhook callback ${topic}`)
			const offlineSessionId = await shopify.api.session.getOfflineId(shop)
			const session = await sessionStorage.loadSession(offlineSessionId)
			if (!session) {
				logger.error('Session not found')
				return
			}
			const order = JSON.parse(body) as Order

			const webhook = { id: webhookId, topic }

			handleOrderUpdatedWebhook({
				session,
				order,
				webhook,
			})
		},
	},
}
