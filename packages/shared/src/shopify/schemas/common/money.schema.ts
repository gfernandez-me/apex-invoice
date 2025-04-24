import { z } from 'zod';

export const MoneySchema = z.object({
  /**
   * Decimal money amount.
   */
  amount: z.string(),
  /**
   * Currency of the money.
   */
  currency_code: z.string(),
});

export const PriceSetSchema = z.object({
  shop_money: MoneySchema,
  presentment_money: MoneySchema,
});
