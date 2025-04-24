import { useI18n } from '@shopify/react-i18n'
import { type InoiceByIdOutput } from './types.js'

export function InvoiceSumary({ invoice }: { invoice: InoiceByIdOutput }) {
	const [i18n] = useI18n()
	function formatCurrency(amount?: string | number) {
		return i18n.formatCurrency(
			typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0),
			{
				currency: invoice.shop.currency_code,
				form: 'short',
			},
		)
	}

	const provincialNames = Array.from(
		new Set(
			invoice.line_items
				.filter((item) => item.provincial_tax?.approx ?? 0 > 0)
				.map((item) => {
					return item.provincial_name
				}),
		),
	).join(',')

	return (
		<div className="mb-6 table w-1/2 min-w-fit text-sm">
			<div className="table-row-group border-b odd:bg-white even:bg-[#F5F5F5]">
				<div className="table-cell p-2 pl-5">Subtotal</div>
				<div className="table-cell p-2 pr-8 text-right">
					{formatCurrency(
						invoice.subtotal_price_set.shop_money.approx +
							invoice.total_discounts_set.shop_money.approx -
							invoice.excise_tax_line_items.reduce((acc, item) => {
								return (acc += item.price_set.shop_money.approx ?? 0)
							}, 0),
					)}
				</div>
			</div>
			<div className="table-row-group border-b odd:bg-white even:bg-[#F5F5F5]">
				<div className="table-cell p-2 pl-5">Discounts</div>
				<div className="table-cell p-2 pr-8 text-right">
					-{formatCurrency(invoice.total_discounts_set.shop_money.amount)}
				</div>
			</div>
			<div className="table-row-group border-b odd:bg-white even:bg-[#F5F5F5]">
				<div className="table-cell p-2 pl-5">Federal Excise Tax</div>
				<div className="table-cell p-2 pr-8 text-right">
					{formatCurrency(
						invoice.line_items.reduce((acc, item) => {
							return (acc += item.excise_tax?.approx ?? 0)
						}, 0),
					)}
				</div>
			</div>
			<div className="table-row-group border-b odd:bg-white even:bg-[#F5F5F5]">
				<div className="table-cell p-2 pl-5">
					Provincial Excise Tax
					{provincialNames ? `(${provincialNames})` : ''}
				</div>
				<div className="table-cell p-2 pr-8 text-right">
					{formatCurrency(
						invoice.line_items.reduce((acc, item) => {
							return (acc += item.provincial_tax?.approx ?? 0)
						}, 0),
					)}
				</div>
			</div>
			{invoice.tax_lines.map((taxLine) => {
				return (
					<div
						key={taxLine.title}
						className="table-row-group border-b odd:bg-white even:bg-[#F5F5F5]"
					>
						<div className="table-cell p-2 pl-5">
							Sales Tax {'('}
							{taxLine.title}{' '}
							{taxLine.rate ? ((taxLine.rate ?? 0) * 100).toLocaleString() : ''}
							{'%)'}
						</div>
						<div className="table-cell p-2 pr-8 text-right">
							{formatCurrency(taxLine.price_set.shop_money.amount)}
						</div>
					</div>
				)
			})}
			<div className="table-row-group border-b odd:bg-white even:bg-[#F5F5F5]">
				<div className="table-cell p-2 pl-5">Shipping</div>
				<div className="table-cell p-2 pr-8 text-right">
					{formatCurrency(invoice.total_shipping_price_set.shop_money.amount)}
				</div>
			</div>

			<div className="table-footer-group bg-[#2A3035] text-[15px] font-bold leading-[18px] text-white">
				<div className="table-cell p-2 py-2 pl-5">Grand Total</div>
				<div className="table-cell p-2 py-2 pr-8 text-right">
					{formatCurrency(invoice.total_price_set.shop_money.amount)}
				</div>
			</div>
		</div>
	)
}
