import { Router } from 'express'
import { postGraphqlProxy } from './controllers/post-graphql-proxy.controller.js'

const graphqlRouter = Router()

graphqlRouter.post('/', postGraphqlProxy)

export default graphqlRouter
