import { FinancialStatus, FulfillmentStatus, Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { agenda } from '../../../lib/agenda.js'
import { publicProcedure, router } from '../../../server/trpc.js'
import {
	INVOICE_RECONCILIATION_BY_ORDER_NUMBER_JOB,
	INVOICE_RECONCILIATION_JOB,
} from '../jobs/reconciliation-job.js'
import { sendInvoiceEmailService } from '../services/send-invoice-email-service.js'
import { invoiceByIdQuery } from './getInvoiceById.js'

const defaultSortBy =
	Prisma.validator<Prisma.InvoiceOrderByWithAggregationInput>()({
		processed_at: 'desc',
		financial_status: undefined,
	})

const limit = 50

export const invoiceRouter = router({
	list: publicProcedure
		.input(
			z.object({
				cursor: z.string().optional().nullable(),
				text: z.string().optional(),
				sent: z.boolean().optional(),
				financialStatus: z.nativeEnum(FinancialStatus).optional(),
				fulfillmentStatus: z.nativeEnum(FulfillmentStatus).optional(),
				orderBy: z
					.object({
						processed_at: z.nativeEnum(Prisma.SortOrder).optional(),
					})
					.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const cursor = input.cursor
				? JSON.parse(Buffer.from(input.cursor, 'base64').toString())
				: null

			const orderBy = input.orderBy ?? defaultSortBy

			let sort = {
				...(orderBy.processed_at && {
					processed_at: orderBy.processed_at === 'asc' ? 1 : -1,
					_id: orderBy.processed_at === 'asc' ? 1 : -1,
				}),
			}

			let filter = {
				name: { $regex: input.text ?? '.*' },
				...(input.sent && {
					sent: input.sent,
				}),
				...(input.financialStatus && {
					financial_status: input.financialStatus,
				}),
			}

			if (cursor) {
				filter = { ...filter, ...cursorFilter(cursor, orderBy.processed_at) }
			}

			const result = (await ctx.prisma.invoice.findRaw({
				filter,
				options: {
					projection: {
						_id: true,
						number: true,
						processed_at: true,
						customer: true,
						financial_status: true,
						fulfillment_status: true,
						total_price_set: true,
						sent: true,
						name: true,
						closed_at: true,
						cancelled_at: true,
					},
					sort: sort,
					limit,
				},
			})) as unknown as Root

			const lastItem = result[result.length - 1]

			const nextCursor = lastItem
				? Buffer.from(
						JSON.stringify({
							processed_at: lastItem.processed_at,
							_id: lastItem._id,
						}),
					).toString('base64')
				: null

			const pagination = {
				nextCursor,
				limit,
			}

			return {
				pagination,
				data: result as unknown as Root,
			}
		}),
	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) =>
			invoiceByIdQuery({ prisma: ctx.prisma, id: input.id }),
		),
	sync: publicProcedure.mutation(async ({ ctx }) => {
		if (!ctx.session) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
			})
		}

		const atMinDate = new Date()
		atMinDate.setDate(atMinDate.getDate() - 30)

		await agenda.now(INVOICE_RECONCILIATION_JOB, {
			sessionId: ctx.session.id,
			atMinDate,
		})
		return
	}),
	syncByIds: publicProcedure
		.input(z.object({ ids: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (!ctx.session) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
				})
			}

			const idList = input.ids.split(',').filter((id) => id.length > 0)
			// Check if more than 10 IDs are provided
			if (idList.length > 10) {
				throw new Error('Too many IDs provided. Maximum allowed is 10.')
			}

			await agenda.now(INVOICE_RECONCILIATION_BY_ORDER_NUMBER_JOB, {
				sessionId: ctx.session.id,
				ids: input.ids,
			})
			return
		}),
	syncStatus: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.session) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
			})
		}

		const job = await agenda
			.jobs(
				{
					name: INVOICE_RECONCILIATION_JOB,
					type: 'normal',
				},
				{ lastRunAt: -1 },
				1,
			)
			.then((jobs) => (jobs.length ? jobs[0] : null))

		const running = (await job?.isRunning()) ?? false
		const progress = job?.attrs.progress ?? 0

		return {
			running,
			progress,
		}
	}),
	syncByIdsStatus: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.session) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
			})
		}

		const job = await agenda
			.jobs(
				{
					name: INVOICE_RECONCILIATION_BY_ORDER_NUMBER_JOB,
					type: 'normal',
				},
				{ lastRunAt: -1 },
				1,
			)
			.then((jobs) => (jobs.length ? jobs[0] : null))

		const running = (await job?.isRunning()) ?? false
		const progress = job?.attrs.progress ?? 0

		return {
			running,
			progress,
		}
	}),
	sendEmail: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (!ctx.session) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
				})
			}

			await sendInvoiceEmailService({ id: input.id })
		}),
})

export type Root = Array<{
	_id: string
	sent: boolean
	number: {
		$numberLong: string
	}
	name: string
	financial_status: string
	fulfillment_status: string
	closed_at: {
		$date: string
	}
	cancelled_at: {
		$date: string
	}
	processed_at: {
		$date: string
	}
	customer: {
		email: string
		last_name: string
		first_name: string
	}
	total_price_set: {
		presentment_money: {
			amount: string
			currency_code: string
			approx: number
		}
		shop_money: {
			amount: string
			currency_code: string
			approx: number
		}
	}
}>

function cursorFilter(
	currentCursor: { processed_at: 'asc' | 'desc'; _id: String },
	orderDirection?: Prisma.SortOrder,
) {
	const comparisonOperator = orderDirection === 'asc' ? '$gt' : '$lt'
	return {
		$or: [
			{ processed_at: { [comparisonOperator]: currentCursor.processed_at } },
			{
				processed_at: currentCursor.processed_at,
				_id: { [comparisonOperator]: currentCursor._id },
			},
		],
	}
}
