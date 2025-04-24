import { ignoreNull } from '@apex/shared'
import { format } from 'date-fns'
import { useMemo } from 'react'

import { type InoiceByIdOutput, type ShopCompany } from './types.js'

interface InvoiceHeaderArgs {
	invoice: InoiceByIdOutput
	shop: ShopCompany
	logo: string
}

function formatDate(date: Date, utcOffsetHrs: number = 0) {
	const baseTzOffset = utcOffsetHrs * 60
	const tzOffset = date.getTimezoneOffset()
	const d = new Date(date.valueOf() + (baseTzOffset + tzOffset) * 60 * 1000)
	return format(d, 'MMMM d, yyyy')
}

// function formatTheDateYall (date) {
// 	const [ year, month, day ] = date.substr(0, 10).split('-')
// 	return format(new Date(
// 			year,
// 			(month - 1),
// 			day,
// 	), 'MMMM Do, YYYY')
// }

export function InvoiceHeader({ invoice, logo, shop }: InvoiceHeaderArgs) {
	const formattedCompany = useMemo(
		() =>
			ignoreNull`${shop.billing_address.address1} ${shop.billing_address.address2} ${shop.billing_address.city}, ${shop.billing_address.province_code} ${shop.billing_address.zip}`,
		[shop],
	)

	return (
		<header>
			<div className="mb-12 mt-2 flex flex-row flex-nowrap justify-between space-x-4 px-1 text-[15px] leading-[18px] lg:space-x-0">
				<div className="min-w-fit">
					<figure className="flex flex-nowrap gap-2">
						<img className="aspect-[4/3] h-56 object-contain" src={logo} />
						<div className="w-36 self-center">
							<p className="font-bold">{shop.name}</p>
							<p className="inline-block">{formattedCompany}</p>
							<p className="pt-4 font-bold">
								GST/HST Number:{' '}
								<span className="inline-block font-normal">802295840</span>
							</p>
						</div>
					</figure>
					<div className="w-96">
						<p className="mb-2 inline-block text-[20px] font-bold">
							INVOICE TO
						</p>
						<div className="flex flex-row">
							<address className="col-6 w-48 not-italic">
								<p className="font-bold">Billing:</p>
								<p className="font-bold">{invoice.billing_address?.company}</p>
								<p className="inline-block">
									{invoice.billing_address?.address1}{' '}
									{invoice.billing_address?.address2}{' '}
									{invoice.billing_address?.city},{' '}
									{invoice.billing_address?.zip}
								</p>
							</address>
							<address className="col-6 w-48 not-italic">
								<p className="font-bold">Shipping:</p>
								<p className="font-bold">{invoice.shipping_address?.company}</p>
								<p className="inline-block">
									{invoice.shipping_address?.address1}{' '}
									{invoice.shipping_address?.address2}{' '}
									{invoice.shipping_address?.city},{' '}
									{invoice.shipping_address?.zip}
								</p>
							</address>
						</div>
					</div>
				</div>
				<div className="flex flex-col border-none border-slate-600 bg-[#2A3035] p-8 font-bold text-white shadow shadow-slate-300">
					<div className="contents">
						<span className="pb-0 pt-4 text-5xl leading-[82px]">INVOICE</span>
						{/* <span className="p-2 text-center text-4xl ">{invoice.name}</span> */}
					</div>
					<div className="mt-auto table w-full">
						<div className="table-row-group">
							<div className="table-row">
								<div className="table-cell p-2 text-left">Invoice#</div>
								<div className="table-cell p-2 text-right">{invoice.name}</div>
							</div>
							<div className="table-row">
								<div className="table-cell p-2 text-left">Date</div>
								<div className="table-cell p-2 text-right">
									{format(new Date(invoice.processed_at), 'MMMM d, yyyy')}
								</div>
							</div>
							<div className="table-row">
								<div className="table-cell p-2 text-left">Customer#</div>
								<div className="table-cell p-2 text-right">
									{invoice.customer?.shopifyId}
								</div>
							</div>
							{invoice.pad_due_date ? (
								<div className="table-row">
									<div className="table-cell p-2 text-left">Due Date</div>
									<div className="table-cell p-2 text-right">
										{formatDate(invoice.pad_due_date)}
									</div>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}
