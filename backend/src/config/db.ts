import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import { logger } from "./logger"

// Load env vars if not already loaded (though usually loaded in server.ts)
// import "dotenv/config"

const connectionString = process.env.DATABASE_URL

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

/**
 * Prisma Client Singleton
 * Prevents multiple instances in development (hot reload)
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

/**
 * Initialize Prisma Client with logging configuration
 */
export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  })

// Log queries in development
if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    logger.debug(`Query: ${e.query}`)
    logger.debug(`Duration: ${e.duration}ms`)
  })
}

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

/**
 * Connect to database
 * Called during server startup
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect()
    logger.info("✅ Database connected successfully")
  } catch (error) {
    logger.error("❌ Database connection failed:", error)
    process.exit(1)
  }
}

/**
 * Disconnect from database
 * Called during graceful shutdown
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect()
    logger.info("✅ Database disconnected successfully")
  } catch (error) {
    logger.error("❌ Database disconnection failed:", error)
  }
}

/**
 * Health check for database connection
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    logger.error("Database health check failed:", error)
    return false
  }
}
