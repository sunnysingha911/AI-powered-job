import { Request, Response, NextFunction } from "express"
import { authService } from "./auth.service"
import { RegisterInput, LoginInput } from "./auth.types"
import { AuthRequest } from "../../shared/middlewares/auth"

/**
 * Auth Controller
 * Handles HTTP requests and responses
 */
export class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data: RegisterInput = req.body
      const result = await authService.register(data)

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginInput = req.body
      const result = await authService.login(data)

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  async getMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new Error("User not authenticated")
      }

      const user = await authService.getProfile(req.user.id)

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }
}

export const authController = new AuthController()
