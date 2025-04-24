import { type Agenda } from '@hokify/agenda'
import { prisma } from '../../../lib/db/client.js'
import logger from '../../../lib/logger.js'
import { sessionStorage } from '../../../lib/sessionStorage.js'
import { invoiceReconciliation } from '../services/index.js'
import { invoiceReconciliationByIds } from '../services/invoice-reconciliation.service.js'

export const INVOICE_RECONCILIATION_JOB = 'Invoice Reconciliation'
export const INVOICE_RECONCILIATION_BY_ORDER_NUMBER_JOB =
	'Invoice Reconciliation By Order Number'
export function defineInvoiceJobs(agenda: Agenda) {
	agenda.define<{
		sessionId: string
		atMinDate?: Date
		lastInvoiceId?: string
	}>(
		INVOICE_RECONCILIATION_JOB,

		async (job) => {
			const onProgress = async (value: number) => {
				await job.touch(value)
				logger.info(`Progress ${value}`)
			}

			const session = await sessionStorage.loadSession(job.attrs.data.sessionId)

			if (!session) {
				throw Error('Session not found')
			}

			await invoiceReconciliation({
				session,
				log: logger,
				sinceId: job.attrs.data.lastInvoiceId,
				atMinDate: job.attrs.data.atMinDate,
				onProgress,
			})

			const lastInvoice = await prisma.invoice.findFirst({
				select: {
					id: true,
				},
				orderBy: {
					id: 'desc',
				},
			})

			job.attrs.data.lastInvoiceId = lastInvoice?.id
			job.attrs.data.atMinDate = job.attrs.lastFinishedAt
			await job.save()
		},
		{ concurrency: 1 },
	)

	agenda.define<{
		sessionId: string
		ids: string
	}>(
		INVOICE_RECONCILIATION_BY_ORDER_NUMBER_JOB,

		async (job) => {
			const onProgress = async (value: number) => {
				await job.touch(value)
				logger.info(`Progress ${value}`)
			}

			const session = await sessionStorage.loadSession(job.attrs.data.sessionId)

			if (!session) {
				throw Error('Session not found')
			}

			await invoiceReconciliationByIds({
				session,
				log: logger,
				ids: job.attrs.data.ids,
				onProgress,
			})

			await job.save()
		},
		{ concurrency: 1 },
	)
}
