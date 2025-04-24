import { z } from 'zod';

export const TransactionTypeSchema = z.object({
  amount: z.union([z.string(), z.number()]),
  authorization: z.string().optional().nullable(),
  authorization_expires_at: z.string().optional(),
  created_at: z.string(),
  currency: z.string().optional(),
  device_id: z.number(),
  error_code: z.string(),
  extended_authorization_attributes: z
    .object({
      standard_authorization_expires_at: z.string(),
      extended_authorization_expires_at: z.string(),
    })
    .optional(),
  gateway: z.string(),
  id: z.number(),
  /**
   * The transaction's type.
   *
   * * authorization: Money that the customer has agreed to pay. The authorization period can be between 7 and 30 days (depending on your payment service) while a store waits for a payment to be captured.
   * * capture: A transfer of money that was reserved during the authorization of a shop.
   * * sale: The authorization and capture of a payment performed in one single step.
   * * void: The cancellation of a pending authorization or capture.
   * * refund: The partial or full return of captured money to the customer.
   */
  kind: z.enum(['authorization', 'capture', 'sale', 'refund']),
  location_id: z.object({ id: z.number() }),
  message: z.string(),
  order_id: z.number().optional(),
  payment_details: z.object({
    credit_card_bin: z.string(),
    avs_result_code: z.string(),
    cvv_result_code: z.string(),
    credit_card_number: z.string(),
    credit_card_company: z.string(),
  }),
  parent_id: z.number().optional(),
  payments_refund_attributes: z
    .object({
      status: z.string(),
      acquirer_reference_number: z.string(),
    })
    .optional(),
  processed_at: z.string().optional(),
  receipt: z.object({}),
  source_name: z.string(),
  /**
   * The status of the transaction.
   */
  status: z.enum(['pending', 'failure', 'success', 'error']),
  test: z.boolean().optional(),
  user_id: z.number().optional(),
  currency_exchange_adjustment: z
    .object({
      id: z.number(),
      adjustment: z.string(),
      original_amount: z.string(),
      final_amount: z.string(),
      currency: z.string(),
    })
    .optional(),
});
