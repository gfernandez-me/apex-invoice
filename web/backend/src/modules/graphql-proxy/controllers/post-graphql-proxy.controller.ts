import { type Session } from '@shopify/shopify-api'
import { type NextFunction, type Request, type Response } from 'express'
import shopify from '../../../lib/shopify.js'

export const postGraphqlProxy = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const session = res.locals.shopify.session as Session

		const response = await shopify.api.clients.graphqlProxy({
			session,
			rawBody: req.body,
		})

		res.status(200).send(response.body)
	} catch (error) {
		return next(error)
	}
}
