import type * as ShopifyResource from '@apex/shared';
import { type Prisma } from '@prisma/client';

export function mapMoneyBag(
  moneyBag: ShopifyResource.LineItem['price_set']
): Prisma.MoneyBagCreateInput {
  return {
    presentment_money: mapMoney(moneyBag.presentment_money),
    shop_money: mapMoney(moneyBag.shop_money),
  };
}

export function mapMoney(
  money: ShopifyResource.LineItem['price_set']['shop_money']
): Prisma.MoneyCreateInput {
  const { amount, currency_code } = money;
  return { amount, currency_code, approx: parseFloat(amount) };
}
