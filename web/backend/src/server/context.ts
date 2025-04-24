import { type PrismaClient } from '@prisma/client'
import { type Session } from '@shopify/shopify-api'
import type * as trpcExpress from '@trpc/server/adapters/express'
import { type Logger } from 'pino'
import { prisma } from '../lib/db/client.js'
import logger from '../lib/logger.js'
import { sessionStorage } from '../lib/sessionStorage.js'
import shopify from '../lib/shopify.js'

export async function createContext({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions): Promise<{
	session: Session | undefined
	prisma: PrismaClient
	logger: Logger
}> {
	// Create your context based on the request object
	// Will be available as `ctx` in all your resolvers

	//   const session = await shopify.api. (req, res, true);
	//   const offlineSessionId = await shopify.api.auth(shop);

	const sessionId = await shopify.api.session.getCurrentId({
		isOnline: false,
		rawRequest: req,
		rawResponse: res,
	})

	if (sessionId) {
		const session = await sessionStorage.loadSession(sessionId)
		return { session, prisma, logger }
	} else {
		return { session: undefined, prisma, logger }
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
