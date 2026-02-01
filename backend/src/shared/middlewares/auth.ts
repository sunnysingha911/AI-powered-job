import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../../config/env"
import { UnauthorizedError } from "../errors/AppError"
import { prisma } from "../../config/db"

/**
 * JWT Payload Interface
 */
export interface JwtPayload {
  userId: string
  email: string
}

/**
 * Extended Request with user information
 */
export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided")
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload

    // Optional: Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    })

    if (!user) {
      throw new UnauthorizedError("User not found")
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid token"))
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError("Token expired"))
    } else {
      next(error)
    }
  }
}

/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't fail if missing
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true },
      })

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
        }
      }
    }
    next()
  } catch (error) {
    // Silently fail for optional auth
    next()
  }
}
