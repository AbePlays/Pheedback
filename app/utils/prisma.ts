import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

let db: PrismaClient

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient({ adapter })
  db.$connect()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter })
    global.prisma.$connect()
  }
  db = global.prisma
}

export { db }
