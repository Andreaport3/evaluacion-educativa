import { PrismaClient } from '@prisma/client'

<<<<<<< HEAD
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
=======
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
>>>>>>> d275669 (Conecta evaluaciones con la base de datos)
}

export const prisma =
  globalForPrisma.prisma ??
<<<<<<< HEAD
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
=======
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
>>>>>>> d275669 (Conecta evaluaciones con la base de datos)
