import { type AddHandlersParams, DeliveryMethod } from '@shopify/shopify-api'
import { agenda } from '../lib/agenda.js'
import logger from '../lib/logger.js'
import { INVOICE_RECONCILIATION_JOB } from '../modules/invoices/jobs/reconciliation-job.js'

export const AppWebHooksHandles: AddHandlersParams = {
	APP_UNINSTALLED: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: '/api/webhooks',
		callback: async (topic) => {
			logger.info(`Webhook callback ${topic}`)
			agenda.cancel({ name: INVOICE_RECONCILIATION_JOB })
		},
	},
}
