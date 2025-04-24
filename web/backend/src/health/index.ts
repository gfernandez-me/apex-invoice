import { type Server } from 'node:http'
import { createTerminus } from '@godaddy/terminus'
import { type PrismaClient } from '@prisma/client'
import { type Logger } from 'pino'
import { agenda } from '../lib/agenda.js'
import { browser } from '../lib/puppeteer.js'

export default function createHealthCheck({
	server,
	logger,
	prisma,
}: {
	server: Server
	logger: Logger
	prisma: PrismaClient
}) {
	const onSignal = () => {
		logger.info('server is starting cleanup')
		return prisma
			.$disconnect()
			.catch((err) => logger.error('error during disconnection', err.stack))
	}

	const onShutdown = () => {
		logger.info('cleanup finished, server is shutting down')

		return Promise.all([browser.close(), prisma.$disconnect(), agenda.stop()])
	}

	async function onHealthCheck() {
		return prisma
			.$runCommandRaw({ hello: 1 })
			.then((value) => value.status)
			.catch((err) => {
				logger.error(err)
				throw err
			})
	}

	return createTerminus(server, {
		logger: logger.error.bind(logger),
		useExit0: true,
		onShutdown,
		onSignal,
		healthChecks: {
			'/health/readiness': onHealthCheck,
			'/health/liveness': onHealthCheck,
		},
	})
}
