import { InvoiceTemplate } from '@apex/shared-ui'
import React from 'react'
import { type RouterOutput } from '../../../server/routers/index.js'
import { generatePDF } from '../../../utils/generatePDF.js'
import { getTemplateHtmlString } from './getTemplateHtmlString.js'
import I18Template from './Template.js'

export async function generateInvoicePdf(
	invoice: RouterOutput['invoice']['byId'],
	logo: string,
) {
	const invoiceEle = React.createElement(InvoiceTemplate, {
		invoice,
		logo,
	})

	const html = getTemplateHtmlString(
		React.createElement(I18Template, {}, invoiceEle),
	)

	return await generatePDF(html)
}
