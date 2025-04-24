import { InvoiceFooter } from './InvoiceFooter.js'
import { InvoiceHeader } from './InvoiceHeader.js'
import { InvoiceRow } from './InvoiceRow.js'
import { InvoiceSumary } from './InvoiceSumary.js'
import { InvoiceTableHeader } from './InvoiceTableHeader.js'
import { type InoiceByIdOutput } from './types.js'

interface InvoiceTemplateArgs {
	invoice: InoiceByIdOutput
	logo: string
}

export function InvoiceTemplate({ invoice, logo }: InvoiceTemplateArgs) {
	// Check if the invoice is cancelled
	if (invoice.cancelled_at) {
		return (
			<div className="relative mx-auto flex min-h-screen max-w-5xl flex-col rounded-lg bg-white p-8 print:mx-0 print:max-w-none print:p-0">
				<div className="text-center text-red-500">
					<h2>Invoice is not available.</h2>
					<p>This invoice has been cancelled and cannot be displayed.</p>
				</div>
			</div>
		)
	}

	return (
		<div className="relative mx-auto flex min-h-screen max-w-5xl flex-col rounded-lg bg-white p-8 print:mx-0 print:max-w-none print:p-0">
			<InvoiceHeader logo={logo} shop={invoice.shop} invoice={invoice} />
			<main className="mb-auto">
				<table className="w-full table-auto border-collapse">
					<thead>
						<InvoiceTableHeader />
					</thead>
					<tbody className="bg-white text-sm">
						{invoice.line_items.map((lineItem) => (
							<InvoiceRow
								key={lineItem.admin_graphql_api_id}
								shop={invoice.shop}
								lineItem={lineItem}
							/>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={7}>
								<div className="bg-[#2A3035] p-3"></div>
							</td>
						</tr>
						<tr className="hidden print:table-row">
							<td colSpan={7}>
								<div className="page-footer-space"></div>
							</td>
						</tr>
					</tfoot>
				</table>
				<div className="flex break-inside-avoid-page justify-between">
					<div className="flex-1 p-8 pt-6">
						<div className="font-bold">ORDER NOTES:</div>
						{invoice.note}
					</div>
					<InvoiceSumary invoice={invoice} />
				</div>
			</main>
			<InvoiceFooter shop={invoice.shop} />
		</div>
	)
}
