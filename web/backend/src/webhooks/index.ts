import { AppWebHooksHandles } from './app.js'
import { GDPRWebhookHandlers } from './gdpr.js'
import { OrdersWebHooksHandles } from './orders.js'

const webhookHandlers = {
	...OrdersWebHooksHandles,
	...GDPRWebhookHandlers,
	...AppWebHooksHandles,
}

export { webhookHandlers }
