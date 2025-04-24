import { PrismaClient } from '@prisma/client';

// add prisma to the NodeJS global type
declare global {
   
  namespace NodeJS {
    // // add prisma to the NodeJS global type
    export interface CustomNodeJsGlobal {
      prisma: PrismaClient;
    }
  }
}
// }

// Prevent multiple instances of Prisma Client in development
declare const global: NodeJS.CustomNodeJsGlobal;
const prisma: PrismaClient =
  global.prisma || new PrismaClient({ log: ['info'] });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export { prisma };
