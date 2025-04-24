import { z } from 'zod'
import { PriceSetSchema } from './money.schema.js'

export const TaxLineSchema = z.object({
	/**
	 * The name of the tax.
	 */
	title: z.string(),
	/**
	 * The amount added to the order for this tax in the shop currency.
	 */
	price: z.union([z.string(), z.number()]),
	/**
	 * The amount added to the order for this tax in shop and presentment currencies.
	 */
	price_set: PriceSetSchema,
	/**
	 * Whether the channel that submitted the tax line is liable for remitting. A value of null indicates unknown liability for the tax line.
	 */
	channel_liable: z.boolean().optional(),
	/**
	 * The tax rate applied to the order to calculate the tax price.
	 */
	rate: z.number().optional(),
})
