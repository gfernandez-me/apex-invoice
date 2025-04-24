import { type PrismaClient } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { exclude } from '../../../utils/exclude.js'
import { defaultShopSelect } from '../../shops/routers/index.js'

export async function invoiceByIdQuery({
	prisma,
	id,
}: {
	prisma: PrismaClient
	id: string
}) {
	const invoice = await prisma.invoice.findUnique({
		where: { id },
		include: { shop: { select: defaultShopSelect } },
	})
	if (!invoice) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: `No Invoice with id '${id}'`,
		})
	}
	return exclude(invoice, ['shopId'])
}
