import { DeliveryMethod } from '@shopify/shopify-api'
import { type WebhookHandlersParam } from '@shopify/shopify-app-express'
import {
	type ShopRedact,
	shopRedact,
} from '../modules/shops/useCases/shopRedact.js'

const GDPRWebhookHandlers: WebhookHandlersParam = {
	/**
	 * Customers can request their data from a store owner. When this happens,
	 * Shopify invokes this webhook.
	 *
	 * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
	 */
	CUSTOMERS_DATA_REQUEST: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: '/api/webhooks',
		callback: async (_topic, _shop, _body, _webhookId) => {
			// Payload has the following shape:
			// {
			//   "shop_id": 954889,
			//   "shop_domain": "{shop}.myshopify.com",
			//   "orders_requested": [
			//     299938,
			//     280263,
			//     220458
			//   ],
			//   "customer": {
			//     "id": 191167,
			//     "email": "john@example.com",
			//     "phone": "555-625-1199"
			//   },
			//   "data_request": {
			//     "id": 9999
			//   }
			// }
		},
	},

	/**
	 * Store owners can request that data is deleted on behalf of a customer. When
	 * this happens, Shopify invokes this webhook.
	 *
	 * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-redact
	 */
	CUSTOMERS_REDACT: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: '/api/webhooks',
		callback: async (_topic, _shop, _body, _webhookId) => {
			// Payload has the following shape:
			// {
			//   "shop_id": 954889,
			//   "shop_domain": "{shop}.myshopify.com",
			//   "customer": {
			//     "id": 191167,
			//     "email": "john@example.com",
			//     "phone": "555-625-1199"
			//   },
			//   "orders_to_redact": [
			//     299938,
			//     280263,
			//     220458
			//   ]
			// }
		},
	},

	/**
	 * 48 hours after a store owner uninstalls your app, Shopify invokes this
	 * webhook.
	 *
	 * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact
	 */
	SHOP_REDACT: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: '/api/webhooks',
		callback: async (_topic, _shop, body, _webhookId) => {
			const payload = JSON.parse(body) as ShopRedact
			shopRedact(payload)
		},
	},
}

export { GDPRWebhookHandlers }
