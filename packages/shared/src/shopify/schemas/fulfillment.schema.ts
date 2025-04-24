import { z } from 'zod';

export const FulfillmentSchema = z.object({
  /**
   * The date and time when the fulfillment was created. The API returns this value in ISO 8601 format.
   */
  created_at: z.string(),
  /**
   * The ID for the fulfillment.
   */
  id: z.number(),
  /**
   * A list of the fulfillment's line items, which includes:
   */
  line_items: z.array(
    z.object({
      /**
       * The ID of the line item within the fulfillment.
       */
      id: z.number(),
      variant_id: z.number(),
      title: z.string(),
      quantity: z.number(),
      price: z.string(),
      grams: z.number(),
      sku: z.string(),
      variant_title: z.string().optional().nullable(),
      vendor: z.string().optional(),
      product_id: z.number(),
      requires_shipping: z.boolean(),
      taxable: z.boolean(),
      gift_card: z.boolean(),
      name: z.string(),
      /**
       * The name of the inventory management system.
       */
      variant_inventory_management: z.string().optional().nullable(),
      properties: z.array(z.unknown()),
      product_exists: z.boolean(),
      fulfillable_quantity: z.number(),
      total_discount: z.string(),
      /**
       * The status of an order in terms of the line items being fulfilled. Valid values: fulfilled, null, or partial. This field will be deprecated. Use the status property on the FulfillmentOrder resource instead.
       */
      fulfillment_status: z.string().optional().nullable(),
      /**
       * A unique identifier for a quantity of items within a single fulfillment. An order can have multiple fulfillment line items.
       */
      fulfillment_line_item_id: z.number().optional().nullable(),
      tax_lines: z.array(z.unknown()),
      duties: z.array(
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
          tax_lines: z.array(
            z.object({
              title: z.string(),
              price: z.string(),
              rate: z.number(),
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
            })
          ),
          admin_graphql_api_id: z.string(),
        })
      ),
    })
  ),
  location_id: z.number(),
  name: z.string(),
  /**
   * Whether the customer should be notified. If set to true, then an email will be sent when the fulfillment is created or updated. For orders that were initially created using the API, the default value is false. For all other orders, the default value is true.
   */
  notify_customer: z.boolean().optional(),
  order_id: z.number(),
  /**
   * The address from which the fulfillment occurred:
   */
  origin_address: z
    .object({
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      country_code: z.string().optional(),
      province_code: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
  receipt: z.object({
    testcase: z.boolean().optional(),
    authorization: z.string().optional(),
  }),
  service: z.string(),
  /**
   * The current shipment status of the fulfillment. Valid values:
   *
   * * label_printed: A label for the shipment was purchased and printed.
   * * label_purchased: A label for the shipment was purchased, but not printed.
   * * attempted_delivery: Delivery of the shipment was attempted, but unable to be completed.
   * * ready_for_pickup: The shipment is ready for pickup at a shipping depot.
   * * confirmed: The carrier is aware of the shipment, but hasn't received it yet.
   * * in_transit: The shipment is being transported between shipping facilities on the way to its destination.
   * * out_for_delivery: The shipment is being delivered to its final destination.
   * * delivered: The shipment was succesfully delivered.
   * * failure: Something went wrong when pulling tracking information for the shipment, such as the tracking number was invalid or the shipment was canceled.
   */
  shipment_status: z
    .enum([
      'label_printed',
      'label_purchased',
      'attempted_delivery',
      'ready_for_pickup',
      'confirmed',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'failure',
    ])
    .optional()
    .nullable(),
  status: z.string(),
  /**
  The name of the tracking company. The following tracking companies display for shops located in any country:
 */
  tracking_company: z.string().optional().nullable(),
  tracking_numbers: z.array(z.string()),
  tracking_urls: z.array(z.string()),
  updated_at: z.string(),
  /**
   * The name of the inventory management service.
   */
  variant_inventory_management: z.string().optional(),
});
