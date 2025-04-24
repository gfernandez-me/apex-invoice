import { InvoiceEmail } from '@apex/email'
import { render } from '@react-email/components'
import { TRPCError } from '@trpc/server'
import { prisma } from '../../../lib/db/client.js'
import logger from '../../../lib/logger.js'
import { sendEmail } from '../../notification/email-service.js'

export const sendInvoiceEmailService = async ({ id }: { id: string }) => {
	const invoice = await prisma.invoice.findUnique({
		select: {
			email: true,
			name: true,
			customer: {
				select: {
					first_name: true,
					email: true,
				},
			},
		},
		where: {
			id,
		},
	})

	if (!invoice) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'Invoice not found',
		})
	}

	if (!invoice.customer?.email || !invoice.customer?.first_name) {
		throw new TRPCError({
			code: 'UNPROCESSABLE_CONTENT',
			message: 'Missing email or customer name',
		})
	}

	const emailHtml = render(
		InvoiceEmail({
			invoiceNumber: invoice.name,
			username: invoice.customer?.first_name,
			printLink: `${process.env.SHOPIFY_APP_URL}/a/invoices/${id}/print`,
			pdfLink: `${process.env.SHOPIFY_APP_URL}/a/invoices/${id}/pdf`,
		}),
	)

	try {
		await sendEmail({
			to: invoice.customer.email,
			subject: 'Invoice',
			html: emailHtml,
		})
	} catch (error) {
		logger.error(error)
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'An unexpected error occurred',
		})
	}

	await prisma.invoice.update({
		data: {
			sent: true,
		},
		where: {
			id,
		},
	})
}
