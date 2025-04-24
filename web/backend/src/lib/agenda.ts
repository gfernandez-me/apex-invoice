import { Agenda } from '@hokify/agenda'
import { defineInvoiceJobs } from '../modules/invoices/jobs/reconciliation-job.js'
import logger from './logger.js'

const agenda = new Agenda({
	db: { address: process.env.DATABASE_URL as string },
})
	.on('start', (job) => {
		logger.info(`Job <${job.attrs.name}> starting`)
	})
	.on('success', (job) => {
		logger.info(`Job <${job.attrs.name}> succeeded`)
	})
	.on('fail', (error, job) => {
		logger.error({ err: `Job <${job.attrs.name}> failed: ${error}` })
	})

defineInvoiceJobs(agenda)

export { agenda }
