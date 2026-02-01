import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../../config/db"
import { config } from "../../config/env"
import { ConflictError, UnauthorizedError } from "../../shared/errors/AppError"
import { RegisterInput, LoginInput, AuthResponse } from "./auth.types"

/**
 * Auth Service
 * Handles business logic for authentication
 */
export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new ConflictError("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    // Generate JWT token
    const token = this.generateToken(user.id, user.email)

    return {
      user,
      token,
    }
  }

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new UnauthorizedError("Invalid credentials")
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials")
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new UnauthorizedError("User not found")
    }

    return user
  }

  /**
   * Generate JWT token
   */
  private generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    })
  }
}

export const authService = new AuthService()
