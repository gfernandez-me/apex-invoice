import type * as ShopifyResource from '@apex/shared'
import { type Prisma } from '@prisma/client'
import { mapMoney, mapMoneyBag } from './moneyMapper.js'
import { mapToTaxLine } from './taxLineMapper.js'

enum OrderLineItemPropsName {
	EXCISE = 'excise',
	PROVINCIAL = 'provincial',
}

export function mapToLineItemInput(
	lineItem: ShopifyResource.LineItem,
): Prisma.LineItemCreateInput {
	const {
		admin_graphql_api_id,
		name,
		quantity,
		title,
		total_discount_set,
		variant_title,
	} = lineItem
	const tax_lines = lineItem.tax_lines.map(mapToTaxLine)

	const price_set = mapMoneyBag(lineItem.price_set)

	const { excise_tax, provincial_tax, provincial_name } =
		createExciseTaxLineItem(lineItem)

	const product_id = lineItem.product_id ?? null
	const variant_id = lineItem.variant_id ?? null
	const sku = lineItem.sku ?? null

	return {
		admin_graphql_api_id,
		tax_lines,
		variant_title,
		price_set: mapMoneyBag(price_set),
		quantity,
		name,
		title,
		excise_tax,
		provincial_tax,
		provincial_name,
		product_id,
		variant_id,
		sku,
		total_discount_set: mapMoneyBag(total_discount_set),
	}
}
function createExciseTaxLineItem(lineItem: ShopifyResource.LineItem) {
	let provincialAmount = 0
	let provincialName

	const propExcise = lineItem.properties.find(
		(p) => p.name === OrderLineItemPropsName.EXCISE,
	)

	const federalName = propExcise ? 'FEDERAL' : ''

	const exciseAmount = propExcise?.value ? Number(propExcise.value) : 0

	const propProvincial = lineItem.properties.find(
		(p) =>
			p.name.indexOf(OrderLineItemPropsName.PROVINCIAL) >= 0 &&
			p.name.indexOf('federal') < 0,
	)
	if (propProvincial) {
		provincialAmount = Number(propProvincial.value ?? 0)
		provincialName = propProvincial.name
			.replace(OrderLineItemPropsName.PROVINCIAL.concat(':'), '')
			.toUpperCase()
	}

	const excise_tax: Prisma.MoneyCreateInput | null = mapMoney({
		amount: exciseAmount.toString(),
		currency_code: 'CAD',
	})
	const provincial_tax: Prisma.MoneyCreateInput | null = mapMoney({
		amount: provincialAmount.toString(),
		currency_code: 'CAD',
	})

	const provincial_name = provincialName ?? federalName ?? ''

	return {
		excise_tax,
		provincial_tax,
		provincial_name,
	}
}
