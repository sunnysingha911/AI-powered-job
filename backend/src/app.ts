import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"

import { config } from "./config/env"
import { logger, morganStream } from "./config/logger"
import { checkDatabaseHealth } from "./config/db"
import {
  errorHandler,
  notFoundHandler,
} from "./shared/middlewares/errorHandler"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger"

// Import routes
import authRoutes from "./modules/auth/auth.routes"

/**
 * Express Application Setup
 */
const app = express()

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet())
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
)

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// ============================================
// LOGGING MIDDLEWARE
// ============================================
app.use(
  morgan(config.server.isDevelopment ? "dev" : "combined", {
    stream: morganStream,
  }),
)

// ============================================
// Swagger
// ============================================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the application and database
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "OK" }
 *                 timestamp: { type: string, format: date-time }
 *                 environment: { type: string }
 *                 database: { type: string, example: "connected" }
 *       503:
 *         description: Service is degraded
 */
app.get("/health", async (req, res) => {
  const dbHealthy = await checkDatabaseHealth()

  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? "OK" : "DEGRADED",
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    database: dbHealthy ? "connected" : "disconnected",
  })
})

// ============================================
// API ROUTES
// ============================================
app.use("/api/auth", authRoutes)

// TODO: Add more routes here
// app.use("/api/resumes", resumeRoutes);
// app.use("/api/jobs", jobRoutes);
// app.use("/api/applications", applicationRoutes);

// ============================================
// ERROR HANDLING
// ============================================
app.use(notFoundHandler) // 404 handler
app.use(errorHandler) // Centralized error handler

export default app
