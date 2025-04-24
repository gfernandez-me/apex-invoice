import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../../../server/trpc.js'

export const defaultShopSelect = Prisma.validator<Prisma.ShopSelect>()({
	billing_address: true,
	contact_email: true,
	currency_code: true,
	gst_hst_number: true,
	host: true,
	name: true,
	url: true,
})

export const shopRouter = router({
	current: publicProcedure.query(async ({ ctx }) => {
		const shop = await ctx.prisma.shop.findUnique({
			where: { shopify_domain: ctx.session?.shop },
			select: defaultShopSelect,
		})

		if (!shop) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: `No Shop found`,
			})
		}

		return shop
	}),
	getByHost: publicProcedure
		.input(z.object({ host: z.string() }))
		.query(async ({ ctx, input }) => {
			const shop = await ctx.prisma.shop.findUnique({
				where: { host: input.host },
				select: defaultShopSelect,
			})

			if (!shop) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: `No Shop found`,
				})
			}

			return shop
		}),
})
