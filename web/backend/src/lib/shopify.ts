import { ApiVersion, type LogFunction, LogSeverity } from '@shopify/shopify-api'

import { restResources } from '@shopify/shopify-api/rest/admin/2024-04'
import { shopifyApp } from '@shopify/shopify-app-express'
import { type Level } from 'pino'
import logger from './logger.js'
import { sessionStorage } from './sessionStorage.js'

const PinoLevelToSeverityLookup: {
	[k in Level]: LogSeverity
} & Record<string, LogSeverity | undefined> = {
	trace: LogSeverity.Debug,
	debug: LogSeverity.Debug,
	info: LogSeverity.Info,
	warn: LogSeverity.Warning,
	error: LogSeverity.Error,
	fatal: LogSeverity.Error,
}

const SeverityToPinoLogLookup = new Map([
	[LogSeverity.Debug, logger.debug],
	[LogSeverity.Error, logger.error],
	[LogSeverity.Info, logger.info],
	[LogSeverity.Warning, logger.warn],
])

const log: LogFunction = (severity, mgs) => {
	const log = SeverityToPinoLogLookup.get(severity) ?? logger.silent

	log.bind(logger)(mgs)
}

const level =
	PinoLevelToSeverityLookup[logger.level] || PinoLevelToSeverityLookup['info']

const shopify = shopifyApp({
	api: {
		apiKey: process.env.SHOPIFY_API_KEY,
		apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
		apiVersion: ApiVersion.April24,
		scopes: process.env.SCOPES?.split(','),
		appUrl: process.env.SHOPIFY_APP_URL || '',
		restResources: restResources,
		isEmbeddedApp: true,
		logger: {
			level,
			log,
		},
	},
	auth: {
		path: '/api/auth',
		callbackPath: '/api/auth/callback',
	},
	webhooks: {
		path: '/api/webhooks',
	},
	sessionStorage,
})

export default shopify

export type Shopify = typeof shopify
