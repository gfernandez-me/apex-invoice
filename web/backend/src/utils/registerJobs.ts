import { type Session } from '@shopify/shopify-api'
import { agenda } from '../lib/agenda.js'
import { INVOICE_RECONCILIATION_JOB } from '../modules/invoices/jobs/reconciliation-job.js'

export async function registerJobs(session: Session) {
	await agenda.every('1 day', INVOICE_RECONCILIATION_JOB, {
		sessionId: session.id,
	})
}
