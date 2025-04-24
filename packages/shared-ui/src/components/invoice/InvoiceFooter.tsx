import { type ShopCompany } from './types.js'

interface InvoiceFooterArgs {
	shop: ShopCompany
}

export function InvoiceFooter({ shop }: InvoiceFooterArgs) {
	return (
		<footer className="print:page-footer mt-auto flex items-center justify-center">
			<div className="text-center text-[11px] leading-[13px] text-[#00000080] text-zinc-500">
				<div className="text-center font-bold">{shop.name}</div>
				<span>{shop.host}</span>
			</div>
		</footer>
	)
}
