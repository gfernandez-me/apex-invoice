import { prisma } from './db/client.js'
import { PrismaSessionStorage } from './db/session/PrismaSessionStorage.js'

const sessionStorage = new PrismaSessionStorage(prisma)

export { sessionStorage }
