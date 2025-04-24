import type * as ShopifyResource from '@apex/shared'
import { type Prisma } from '@prisma/client'
import { mapMoneyBag } from './moneyMapper.js'

export function mapOrderTaxLine(taxLine: {
	rate?: number | undefined
	channel_liable?: boolean | undefined
	title: string
	price: string | number
}): {
	title: string
	rate: number | null
	price_set: {
		shop_money: { currency_code: string; amount: string; approx: number }
		presentment_money: {
			currency_code: string
			amount: string
			approx: number
		}
	}
} {
	return {
		title: taxLine.title,
		rate: taxLine.rate ?? null,
		price_set: {
			shop_money: {
				currency_code: 'CAD',
				amount: taxLine.price.toString(),
				approx: parseFloat(taxLine.price.toString()),
			},
			presentment_money: {
				currency_code: 'CAD',
				amount: taxLine.price.toString(),
				approx: parseFloat(taxLine.price.toString()),
			},
		},
	}
}

export function mapToTaxLine(
	taxLine: ShopifyResource.TaxLine,
): Prisma.TaxLineCreateInput {
	return {
		price_set: mapMoneyBag(taxLine.price_set),
		title: taxLine.title,
		rate: taxLine.rate ?? null,
	}
}
