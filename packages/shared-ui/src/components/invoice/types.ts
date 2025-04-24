import { type RouterOutput } from '../../../../../web/backend/src/server/routers/index.js'

export type InoiceByIdOutput = RouterOutput['invoice']['byId']
export type LineItem = InoiceByIdOutput['line_items'][number]
export type ShopCompany = InoiceByIdOutput['shop']
