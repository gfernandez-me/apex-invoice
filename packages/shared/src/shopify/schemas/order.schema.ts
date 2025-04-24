import { z } from 'zod'

import { AddressesSchema } from './common/address.schema.js'

import { PriceSetSchema } from './common/money.schema.js'
import { TaxLineSchema } from './common/taxline.schema.js'
import { CustomerSchema } from './customer.schema.js'
import { FulfillmentSchema } from './fulfillment.schema.js'

export const LineItemTypeSchema = z.object({
	admin_graphql_api_id: z.string(),
	/**
	 * The amount available to fulfill, calculated as follows:
	 * quantity - max(refunded_quantity, fulfilled_quantity) - pending_fulfilled_quantity - open_fulfilled_quantity
	 */
	fulfillable_quantity: z.number().optional(),
	/**
	 * How far along an order is in terms line items fulfilled. Valid values: null, fulfilled, partial, and not_eligible.
	 */
	fulfillment_status: z
		.enum(['null', 'fulfilled', 'partial', 'not_eligible'])
		.optional(),
	/**
	 * The weight of the item in grams.
	 */
	grams: z.number().optional(),
	/**
	 * The ID of the line item.
	 */
	id: z.number().optional(),
	/**
	 * The price of the item before discounts have been applied in the shop currency.
	 */
	price: z.union([z.string(), z.number()]).optional(),
	/**
	 * The ID of the product that the line item belongs to. Can be null if the original product associated with the order is deleted at a later date.
	 */
	product_id: z.number().optional(),
	/**
	 * The number of items that were purchased.
	 */
	quantity: z.number(),
	/**
	 * Whether the item requires shipping.
	 */
	requires_shipping: z.boolean().optional(),
	/**
	 * The item's SKU (stock keeping unit).
	 */
	sku: z.string().optional(),
	/**
	 * The title of the product.
	 */
	title: z.string(),
	/**
	 * The ID of the product variant.
	 */
	variant_id: z.number().optional(),
	/**
	 * The title of the product variant.
	 */
	variant_title: z.string().optional(),
	/**
	 * The name of the item's supplier.
	 */
	vendor: z.string().optional(),
	/**
	 * The name of the product variant.
	 */
	name: z.string(),
	/**
	 * Whether the item is a gift card. If true, then the item is not taxed or considered for shipping charges.
	 */
	gift_card: z.boolean().optional(),
	/**
	 * The price of the line item in shop and presentment currencies.
	 */
	price_set: z.object({
		shop_money: z.object({
			amount: z.string(),
			currency_code: z.string(),
		}),
		presentment_money: z.object({
			amount: z.string(),
			currency_code: z.string(),
		}),
	}),
	/**
	 * An array of custom information for the item that has been added to the cart. Often used to provide product customization options.
	 */
	properties: z.array(
		z.object({ name: z.string(), value: z.union([z.string(), z.number()]) }),
	),
	/**
	 * Whether the item was taxable.
	 */
	taxable: z.boolean(),
	/**
	 * A list of tax line objects, each of which details a tax applied to the item
	 */
	tax_lines: z.array(TaxLineSchema),
	/**
	 * The total amount of the discount allocated to the line item in the shop currency. This field must be explicitly set using draft orders, Shopify scripts, or the API. Instead of using this field, Shopify recommends using discount_allocations, which provides the same information.
	 */
	total_discount: z.union([z.string(), z.number()]).optional(),
	/**
	 * The total amount allocated to the line item in the presentment currency. Instead of using this field, Shopify recommends using discount_allocations, which provides the same information.
	 */
	total_discount_set: z.object({
		shop_money: z.object({
			amount: z.string(),
			currency_code: z.string(),
		}),
		presentment_money: z.object({
			amount: z.string(),
			currency_code: z.string(),
		}),
	}),
	/**
	 * An ordered list of amounts allocated by discount applications. Each discount allocation is associated with a particular discount application.
	 */
	discount_allocations: z
		.array(
			z.object({
				/**
				 * The discount amount allocated to the line in the shop currency.
				 */
				amount: z.string(),
				/**
				 * The index of the associated discount application in the order's discount_applications list.
				 */
				discount_application_index: z.number(),
				/**
				 * The discount amount allocated to the line item in shop and presentment currencies.
				 */
				amount_set: z.object({
					shop_money: z.object({
						amount: z.string(),
						currency_code: z.string(),
					}),
					presentment_money: z.object({
						amount: z.string(),
						currency_code: z.string(),
					}),
				}),
			}),
		)
		.optional(),
	/**
	 * A list of duty objects, each containing information about a duty on the line item.
	 */
	duties: z
		.array(
			z.object({
				id: z.string(),
				harmonized_system_code: z.string(),
				country_code_of_origin: z.string(),
				shop_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
				presentment_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
				tax_lines: z.array(TaxLineSchema),
				admin_graphql_api_id: z.string(),
			}),
		)
		.optional(),
})

const DiscountApplicationsSchema = z.object({
	/**
	 * The value of the discount application as a decimal. This represents the intention of the discount application.
	 * For example, if the intent was to apply a 20% discount, then the value will be 20.0.
	 * If the intent was to apply a $15 discount, then the value will be 15.0
	 */
	value: z.union([z.string(), z.number()]),
	/**
	 * The type of the value.
	 */
	value_type: z.enum(['fixed_amount', 'percentage']),
	/**
	 * The method by which the discount application value has been allocated to entitled lines.
	 * * across: The value is spread across all entitled lines.
	 * * each: The value is applied onto every entitled line.
	 * * one: The value is applied onto a single line.
	 */
	allocation_method: z.enum(['across', 'each', 'one']),
	/**
	 * The lines on the order, of the type defined by target_type, that the discount is allocated over. Valid values:
	 *
	 * * all: The discount is allocated onto all lines,
	 * * entitled: The discount is allocated only onto lines it is entitled for.
	 * * explicit: The discount is allocated onto explicitly selected lines.
	 */
	target_selection: z.enum(['all', 'entitled', 'explicit']),
	/**
	 * The type of line on the order that the discount is applicable on. Valid values:
	 * * line_item: The discount applies to line items.
	 * * shipping_line: The discount applies to shipping lines.
	 */
	target_type: z.enum(['line_item', 'shipping_line']),
})

export const ShippingLineSchema = z.object({
	/**
	 * A reference to the shipping method.
	 */
	code: z.string(),
	/**
	 * The price of this shipping method in the shop currency. Can't be negative.
	 */
	price: z.union([z.string(), z.number()]),
	/**
	 * The price of the shipping method in shop and presentment currencies.
	 */
	price_set: PriceSetSchema.optional(),
	/**
	 * The price of the shipping method after line-level discounts have been applied. Doesn't reflect cart-level or order-level discounts.
	 */
	discounted_price: z.union([z.string(), z.number()]).optional(),

	/**
	 * The price of the shipping method in both shop and presentment currencies after line-level discounts have been applied.
	 */
	discounted_price_set: PriceSetSchema.optional(),
	/**
	 * The source of the shipping method.
	 */
	source: z.string().optional(),
	/**
	 * The title of the shipping method.
	 */
	title: z.string(),
	/**
	 * A list of tax line objects, each of which details a tax applicable to this shipping line.
	 */
	tax_lines: z.array(TaxLineSchema),
	/**
	 * A reference to the carrier service that provided the rate. Present when the rate was computed by a third-party carrier service
	 */
	carrier_identifier: z.string().optional(),
	/**
	 * A reference to the fulfillment service that is being requested for the shipping method. Present if the shipping method requires processing by a third party fulfillment service; null otherwise.
	 */
	requested_fulfillment_service_id: z.string().optional(),
})

export const metafieldSchema = z.object({
	key: z.string(),
	value: z.string(),
	type: z.string(),
	namespace: z.string(),
})

/**
 * An order is a customer's request to purchase one or more products from a shop
 */
export const OrderSchema = z.object({
	metafields: z.array(metafieldSchema).nullish(),
	admin_graphql_api_id: z.string(),
	app_id: z.number().optional(),
	/**
	 * 🔒
	 * The mailing address associated with the payment method. This address is an optional field that won't be available on orders that do not require a payment method.
	 */
	billing_address: AddressesSchema.optional(),
	browser_ip: z.string().optional(),
	/**
	 * Whether the customer consented to receive email updates from the shop.
	 */
	buyer_accepts_marketing: z.boolean().optional(),
	/**
	 * The reason why the order was canceled. Valid values:
	 *
	 * * customer: The customer canceled the order.
	 * * fraud: The order was fraudulent.
	 * * inventory: Items in the order were not in inventory.
	 * * declined: The payment was declined.
	 * * other: A reason not in this list.
	 */
	cancel_reason: z
		.enum(['customer', 'fraud', 'inventory', 'declined', 'other'])
		.optional(),
	/**
	 * The date and time when the order was canceled. Returns null if the order isn't canceled.
	 */
	cancelled_at: z.string().optional(),
	/**
	 * A unique value when referencing the cart that's associated with the order.
	 */
	cart_token: z.string().optional(),
	/**
	 * A unique value when referencing the checkout that's associated with the order.
	 */
	checkout_token: z.string().optional(),
	/**
	 * 🔒
	 * Information about the browser that the customer used when they placed their order:
	 */
	client_details: z
		.object({
			accept_language: z.string(),
			browser_height: z.number(),
			browser_ip: z.string(),
			browser_width: z.number(),
			session_hash: z.string(),
			user_agent: z.string(),
		})
		.optional(),
	closed_at: z.string().optional(),
	created_at: z.string(),
	currency: z.string().optional(),
	contact_email: z.string().optional(),
	current_total_discounts: z.string().optional(),
	/**
	 * The current total discounts on the order in shop and presentment currencies. The amount values associated with this field reflect order edits, returns, and refunds.
	 */
	current_total_discounts_set: z
		.object({
			current_total_discounts_set: z.object({
				shop_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
				presentment_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
			}),
		})
		.optional(),
	current_total_duties_set: z
		.object({
			current_total_duties_set: z.object({
				shop_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
				presentment_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
			}),
		})
		.optional(),
	current_total_price: z.string().optional(),
	current_total_price_set: z
		.object({
			current_total_price_set: z.object({
				shop_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
				presentment_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
			}),
		})
		.optional(),
	current_subtotal_price: z.string().optional(),
	current_subtotal_price_set: z
		.object({
			current_subtotal_price_set: z.object({
				shop_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
				presentment_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
			}),
		})
		.optional(),
	current_total_tax: z.string().optional(),
	current_total_tax_set: z
		.object({
			current_total_tax_set: z.object({
				shop_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
				presentment_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
			}),
		})
		.optional(),
	/**
	 * 🔒
	 * Information about the customer. The order might not have a customer and apps should not depend on the existence of a customer object. This value might be null if the order was created through Shopify POS.
	 */
	customer: CustomerSchema.optional(),
	customer_locale: z.string().optional(),
	/**
	 * An ordered list of stacked discount applications.
	 *
	 * The discount_applications property includes 3 types: discount_code, manual, and script. All 3 types share a common structure and have some type specific attributes.
	 */
	discount_applications: z
		.array(
			z.discriminatedUnion('type', [
				DiscountApplicationsSchema.extend({
					/**
					 * The discount application type.
					 */
					type: z.literal('manual'),
					/**
					 * The title of the discount application, as defined by the merchant. Available only for manual discount applications.
					 */
					title: z.string(),
					/**
					 * The description of the discount application, as defined by the merchant or the Shopify Script. Available only for manual and script discount applications.
					 */
					description: z.string(),
				}),
				DiscountApplicationsSchema.extend({
					/**
					 * The discount application type.
					 */
					type: z.literal('script'),
					/**
					 * The description of the discount application, as defined by the merchant or the Shopify Script. Available only for manual and script discount applications.
					 */
					description: z.string(),
				}),
				DiscountApplicationsSchema.extend({
					/**
					 * The discount application type.
					 */
					type: z.literal('discount_code'),
				}),
			]),
		)
		.optional(),
	/**
	 * A list of discounts applied to the order. Each discount object includes the following properties:
	 */
	discount_codes: z
		.array(
			z.object({
				/**
				 * When the associated discount application is of type code, this property returns the discount code that was entered at checkout.
				 * Otherwise this property returns the title of the discount that was applied.
				 */
				code: z.string(),
				/**
				 * The amount that's deducted from the order total. When you create an order, this value is the percentage or monetary amount to deduct.
				 * After the order is created, this property returns the calculated amount.
				 */
				amount: z.union([z.string(), z.number()]),
				/**
				 *  The type of discount. Default value: fixed_amount. Valid values:
				 * * fixed_amount: Applies amount as a unit of the store's currency. For example, if amount is 30 and the store's currency is USD,
				 * then 30 USD is deducted from the order total when the discount is applied.
				 *
				 * * percentage: Applies a discount of amount as a percentage of the order total.
				 *
				 * * shipping: Applies a free shipping discount on orders that have a shipping rate less than or equal to amount.
				 * For example, if amount is 30, then the discount will give the customer free shipping for any shipping rate that is less than or equal to $30.
				 */
				type: z
					.enum(['fixed_amount', 'percentage', 'shipping'])
					.default('fixed_amount'),
			}),
		)
		.optional(),
	/**
	 * 🔒
	 * The customer's email address.
	 */
	email: z.string().optional(),
	/**
	 * Whether taxes on the order are estimated. Many factors can change between the time a customer places an order and the time the order is shipped, which could affect the calculation of taxes. This property returns false when taxes on the order are finalized and aren't subject to any changes.
	 */
	estimated_taxes: z.boolean().optional(),
	/**
	 * The status of payments associated with the order. Can only be set when the order is created. Valid values:
	 * * pending: The payments are pending. Payment might fail in this state. Check again to confirm whether the payments have been paid successfully.
	 * * authorized: The payments have been authorized.
	 * * partially_paid: The order has been partially paid.
	 * * paid: The payments have been paid.
	 * * partially_refunded: The payments have been partially refunded.
	 * * refunded: The payments have been refunded.
	 * * voided: The payments have been voided.
	 */
	financial_status: z
		.enum([
			'pending',
			'authorized',
			'partially_paid',
			'paid',
			'partially_refunded',
			'refunded',
			'voided',
		])
		.optional(),
	fulfillments: z.array(FulfillmentSchema).optional(),
	/**
	 * The order's status in terms of fulfilled line items. You can use the FulfillmentOrder resource for a more granular view. Valid values:
	 * * fulfilled: Every line item in the order has been fulfilled.
	 * * null: None of the line items in the order have been fulfilled.
	 * * partial: At least one line item in the order has been fulfilled.
	 * * restocked: Every line item in the order has been restocked and the order canceled.
	 */
	fulfillment_status: z.enum(['fulfilled', 'partial', 'restocked']).optional(),
	/**
	 * The ID of the order, used for API purposes. This is different from the order_number property, which is the ID used by the shop owner and customer.'
	 */
	id: z.number(),
	/**
	 * The URL for the page where the buyer landed when they entered the shop.
	 */
	landing_site: z.string().optional(),
	/**
	 * A list of line item objects, each containing information about an item in the order.
	 */
	line_items: z.array(LineItemTypeSchema),
	/**
	 * The ID of the physical location where the order was processed. To determine the locations where the line items are assigned for fulfillment please use the FulfillmentOrder resource.
	 */
	location_id: z.number().optional(),
	/**
	 * The order name, generated by combining the order_number property with the order prefix and suffix that are set in the merchant's general settings. This is different from the id property, which is the ID of the order used by the API. This field can also be set by the API to be any string value.
	 */
	name: z.string(),
	/**
	 * An optional note that a shop owner can attach to the order.
	 */
	note: z.string().optional(),
	/**
	 * Extra information that is added to the order. Appears in the Additional details section of an order details page. Each array entry must contain a hash with name and value keys.
	 */
	note_attributes: z
		.array(z.object({ name: z.string(), value: z.string() }))
		.optional(),
	/**
	 * The order's position in the shop's count of orders. Numbers are sequential and start at 1.
	 */
	number: z.number(),
	/**
	 * The order 's position in the shop's count of orders starting at 1001. Order numbers are sequential and start at 1001.
	 */
	order_number: z.number(),
	/**
	 * The original total duties charged on the order in shop and presentment currencies.
	 */
	original_total_duties_set: z
		.object({
			original_total_duties_set: z.object({
				shop_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
				presentment_money: z.object({
					amount: z.string(),
					currency_code: z.string(),
				}),
			}),
		})
		.optional(),
	payment_terms: z
		.object({
			amount: z.number(),
			currency: z.string(),
			payment_terms_name: z.string(),
			payment_terms_type: z.string(),
			due_in_days: z.number(),
			payment_schedules: z.array(
				z.object({
					amount: z.number(),
					currency: z.string(),
					issued_at: z.string(),
					due_at: z.string(),
					completed_at: z.string(),
					expected_payment_method: z.string(),
				}),
			),
		})
		.optional(),
	payment_gateway_names: z.array(z.string()).optional(),
	/**
	 * 🔒
	 * The customer's phone number for receiving SMS notifications.
	 */
	phone: z.string().optional(),
	/**
	 * The presentment currency that was used to display prices to the customer.
	 */
	presentment_currency: z.string().optional(),
	/**
	 * The date and time (ISO 8601 format) when an order was processed. This value is the date that appears on your orders and that's used in the analytic reports. If you're importing orders from an app or another platform, then you can set processed_at to a date and time in the past to match when the original order was created.
	 */
	processed_at: z.string(),
	processing_method: z.string().optional(),
	/**
	 * The website where the customer clicked a link to the shop.
	 */
	referring_site: z.string().optional(),
	/**
	 * A list of refunds applied to the order. For more information, see the Refund API.
	 */
	refunds: z
		.array(
			z.object({
				id: z.number(),
				order_id: z.number(),
				created_at: z.string(),
				note: z.null(),
				user_id: z.null(),
				processed_at: z.string(),
				refund_line_items: z.array(z.unknown()),
				transactions: z.array(z.unknown()),
				order_adjustments: z.array(z.unknown()),
			}),
		)
		.optional(),
	/**
	 * The mailing address to where the order will be shipped. This address is optional and will not be available on orders that do not require shipping.
	 */
	shipping_address: AddressesSchema.optional(),
	/**
	 * An array of objects, each of which details a shipping method used.
	 */
	shipping_lines: z.array(ShippingLineSchema),
	/**
	 * The source of the checkout. To use this field for sales attribution, you must register the channels that your app is managing. You can register the channels that your app is managing by completing this Google Form. After you've submited your request, you need to wait for your request to be processed by Shopify. You can find a list of your channels in the Partner Dashboard, in your app's Marketplace extension. You can specify a handle as the source_name value in your request.
	 */
	source_name: z.string().optional(),
	/**
	 * The ID of the order placed on the originating platform. This value doesn't correspond to the Shopify ID that's generated from a completed draft.
	 */
	source_identifier: z.string().optional(),
	/**
	 * A valid URL to the original order on the originating surface. This URL is displayed to merchants on the Order Details page. If the URL is invalid, then it won't be displayed.
	 */
	source_url: z.string().optional(),
	/**
   * The price of the order in the shop currency after discounts but before shipping, duties, taxes, and tips.

   */
	subtotal_price: z.union([z.string(), z.number()]).optional(),
	/**
	 * The subtotal of the order in shop and presentment currencies after discounts but before shipping, duties, taxes, and tips.
	 */
	subtotal_price_set: z.object({
		shop_money: z.object({ amount: z.string(), currency_code: z.string() }),
		presentment_money: z.object({
			amount: z.string(),
			currency_code: z.string(),
		}),
	}),
	/**
	 * Tags attached to the order, formatted as a string of comma-separated values. Tags are additional short descriptors, commonly used for filtering and searching. Each individual tag is limited to 40 characters in length.
	 */
	tags: z.string().optional(),
	/**
	 * An array of tax line objects, each of which details a tax applicable to the order.
	 *
	 * When creating an order through the API, tax lines can be specified on the order or the line items but not both. Tax lines specified on the order are split across the taxable line items in the created order.
	 */
	tax_lines: z.array(TaxLineSchema.omit({ price_set: true })),
	/**
	 * Whether taxes are included in the order subtotal.
	 */
	taxes_included: z.boolean(),
	test: z.boolean(),
	token: z.string().optional(),
	/**
	 * The total discounts applied to the price of the order in the shop currency.
	 */
	total_discounts: z.string().optional(),
	/**
	 * The total discounts applied to the price of the order in shop and presentment currencies.
	 */
	total_discounts_set: z.object({
		shop_money: z.object({ amount: z.string(), currency_code: z.string() }),
		presentment_money: z.object({
			amount: z.string(),
			currency_code: z.string(),
		}),
	}),
	/**
	 * The sum of all line item prices in the shop currency.
	 */
	total_line_items_price: z.string().optional(),
	/**
	 * The total of all line item prices in shop and presentment currencies.
	 */
	total_line_items_price_set: z
		.object({
			shop_money: z.object({ amount: z.string(), currency_code: z.string() }),
			presentment_money: z.object({
				amount: z.string(),
				currency_code: z.string(),
			}),
		})
		.optional(),
	/**
	 * The total outstanding amount of the order in the shop currency.
	 */
	total_outstanding: z.string().optional(),
	/**
	 * The sum of all line item prices, discounts, shipping, taxes, and tips in the shop currency. Must be positive.
	 */
	total_price: z.union([z.string(), z.number()]).optional(),
	/**
	 * The total price of the order in shop and presentment currencies.
	 */
	total_price_set: z.object({
		shop_money: z.object({ amount: z.string(), currency_code: z.string() }),
		presentment_money: z.object({
			amount: z.string(),
			currency_code: z.string(),
		}),
	}),
	/**
	 * The total shipping price of the order, excluding discounts and returns, in shop and presentment currencies. If taxes_included is set to true, then total_shipping_price_set includes taxes.
	 */
	total_shipping_price_set: z.object({
		shop_money: z.object({ amount: z.string(), currency_code: z.string() }),
		presentment_money: z.object({
			amount: z.string(),
			currency_code: z.string(),
		}),
	}),
	/**
	 * The sum of all the taxes applied to the order in the shop currency. Must be positive.
	 */
	total_tax: z.union([z.string(), z.number()]).optional(),
	/**
	 * The total tax applied to the order in shop and presentment currencies.
	 */
	total_tax_set: z.object({
		shop_money: z.object({ amount: z.string(), currency_code: z.string() }),
		presentment_money: z.object({
			amount: z.string(),
			currency_code: z.string(),
		}),
	}),
	/**
	 * The sum of all the tips in the order in the shop currency.
	 */
	total_tip_received: z.string().optional(),
	/**
	 * The sum of all line item weights in grams. The sum is not adjusted as items are removed from the order.
	 */
	total_weight: z.number().optional(),
	/**
	 * Orders last updated after date specified.
	 */
	updated_at: z.string(),
	/**
	 * The ID of the user logged into Shopify POS who processed the order, if applicable.
	 */
	user_id: z.number().optional(),
	/**
	 * The URL pointing to the order status web page, if applicable.
	 */
	order_status_url: z.string().optional(),

	/**
	 * Whether to send an order confirmation to the customer.
	 */
	send_receipt: z.boolean().optional(),
})
