import { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/AppError"
import { logger } from "../../config/logger"
import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

/**
 * Centralized Error Handler Middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Default error values
  let statusCode = 500
  let message = "Internal server error"
  let errors: any = undefined

  // Handle known AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  }
  // Handle Prisma errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400
    message = handlePrismaError(err)
  }
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 422
    message = "Validation failed"
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }))
  }
  // Handle JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401
    message = "Invalid token"
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401
    message = "Token expired"
  }
  // Unknown errors
  else {
    message = err.message || "Internal server error"
  }

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
  })

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

/**
 * Handle Prisma-specific errors
 */
const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
): string => {
  switch (err.code) {
    case "P2002":
      return `Duplicate field value: ${err.meta?.target}`
    case "P2014":
      return "Invalid ID"
    case "P2003":
      return "Invalid input data"
    case "P2025":
      return "Record not found"
    default:
      return "Database error occurred"
  }
}

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
}
