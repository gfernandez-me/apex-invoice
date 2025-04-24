import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { invoiceRouter } from '../../modules/invoices/routers/index.js'
import { shopRouter } from '../../modules/shops/routers/index.js'
import { router } from '../trpc.js'

export const appRouter = router({
	invoice: invoiceRouter,
	shop: shopRouter,
})

export type AppRouter = typeof appRouter

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
