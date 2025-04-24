export * from './customer.schema.js'
export * from './draforder.schema.js'
export * from './transaction.schema.js'
export * from './fulfillment.schema.js'
export * from './common/index.js'

import { type z } from 'zod'
import {
	type AddressesSchema,
	type MoneySchema,
	type PriceSetSchema,
	type TaxLineSchema,
} from './common/index.js'
import { type CustomerSchema } from './customer.schema.js'
import {
	type OrderSchema,
	type LineItemTypeSchema,
	type ShippingLineSchema,
} from './order.schema.js'

export type Customer = z.infer<typeof CustomerSchema>

export type Addresses = z.infer<typeof AddressesSchema>
export type Money = z.infer<typeof MoneySchema>
export type PriceSet = z.infer<typeof PriceSetSchema>
export type TaxLine = z.infer<typeof TaxLineSchema>

export type Order = z.infer<typeof OrderSchema>
export type ShippingLine = z.infer<typeof ShippingLineSchema>
export type LineItem = z.infer<typeof LineItemTypeSchema>
