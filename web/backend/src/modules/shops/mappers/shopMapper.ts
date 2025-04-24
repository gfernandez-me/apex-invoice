import { parseGid } from '@apex/shared'
import { type Prisma } from '@prisma/client'
import { type GetShopProfileQuery } from '../../../graphql/generated.js'

export function toShop(
	shop: GetShopProfileQuery['shop'],
): Prisma.ShopCreateInput {
	const {
		id,
		url,
		primaryDomain: { host },
		billingAddress,
		email,
		contactEmail,
		currencyCode,
		name,
		myshopifyDomain,
	} = shop

	const billing_address = toAddress(billingAddress)

	return {
		id: parseGid(id).toString(),
		url,
		host,
		billing_address,
		email,
		contact_email: contactEmail,
		currency_code: currencyCode,
		shopify_domain: myshopifyDomain,
		name,
	}
}

function toAddress(
	billingAddress: GetShopProfileQuery['shop']['billingAddress'],
): Prisma.ShopCreateInput['billing_address'] {
	const {
		address1,
		address2,
		city,
		phone,
		latitude,
		longitude,
		country,
		countryCodeV2,
		provinceCode,
		province,
		zip,
	} = billingAddress

	return {
		address1,
		address2,
		city,
		phone,
		latitude,
		longitude,
		country,
		country_code: countryCodeV2,
		province_code: provinceCode,
		province,
		zip,
	}
}
