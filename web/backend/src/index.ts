import http from 'http'
import { readFileSync } from 'node:fs'
import { join } from 'path'
import { type Session } from '@shopify/shopify-api'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import serveStatic from 'serve-static'

// import createHealthCheck from './health'
import createHealthCheck from './health/index.js'
import { agenda } from './lib/agenda.js'
import { prisma } from './lib/db/client.js'
// import logger from './lib/logger'
import logger from './lib/logger.js'
import shopify from './lib/shopify.js'
import graphqlRouter from './modules/graphql-proxy/graphql.routes.js'
import { invoicesPublicRouter } from './modules/invoices/public/invoices-public.routes.js'
import { saveShopService } from './modules/shops/services/shop.services.js'
import { createContext } from './server/context.js'
import { appRouter } from './server/routers/index.js'
import { errorhandler } from './utils/ErrorHandler.js'
import { registerJobs } from './utils/registerJobs.js'
import { webhookHandlers } from './webhooks/index.js'
// import { prisma } from './prisma/db/client'

const PORT = parseInt(
	process.env.BACKEND_PORT || process.env.PORT || '8081',
	10,
)

process.env['PUPPETEER_CACHE_DIR'] = '$(pwd)/.cache/puppeteer'

const STATIC_PATH =
	process.env.NODE_ENV === 'production'
		? `${process.cwd()}/../frontend/dist`
		: `${process.cwd()}/../frontend/`

const app = express()

//public prefix
app.use('/a', invoicesPublicRouter)

// Serve files from the "public" folder
app.use(express.static('public'))

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin())
app.get(
	shopify.config.auth.callbackPath,
	shopify.auth.callback(),
	async (_req, res, next) => {
		const session = res.locals.shopify.session as Session

		// If this is an offline OAuth process, register jobs
		if (!session.isOnline) {
			await saveShopService(session).then(() => registerJobs(session))
		}

		next()
	},
	shopify.redirectToShopifyOrAppRoot(),
)

// const webhooks = processWebhooks({
//   api: shopify.api,
//   config: shopify.config,
// });

app.post(
	shopify.config.webhooks.path,
	express.text({ type: '*/*', limit: '1MB' }),
	shopify.processWebhooks({ webhookHandlers }),
)

// All endpoints after this point will require an active session
app.use('/api/*', shopify.validateAuthenticatedSession())

app.use(express.json())

app.use('/api/graphql', graphqlRouter)

app.use(errorhandler)

app.use(
	'/api/trpc',
	trpcExpress.createExpressMiddleware({
		middleware: cors(),
		router: appRouter,
		createContext,
	}),
)

app.use(serveStatic(STATIC_PATH, { index: false }))

app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res) => {
	return res
		.status(200)
		.set('Content-Type', 'text/html')
		.send(readFileSync(join(STATIC_PATH, 'index.html')))
})

const server = http.createServer(app)

createHealthCheck({ server, logger, prisma })

agenda.start()

server.listen(PORT)

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})
