import { useI18n } from '@shopify/react-i18n'

import { type LineItem, type ShopCompany } from './types.js'

interface InvoiceRowArgs {
	lineItem: LineItem
	shop: ShopCompany
}

export function InvoiceRow({ lineItem, shop }: InvoiceRowArgs) {
	const [i18n] = useI18n()

	function formatCurrency(amount?: string | number) {
		return i18n.formatCurrency(
			typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0),
			{
				currency: shop.currency_code,
				form: 'short',
			},
		)
	}

	const originalVariantPrice =
		lineItem.variant_compare_at_price?.approx ||
		lineItem.variant_price?.approx ||
		0

	return (
		<tr className="break-inside-avoid odd:bg-white even:bg-[#F5F5F5]">
			<td className="border-b border-slate-100 p-4 pl-8 text-black">
				<div className="font-bold text-black">{lineItem.title}</div>
				<div>
					{lineItem.variant_title}
					{' SKU '}
					{lineItem.sku || 'Empty.'}
				</div>
				<div>
					{(lineItem.msrp1 || lineItem.msrp2) && (
						<>MSRP $: {lineItem.msrp1 || lineItem.msrp2}</>
					)}
				</div>
			</td>
			<td className="border-b border-slate-100 p-4 pl-8 text-center text-black">
				{lineItem.quantity}
			</td>
			<td className="border-b border-slate-100 p-4 pl-8 text-center text-black">
				{lineItem.price_set.shop_money.approx < originalVariantPrice ? (
					<>
						<div>{formatCurrency(lineItem.price_set.shop_money.approx)}</div>
						<div className="mt-2 text-red-500 line-through">
							{formatCurrency(originalVariantPrice)}
						</div>
					</>
				) : (
					<div>{formatCurrency(lineItem.price_set.shop_money.approx)}</div>
				)}
			</td>
			<td className="border-b border-slate-100 p-4 pl-8 text-center text-black">
				{lineItem.provincial_name ? (
					<span
						className="bottom-5 top-0 ml-2 flex h-5 w-32 items-center justify-center rounded-lg p-4 text-[0.625rem] font-bold leading-none"
						style={{
							backgroundColor: `${lineItem.provincial_color}`,
							color: `${lineItem.provincial_text_color}`,
						}}
					>
						{lineItem.provincial_name ?? ''}
					</span>
				) : (
					''
				)}
			</td>
			<td className="border-b border-slate-100 p-4 pl-8 text-center text-black">
				{formatCurrency((lineItem.excise_tax?.approx ?? 0) / lineItem.quantity)}
			</td>
			<td className="border-b border-slate-100 p-4 pl-8 text-center text-black">
				{(lineItem.provincial_tax?.approx ?? 0 > 0)
					? formatCurrency(
							(lineItem.provincial_tax?.approx ?? 0) / lineItem.quantity,
						)
					: 'N/A'}
			</td>
			<td className="border-b border-slate-100 p-4 pl-8 text-center text-black">
				{formatCurrency(
					lineItem.price_set.shop_money.approx * lineItem.quantity +
						(lineItem.excise_tax?.approx ?? 0) +
						(lineItem.provincial_tax?.approx ?? 0),
				)}
			</td>
		</tr>
	)
}
