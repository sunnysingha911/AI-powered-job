import dotenv from "dotenv"
dotenv.config()

import app from "./app"
import { config } from "./config/env"
import { logger } from "./config/logger"
import { connectDatabase, disconnectDatabase } from "./config/db"

/**
 * Start Server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase()

    // Start Express server
    const server = app.listen(config.server.port, () => {
      logger.info(`🚀 Server running on port ${config.server.port}`)
      logger.info(`📝 Environment: ${config.server.env}`)
      logger.info(
        `🔗 Health check: http://localhost:${config.server.port}/health`,
      )
    })

    // ============================================
    // GRACEFUL SHUTDOWN
    // ============================================
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received. Starting graceful shutdown...`)

      server.close(async () => {
        logger.info("HTTP server closed")

        // Disconnect from database
        await disconnectDatabase()

        logger.info("Graceful shutdown completed")
        process.exit(0)
      })

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Forced shutdown due to timeout")
        process.exit(1)
      }, 10000)
    }

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))

    // Handle uncaught errors
    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception:", error)
      gracefulShutdown("UNCAUGHT_EXCEPTION")
    })

    process.on("unhandledRejection", (reason: any) => {
      logger.error("Unhandled Rejection:", reason)
      gracefulShutdown("UNHANDLED_REJECTION")
    })
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Start the server
startServer()
