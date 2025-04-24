import { z } from 'zod';

/**
 * The discount applied to the line item or the draft order resource. Each draft order resource can have one applied_discount resource and each draft order line item can have its own applied_discount.
 */
export const AppliedDiscountSchema = z.object({
  /**
   * Title of the discount.
   */
  title: z.string().optional(),

  /**
   * Reason for the discount.
   */
  description: z.string().optional(),
  /**
   * The value of the discount. If the type of discount is fixed_amount, then it corresponds to a fixed dollar amount. If the type is percentage, then it corresponds to percentage.
   */
  value: z.union([z.string(), z.number()]),
  /**
   * The type of discount. Valid values: percentage, fixed_amount.
   */
  value_type: z.enum(['percentage', 'fixed_amount']),
  /**
   * The applied amount of the discount, based on the setting of value_type
   */
  amount: z.union([z.string(), z.number()]).optional(),
});
