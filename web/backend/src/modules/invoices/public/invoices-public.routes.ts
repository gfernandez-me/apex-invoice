import { readFileSync } from 'node:fs'
import path from 'node:path'
import { InvoiceTemplate } from '@apex/shared-ui'
import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import React from 'react'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'
import { prisma } from '../../../lib/db/client.js'
import { invoiceByIdQuery } from '../routers/getInvoiceById.js'
import { getTemplateHtmlString } from './getTemplateHtmlString.js'
import { generateInvoicePdf } from './invoice-pdf.service.js'
import I18Template from './Template.js'

const invoicesPublicRouter = Router()

const pdfSchemaInput = z.object({ id: z.string() }).strict()

const STATIC_PATH =
	process.env.NODE_ENV === 'production'
		? `${process.cwd()}/dist/assets`
		: `${process.cwd()}/src/assets`

const logo = `data:image/png;base64,${readFileSync(
	path.join(STATIC_PATH, 'images/valor-logo.png'),
	{
		encoding: 'base64',
	},
)}`

invoicesPublicRouter.get(
	'/invoices/:id',
	validateRequest({ params: pdfSchemaInput }),
	asyncHandler(async (req, res) => {
		const invoice = await invoiceByIdQuery({ prisma, id: req.params.id })

		const invoiceEle = React.createElement(InvoiceTemplate, {
			invoice,
			logo,
		})

		const html = getTemplateHtmlString(
			React.createElement(I18Template, {}, invoiceEle),
		)

		res.send(html)
	}),
)

invoicesPublicRouter.get(
	'/invoices/:id/print',
	validateRequest({ params: pdfSchemaInput }),
	asyncHandler(async (req, res) => {
		const invoice = await invoiceByIdQuery({ prisma, id: req.params.id })

		const pdf = await generateInvoicePdf(invoice, logo)

		res.set('Content-Type', 'application/pdf')
		res.setHeader('Content-Disposition', `filename=Invoice-${invoice.name}.pdf`)

		res.send(pdf)
	}),
)

invoicesPublicRouter.get(
	'/invoices/:id/pdf',
	validateRequest({ params: pdfSchemaInput }),
	asyncHandler(async (req, res) => {
		const invoice = await invoiceByIdQuery({ prisma, id: req.params.id })

		const pdf = await generateInvoicePdf(invoice, logo)

		res.set('Content-Type', 'application/pdf')
		res.setHeader(
			'Content-Disposition',
			`attachment; filename=Invoice-${invoice.name}.pdf`,
		)

		res.send(pdf)
	}),
)

// route for extension, action order menu
invoicesPublicRouter.get(
	'/invoices/pdf/:id',
	validateRequest({ params: pdfSchemaInput }),
	asyncHandler(async (req, res) => {
		const invoice = await invoiceByIdQuery({ prisma, id: req.params.id })

		const pdf = await generateInvoicePdf(invoice, logo)

		res.setHeader('Content-Type', 'application/pdf')
		res.setHeader(
			'Content-Disposition',
			`attachment; filename=Invoice-${invoice.name}.pdf`,
		)

		res.send(pdf)
	}),
)

export { invoicesPublicRouter }
