import { TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/http'
import { type ErrorRequestHandler, type Response } from 'express'
import logger from '../lib/logger.js'

class ErrorHandler {
	public async handleError(cause: Error, res: Response): Promise<void> {
		logger.error(cause, 'ErrorHandler')

		if (cause instanceof TRPCError) {
			// We can get the specific HTTP status code coming from tRPC (e.g. 404 for `NOT_FOUND`).
			const httpStatusCode = getHTTPStatusCodeFromError(cause)

			res.status(httpStatusCode).json({ error: { message: cause.message } })
			return
		}

		// This is not a tRPC error, so we don't have specific information.
		res.status(500).json({
			error: { message: `Internal server error` },
		})
	}
}

const handler = new ErrorHandler()

export const errorhandler: ErrorRequestHandler = async (
	err,
	_req,
	res,
	_next,
) => await handler.handleError(err, res)
