import shopify from '../../../lib/shopify.js'
import { createExciseProductsQuery } from './exciseProductVariantQuery.js'
import { createProductVariantQuery } from './getProductVariantQuery.js'

const exciseProductsQuery = createExciseProductsQuery(shopify)

const productVariantQuery = createProductVariantQuery(shopify)

export { exciseProductsQuery, productVariantQuery }
