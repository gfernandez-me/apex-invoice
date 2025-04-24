import { type Prisma } from '@prisma/client'
import { type Session } from '@shopify/shopify-api'
import {
	exciseProductsQuery,
	productVariantQuery,
} from '../../products/query/index.js'
import { mapMoney } from '../mappers/moneyMapper.js'

/**
 * Search and move excise tax line Item to its own field on order level
 * @param session
 * @param invoiceInput
 */
export async function addInvoiceMetadatas(
	session: Session,
	invoiceInput: (Prisma.InvoiceCreateInput | Prisma.InvoiceUpdateInput) & {
		line_items?: Prisma.LineItemCreateInput[]
	},
) {
	if (!invoiceInput.line_items) {
		return
	}

	const exciseVariants = await exciseProductsQuery({ session })

	const exciseSkus = Object.keys(exciseVariants)

	const exciseLineItems: Prisma.LineItemCreateInput[] = []

	const lineItems = invoiceInput.line_items.filter((lineItem) => {
		if (lineItem.sku && exciseSkus.includes(lineItem.sku)) {
			exciseLineItems.push(lineItem)
			return false // Exclude from lineItems
		}
		return true
	})

	invoiceInput.excise_tax_line_items = exciseLineItems
	invoiceInput.line_items = lineItems

	for await (const lineItem of lineItems) {
		if (!lineItem.variant_id) {
			continue
		}

		const productVariant = await productVariantQuery({
			session,
			id: `gid://shopify/ProductVariant/${lineItem.variant_id}`,
		})

		if (!productVariant) {
			continue
		}

		lineItem.variant_compare_at_price = productVariant.compareAtPrice
			? mapMoney({
					amount: productVariant.compareAtPrice,
					currency_code: 'CAD',
				})
			: undefined
		lineItem.variant_price = productVariant.price
			? mapMoney({
					amount: productVariant.price,
					currency_code: 'CAD',
				})
			: undefined

		const exciseType = productVariant.product?.exciseType?.reference

		if (exciseType) {
			const provincialColor = exciseType?.color?.value ?? '#eeeeee'
			const provincialTextColor = exciseType?.text_color?.value ?? '#000000'

			lineItem.provincial_color = provincialColor
			lineItem.provincial_text_color = provincialTextColor
		}

		const msrp1 = productVariant.product?.msrp1?.value
		if (msrp1) lineItem.msrp1 = msrp1

		const msrp2 = productVariant.product?.msrp2?.value
		if (msrp2) lineItem.msrp2 = msrp2
	}
}
