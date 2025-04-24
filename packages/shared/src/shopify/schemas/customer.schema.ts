import { z } from 'zod'
import { AddressesSchema } from './common/address.schema.js'
/**
 * Information about the customer. The order might not have a customer and apps should not depend on the existence of a customer object. This value might be null if the order was created through Shopify POS.
 */
export const CustomerSchema = z.object({
	/**
	 * A unique identifier for the customer.
	 */
	id: z.number().optional(),
	/**
	 * The unique email address of the customer. Attempting to assign the same email address to multiple customers returns an error.
	 */
	email: z.string().optional(),
	/**
	 * The marketing consent information when the customer consented to receiving marketing material by email. The email property is required to create a customer with email consent information and to update a customer for email consent that doesn't have an email recorded. The customer must have a unique email address associated to the record. The email marketing consent has the following properties:
	 */
	email_marketing_consent: z
		.object({
			state: z.string(),
			opt_in_level: z.string().optional(),
			consent_updated_at: z.string().optional(),
		})
		.optional(),
	/**
	 * The date and time (ISO 8601 format) when the customer was created.
	 */

	created_at: z.string().optional(),
	/**
	 * The date and time (ISO 8601 format) when the customer information was last updated.
	 */
	updated_at: z.string().optional(),
	/**
	 * The customer's first name.
	 */
	first_name: z.string().optional(),
	/**
	 * The customer's last name.
	 */
	last_name: z.string().optional(),
	/**
	 * The state of the customer's account with a shop. Default value: disabled. Valid values:
	 *
	 * * disabled: The customer doesn't have an active account. Customer accounts can be disabled from the Shopify admin at any time.
	 * * invited: The customer has received an email invite to create an account.
	 * * enabled: The customer has created an account.
	 * * declined: The customer declined the email invite to create an account.
	 */
	state: z.enum(['disabled', 'invited', 'enabled', 'enabled']).optional(),
	/**
	 * A note about the customer.
	 */
	note: z.string().optional(),
	/**
	 * The number of orders associated with this customer. Test and archived orders aren't counted.
	 */
	orders_count: z.union([z.string(), z.number()]).optional(),
	/**
	 * Whether the customer has verified their email address.
	 */
	verified_email: z.boolean().optional(),
	/**
	 * A unique identifier for the customer that's used with ' 'Multipass login.
	 */
	multipass_identifier: z.string().optional(),
	/**
	 * Whether the customer is exempt from paying taxes on their order. If true, then taxes won't be applied to an order at checkout. If false, then taxes will be applied at checkout.
	 */
	tax_exempt: z.boolean().optional(),
	/**
	 * Whether the customer is exempt from paying specific taxes on their order. Canadian taxes only. Valid values:
	 */
	tax_exemptions: z.array(z.string()).optional(),
	/**
	 * The unique phone number (E.164 format) for this customer. Attempting to assign the same phone number to multiple customers returns an error. The property can be set using different formats, but each format must represent a number that can be dialed from anywhere in the world. The following formats are all valid:
	 * * 6135551212
	 * * +16135551212
	 * * (613)555-1212
	 * * +1 613-555-1212
	 */
	phone: z.string().optional(),
	/**
	 * Tags that the shop owner has attached to the customer, formatted as a string of comma-separated values. A customer can have up to 250 tags. Each tag can have up to 255 characters.
	 */
	tags: z.string().optional(),
	/**
	 * The three-letter code (ISO 4217 format) for the currency that the customer used when they paid for their last order. Defaults to the shop currency. Returns the shop currency for test orders.
	 */
	currency: z.string().optional(),
	/**
	 * A list of the ten most recently updated addresses for the customer.
	 */
	addresses: z.array(AddressesSchema).optional(),
	admin_graphql_api_id: z.string().optional(),
	/**
	 * The default address for the customer.
	 */
	default_address: AddressesSchema.optional(),

	/**
   * The total amount of money that the customer has spent across their order history.

   */
	total_spent: z.union([z.number(), z.string()]).optional(),

	/**
	 * The name of the customer's last order. This is directly related to the name field on the Order resource.
	 */
	last_order_name: z.string().optional(),
})
